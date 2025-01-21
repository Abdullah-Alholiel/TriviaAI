from typing import List, Dict, Union, Optional, Literal
from pydantic import BaseModel

QuestionType = Literal['multiple-choice', 'true-false', 'text-input']

class QuestionOption(BaseModel):
    id: str
    text: str

class Category(BaseModel):
    name: str
    description: str
    subcategories: List[str]

class TriviaQuestion(BaseModel):
    id: str
    type: QuestionType
    question: str
    correctAnswer: Union[str, bool]
    explanation: str
    options: Optional[List[QuestionOption]] = None
    acceptableAnswers: Optional[List[str]] = None

class TriviaGame(BaseModel):
    topic: str
    categories: List[Category]
    questions: List[TriviaQuestion]
    total_questions: int
    difficulty_distribution: Dict[str, int]