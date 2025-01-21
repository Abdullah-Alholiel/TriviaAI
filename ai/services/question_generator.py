from typing import Optional
import json
import random
from ..models.schemas import TriviaQuestion

class QuestionGenerator:
    def __init__(self, assistant):
        self.assistant = assistant

    async def generate_question(
        self, 
        topic: str, 
        category: str, 
        difficulty: str
    ) -> Optional[TriviaQuestion]:
        """Generate a single trivia question"""
        try:
            prompt = f"""
            Create a {difficulty} difficulty trivia question about {topic} in the category {category}.
            Format your response as a JSON object with:
            {{
                "type": "multiple_choice",
                "question": "The question text",
                "correctAnswer": "The correct answer",
                "explanation": "Brief explanation of the answer",
                "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
            }}
            Ensure the correct answer is included in the options.
            """

            response = await self.assistant.chat([
                {"role": "system", "content": self.assistant.system_message},
                {"role": "user", "content": prompt}
            ])

            try:
                data = json.loads(response)
                return TriviaQuestion(
                    id=str(random.randint(1000, 9999)),
                    type=data['type'],
                    question=data['question'],
                    correctAnswer=data['correctAnswer'],
                    explanation=data['explanation'],
                    options=data.get('options'),
                    acceptableAnswers=data.get('acceptableAnswers', [])
                )
            except json.JSONDecodeError as e:
                print(f"Error parsing question response: {str(e)}")
                return None

        except Exception as e:
            print(f"Error generating question: {str(e)}")
            return None 