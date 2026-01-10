import { Flashcard, AnswerCheckResult } from "../types/flashcard";
import * as fs from "fs";
import * as path from "path";

interface ClaudeContent {
  type: string;
  text?: string;
}

interface ClaudeResponse {
  content: ClaudeContent[];
}

export class FlashcardService {
  private flashcards: Flashcard[] = [];

  constructor() {
    this.loadFlashcards();
  }

  private loadFlashcards(): void {
    try {
      const dataPath = path.join(__dirname, "../../data/questions.json");
      const data = fs.readFileSync(dataPath, "utf-8");
      this.flashcards = JSON.parse(data);
    } catch (error) {
      console.error("Error loading flashcards:", error);
      this.flashcards = [];
    }
  }

  getVariantFlashcards(variant: number): Flashcard[] {
    const variantCards = this.flashcards
      .filter((card) => card.variant === variant)
      .sort((a, b) => a.ticket - b.ticket);
    
    return variantCards;
  }

  getRandomTicket(): { cards: Flashcard[], ticket: number } {
    const tickets = [...new Set(this.flashcards.map(card => card.ticket))];
    const randomTicket = tickets[Math.floor(Math.random() * tickets.length)];
    
    const cards = this.flashcards.filter(card => card.ticket === randomTicket);
    
    return { cards, ticket: randomTicket };
  }

  async checkAnswer(
    cardId: number,
    userAnswer: string,
  ): Promise<AnswerCheckResult> {
    const card = this.flashcards.find((c) => c.id === cardId);
    if (!card) {
      return {
        state: "incorrect",
        description: "Question not found.",
      };
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Sa hindad flashcardi vastust.
              Küsimus: ${card.question}
              Õige vastus: ${card.answer}
              Kasutaja vastus: ${userAnswer}
              
              Palun otsusta, kas kasutaja vastus on korrektne, osaliselt korrektne või vale.
 
              Vasta sina vormis: "Su vastus on õige" või "Su vastuses on vale see ja teine".
              
              Vasta AINULT JSON objektiga selles kindlas formaadis (ei markdown ja ei backtickid):
              
              {
              "state": "correct" | "partially_correct" | "incorrect",
              "description": "Lühike seletus, mis on valesti, kui midagi oli valesti ja kui vastus on õige, siis lihtsalt vasta, et antud vastus on õige"
              }

              Reeglid:
              - "correct": Vastus annab õige mõtte edasi, isegi kui on sõnastatud teisiti. (Kirjavead ei loe, aga too need välja kindlasti)
              - "partially_correct": Vastus on kohati õige või omab õigeid elemente, aga ei ole täiesti õige.
              - "incorrect": Vastus on vale või ei saa peamisele mõttele pihta`,
            },
          ],
        }),
      });

      const data = await response.json() as ClaudeResponse;
      const text = data.content
        .map((item: any) => item.text || "")
        .join("\n")
        .trim();

      const cleanText = text.replace(/```json\n?|```\n?/g, "").trim();
      const result = JSON.parse(cleanText);

      return {
        state: result.state,
        description: result.description,
      };
    } catch (error) {
      console.error("Error checking answer with Claude:", error);
      const isExactMatch =
        card.answer.trim().toLowerCase() === userAnswer.trim().toLowerCase();
      return {
        state: isExactMatch ? "correct" : "incorrect",
        description: isExactMatch
          ? "Su vastus on õige"
          : `Õige vastus on: ${card.answer}`,
      };
    }
  }

  getCorrectAnswer(cardId: number): string | null {
    const card = this.flashcards.find((c) => c.id === cardId);
    return card ? card.answer : null;
  }
}
