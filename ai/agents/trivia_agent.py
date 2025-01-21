from typing import List, Dict, Any
import json
import random
from .base_agent import BaseAgent
from ..services.question_generator import QuestionGenerator
from ..models.schemas import TriviaGame, Category, TriviaQuestion
from .rag_agent import RAGAgent

class TriviaAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.question_generator = QuestionGenerator(
            self._create_assistant(self.config['resources']['assistant_agents']['question_generator'])
        )
        self.trivia_master = self._create_assistant(
            self.config['resources']['assistant_agents']['trivia_master']
        )
        self.rag_agent = RAGAgent(self.vector_store, self.question_generator)

    async def _analyze_topic_categories(self, topic: str) -> List[Category]:
        """Analyze topic and generate relevant categories"""
        try:
            prompt = f"""
            Analyze the topic '{topic}' and generate 3-5 relevant categories.
            Each category should include:
            - name: category name
            - description: brief description
            - subcategories: list of 2-3 related subtopics
            
            Format as JSON array of Category objects.
            """
            
            response = await self.trivia_master.chat([
                {"role": "system", "content": self.trivia_master.system_message},
                {"role": "user", "content": prompt}
            ])
            
            try:
                categories_data = json.loads(response)
                return [
                    Category(
                        name=cat['name'],
                        description=cat['description'],
                        subcategories=cat['subcategories']
                    )
                    for cat in categories_data
                ]
            except (json.JSONDecodeError, KeyError) as e:
                print(f"Error parsing categories: {str(e)}")
                # Fallback category if parsing fails
                return [
                    Category(
                        name="General Knowledge",
                        description=f"General knowledge about {topic}",
                        subcategories=["Basic Facts", "Key Concepts"]
                    )
                ]
                
        except Exception as e:
            print(f"Error in _analyze_topic_categories: {str(e)}")
            # Return default category instead of raising error
            return [
                Category(
                    name="General Knowledge",
                    description=f"General knowledge about {topic}",
                    subcategories=["Basic Facts", "Key Concepts"]
                )
            ]

    async def generate_trivia_game(
        self,
        topic: str,
        difficulty: str = "medium",
        num_questions: int = 10
    ) -> TriviaGame:
        """Generate a complete trivia game"""
        try:
            # Get categories
            categories = await self._analyze_topic_categories(topic)
            
            # Generate questions
            questions = []
            attempts = 0
            max_attempts = num_questions * 2  # Allow some retry buffer
            
            while len(questions) < num_questions and attempts < max_attempts:
                try:
                    category = random.choice(categories)
                    question = await self.question_generator.generate_question(
                        topic=topic,
                        category=category.name,
                        difficulty=difficulty
                    )
                    if question:
                        questions.append(question)
                except Exception as e:
                    print(f"Error generating question: {str(e)}")
                
                attempts += 1

            if not questions:
                raise ValueError("Failed to generate any valid questions")

            # Create game object
            return TriviaGame(
                topic=topic,
                categories=categories,
                questions=questions,
                total_questions=len(questions),
                difficulty_distribution={difficulty: len(questions)}
            )

        except Exception as e:
            print(f"Error generating trivia game: {str(e)}")
            raise

    async def generate_doc_based_trivia(self, doc_id: int, difficulty: str):
        """
        Use RAG approach: retrieve doc embedding from LanceDB, generate questions
        """
        embedding = await self.vector_store.get_embedding_by_doc_id(doc_id)
        if not embedding:
            raise ValueError("No embedding found for given document ID.")

        questions = await self.rag_agent.generate_questions_from_doc(doc_id)
        # ...use difficulty logic, format final output...
        return questions