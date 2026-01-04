import { Router, Request, Response } from 'express';
import { FlashcardService } from '../services/flashcardService';

const router = Router();
const flashcardService = new FlashcardService();

router.get('/cards', (req: Request, res: Response) => {
  const count = req.query.count ? parseInt(req.query.count as string) : null;

  if (count === null) {
    return res.json(flashcardService.getAllFlashcards());
  }

  res.json(flashcardService.getRandomFlashcards(count));
});

router.post('/check-answer', (req: Request, res: Response) => {
  const { cardId, answer } = req.body;

  if (!cardId || answer === undefined) {
    return res.status(400).json({ error: 'Missing cardId or answer' });
  }

  const isCorrect = flashcardService.checkAnswer(cardId, answer);
  const correctAnswer = flashcardService.getCorrectAnswer(cardId);

  res.json({
    isCorrect,
    correctAnswer
  });
});

export default router;
