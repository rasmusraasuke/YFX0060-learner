export interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

export interface FlashcardSession {
  cards: Flashcard[];
  currentIndex: number;
}