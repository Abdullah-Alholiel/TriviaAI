#!/usr/bin/env python3
import sys
import json
import asyncio
import os
from pathlib import Path
from typing import Dict, Any
import traceback

def setup_python_path():
    """Ensure proper Python path setup"""
    project_root = Path(__file__).parent.parent.parent
    if str(project_root) not in sys.path:
        sys.path.insert(0, str(project_root))
    
    # Print debug information
    print(json.dumps({
        "debug": {
            "project_root": str(project_root),
            "python_path": sys.path,
            "current_dir": os.getcwd(),
            "files_in_project": os.listdir(project_root)
        }
    }), flush=True)

setup_python_path()

from ai.agents.trivia_agent import TriviaAgent

async def generate_trivia(topic: str, difficulty: str, num_questions: int) -> Dict[str, Any]:
    """Generate trivia game and format for frontend"""
    try:
        agent = TriviaAgent()
        game = await agent.generate_trivia_game(
            topic=topic,
            difficulty=difficulty,
            num_questions=num_questions
        )
        
        # Format for frontend
        return {
            "topic": game.topic,
            "questions": [
                {
                    "id": str(q.id),
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
            "difficulty": difficulty
        }
    except Exception as e:
        print(json.dumps({
            "error": f"Generation error: {str(e)}",
            "traceback": traceback.format_exc()
        }), flush=True)
        raise

async def main():
    try:
        if len(sys.argv) != 4:
            raise ValueError("Expected: topic difficulty num_questions")
        
        topic, difficulty, num_questions = sys.argv[1], sys.argv[2], int(sys.argv[3])
        
        if difficulty not in ['easy', 'medium', 'hard']:
            raise ValueError(f"Invalid difficulty: {difficulty}")
        
        if not (1 <= num_questions <= 20):
            raise ValueError("Questions must be between 1 and 20")

        game_data = await generate_trivia(topic, difficulty, num_questions)
        print(json.dumps({"status": "success", "game": game_data}), flush=True)
        sys.exit(0)
        
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc(),
            "debug_info": {
                "python_path": sys.path,
                "current_dir": os.getcwd()
            }
        }), flush=True)
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main()) 