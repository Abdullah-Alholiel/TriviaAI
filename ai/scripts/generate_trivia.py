#!/usr/bin/env python3
import sys
import json
import asyncio
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

from ai import TriviaAgent

async def main():
    if len(sys.argv) != 4:
        print(json.dumps({
            "error": "Invalid arguments. Usage: generate_trivia.py <topic> <difficulty> <num_questions>"
        }))
        sys.exit(1)

    topic = sys.argv[1]
    difficulty = sys.argv[2]
    num_questions = int(sys.argv[3])

    try:
        agent = TriviaAgent()
        game = await agent.generate_trivia_game(topic, difficulty, num_questions)
        
        # Convert to dict for JSON serialization
        game_dict = {
            "topic": game.topic,
            "categories": [
                {
                    "name": cat.name,
                    "description": cat.description,
                    "subcategories": cat.subcategories
                }
                for cat in game.categories
            ],
            "questions": [
                {
                    "id": q.id,
                    "type": q.type,
                    "question": q.question,
                    "correctAnswer": q.correctAnswer,
                    "explanation": q.explanation,
                    "options": q.options,
                    "acceptableAnswers": q.acceptableAnswers
                }
                for q in game.questions
            ],
            "total_questions": game.total_questions,
            "difficulty_distribution": game.difficulty_distribution
        }
        
        print(json.dumps(game_dict))
    except Exception as e:
        print(json.dumps({
            "error": f"Failed to generate trivia game: {str(e)}"
        }))
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main()) 