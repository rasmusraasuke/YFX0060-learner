import { Router, Request, Response } from "express";
import { FlashcardService } from "../services/flashcardService";

const router = Router();
const flashcardService = new FlashcardService();

router.get("/cards", (req: Request, res: Response) => {
  const mode = req.query.mode as string;
  const variant = req.query.variant ? parseInt(req.query.variant as string) : null;
  const excludeTicket = req.query.excludeTicket ? parseInt(req.query.excludeTicket as string) : undefined;
  
  if (mode === 'variant' && variant) {
    const cards = flashcardService.getVariantFlashcards(variant);
    return res.json({ cards, currentTicket: null });
  }
  
  if (mode === 'random') {
    const result = flashcardService.getRandomTicket(excludeTicket);
    return res.json({ cards: result.cards, currentTicket: result.ticket });
  }
  
  res.status(400).json({ error: "Invalid mode or variant" });
});

router.post("/check-answer", async (req: Request, res: Response) => {
  const { cardId, answer } = req.body;

  if (!cardId || answer === undefined) {
    return res.status(400).json({ error: "Missing cardId or answer" });
  }

  const result = await flashcardService.checkAnswer(cardId, answer);
  const correctAnswer = flashcardService.getCorrectAnswer(cardId);

  res.json({
    state: result.state,
    description: result.description,
    correctAnswer,
  });
});

export default router;
