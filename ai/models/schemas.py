from pydantic import BaseModel
from typing import List, Union, Optional

class QuestionOption(BaseModel):
    id: str
    text: str

class TriviaQuestion(BaseModel):
    id: str
    type: str  # 'multiple-choice' | 'true-false' | 'text-input'
    question: str
    correctAnswer: Union[str, bool]
    explanation: str
    options: Optional[List[QuestionOption]] = None
    acceptableAnswers: Optional[List[str]] = None

class Category(BaseModel):
    name: str
    description: str
    subcategories: List[str]

class TriviaGame(BaseModel):
    topic: str
    categories: List[Category]
    questions: List[TriviaQuestion]
    total_questions: int
    difficulty_distribution: dict