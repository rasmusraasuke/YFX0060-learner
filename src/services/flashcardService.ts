import { Flashcard } from '../types/flashcard';
import * as fs from 'fs';
import * as path from 'path';

export class FlashcardService {
  private flashcards: Flashcard[] = [];

  constructor() {
    this.loadFlashcards();
  }

  private loadFlashcards(): void {
    try {
      const dataPath = path.join(__dirname, '../../data/questions.json');
      const data = fs.readFileSync(dataPath, 'utf-8');
      this.flashcards = JSON.parse(data);
    } catch (error) {
      console.error('Error loading flashcards:', error);
      this.flashcards = [];
    }
  }

  getRandomFlashcards(count: number): Flashcard[] {
    if (count >= this.flashcards.length) {
      return [...this.flashcards];
    }

    const shuffled = [...this.flashcards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  getAllFlashcards(): Flashcard[] {
    return [...this.flashcards];
  }

  checkAnswer(cardId: number, userAnswer: string): boolean {
    const card = this.flashcards.find(c => c.id === cardId);
    if (!card) return false;
    
    return card.answer.trim().toLowerCase() === userAnswer.trim().toLowerCase();
  }

  getCorrectAnswer(cardId: number): string | null {
    const card = this.flashcards.find(c => c.id === cardId);
    return card ? card.answer : null;
  }
}