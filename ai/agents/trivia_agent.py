from phi.assistant import Assistant
from phi.knowledge import Knowledge
from typing import List
from ..models.schemas import Category, TriviaQuestion, TriviaGame
from ..storage.vector_store import TriviaVectorStore

class TriviaAgent:
    def __init__(self):
        
        self.vector_store = TriviaVectorStore()
        self.knowledge = Knowledge(
            docs_path="knowledge_base",
            embeddings="all-MiniLM-L6-v2"
        )
        
    async def generate_trivia_game(self, topic: str, difficulty: str = "medium", num_questions: int = 10) -> TriviaGame:
        # Initialize assistants from yaml config
        trivia_master = Assistant(
            name="trivia_master",
            knowledge=self.knowledge
        )
        
        # Generate categories
        categories_response = await trivia_master.run(
            task="generate_categories",
            args={"topic": topic}
        )
        
        categories: List[Category] = [
            Category(**cat) for cat in categories_response["categories"]
        ]
        
        # Generate questions using structured output
        questions: List[TriviaQuestion] = []
        for category in categories:
            for subcategory in category.subcategories:
                category_questions = await self.generate_questions(
                    category.name,
                    subcategory,
                    difficulty,
                    num_questions // len(categories) // len(category.subcategories)
                )
                questions.extend(category_questions)
        
        # Create and return trivia game
        return TriviaGame(
            topic=topic,
            categories=categories,
            questions=questions,
            total_questions=len(questions),
            difficulty_distribution={difficulty: len(questions)}
        )
    
    async def generate_questions(
        self,
        category: str,
        subcategory: str, 
        difficulty: str,
        count: int
    ) -> List[TriviaQuestion]:
        question_generator = Assistant(
            name="question_generator",
            knowledge=self.knowledge
        )
        
        response = await question_generator.run(
            task="create_question_set",
            args={
                "category": category,
                "subcategory": subcategory, 
                "difficulty": difficulty,
                "count": count,
                "format": {
                    "types": ["multiple-choice", "true-false", "text-input"],
                    "requireExplanation": True,
                    "requireOptions": True
                }
            }
        )
        
        questions = []
        for q in response["questions"]:
            question = TriviaQuestion(
                id=str(len(questions) + 1),
                type=q["type"],
                question=q["question"],
                correctAnswer=q["correctAnswer"],
                explanation=q["explanation"],
                options=q.get("options"),
                acceptableAnswers=q.get("acceptableAnswers", [])
            )
            questions.append(question)
        
        return questions