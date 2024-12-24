export interface QuestionOption {
  id: string;
  text: string;
}

export type QuestionType = 'multiple-choice' | 'true-false' | 'text-input';

export interface TriviaQuestion {
  id: string;
  type: QuestionType;
  question: string;
  correctAnswer: string | boolean;
  explanation: string;
  options?: QuestionOption[];
  acceptableAnswers?: string[];
}

export interface Category {
  name: string;
  description: string;
  subcategories: string[];
}

export interface TriviaGame {
  topic: string;
  categories: Category[];
  questions: TriviaQuestion[];
  total_questions: number;
  difficulty_distribution: Record<string, number>;
}

export interface GameConfig {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
} 