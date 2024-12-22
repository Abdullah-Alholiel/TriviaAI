export type QuestionType = 'multiple-choice' | 'true-false' | 'text-input';

export interface BaseQuestion {
  id: string;
  question: string;
  type: QuestionType;
  explanation?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: Array<{
    id: string;
    text: string;
  }>;
  correctAnswer: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface TextInputQuestion extends BaseQuestion {
  type: 'text-input';
  correctAnswer: string;
  acceptableAnswers?: string[]; // For flexible matching
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion | TextInputQuestion;