from phi.assistant import Assistant
from phi.llm.openai import OpenAIChat
from phi.vectordb.pgvector import PGVector
from typing import List
import os
from dotenv import load_dotenv
from ..models.schemas import Category, TriviaQuestion, TriviaGame
import yaml

load_dotenv()

class TriviaAgent:
    def __init__(self):
        # Load agents configuration
        with open(os.path.join(os.path.dirname(__file__), 'workspace', 'agents.yaml'), 'r') as f:
            self.config = yaml.safe_load(f)
        
        # Initialize vector store
        self.vector_db = PGVector(
            collection_name="trivia_knowledge",
            embedding_model="text-embedding-ada-002"
        )
        
    async def generate_trivia_game(self, topic: str, difficulty: str = "medium", num_questions: int = 10) -> TriviaGame:
        # Initialize assistants with OpenAI configuration
        trivia_master = Assistant(
            name="trivia_master",
            llm=OpenAIChat(
                model="gpt-4",
                api_key=os.getenv('OPENAI_API_KEY'),
                temperature=0.7
            ),
            system_message=self.config['resources']['assistant_agents']['trivia_master']['system_message'],
            vector_store=self.vector_db
        )
        
        # Generate categories
        categories_response = await trivia_master.run(
            f"""Generate {num_questions // 5} categories and subcategories for the topic: {topic}.
            Format the response as a JSON object with the following structure:
            {{
                "categories": [
                    {{
                        "name": "category name",
                        "description": "category description",
                        "subcategories": ["subcategory1", "subcategory2"]
                    }}
                ]
            }}"""
        )
        
        categories: List[Category] = [
            Category(**cat) for cat in categories_response["categories"]
        ]
        
        # Initialize question generator
        question_generator = Assistant(
            name="question_generator",
            llm=OpenAIChat(
                model="gpt-4",
                api_key=os.getenv('OPENAI_API_KEY'),
                temperature=0.7
            ),
            system_message=self.config['resources']['assistant_agents']['question_generator']['system_message'],
            vector_store=self.vector_db
        )
        
        # Generate questions using structured output
        questions: List[TriviaQuestion] = []
        questions_per_category = num_questions // len(categories)
        
        for category in categories:
            for subcategory in category.subcategories:
                response = await question_generator.run(
                    f"""Create {questions_per_category // len(category.subcategories)} {difficulty} difficulty questions about {category.name} focusing on {subcategory}.
                    Format the response as a JSON object with the following structure:
                    {{
                        "questions": [
                            {{
                                "type": "multiple-choice" or "true-false" or "text-input",
                                "question": "question text",
                                "correctAnswer": "correct answer",
                                "explanation": "explanation text",
                                "options": [
                                    {{"id": "A", "text": "option text"}},
                                    {{"id": "B", "text": "option text"}}
                                ],
                                "acceptableAnswers": ["answer1", "answer2"]
                            }}
                        ]
                    }}"""
                )
                
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
        
        # Create and return trivia game
        return TriviaGame(
            topic=topic,
            categories=categories,
            questions=questions,
            total_questions=len(questions),
            difficulty_distribution={difficulty: len(questions)}
        )