export interface Flashcard {
  id: number;
  ticket: number;
  variant: number;
  question: string;
  answer: string;
}

export interface FlashcardSession {
  cards: Flashcard[];
  currentIndex: number;
}

export interface AnswerCheckResult {
  state: 'correct' | 'partially_correct' | 'incorrect';
  description: string;
}