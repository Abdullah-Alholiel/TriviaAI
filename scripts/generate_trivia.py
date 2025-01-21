#!/usr/bin/env python3
import sys
import json
import asyncio
import traceback
import os
from pathlib import Path
from typing import Dict, Any
from ai.agents.trivia_agent import TriviaAgent

def debug_info() -> Dict[str, Any]:
    """Get debug information about the environment"""
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ai_path = os.path.join(project_root, 'ai')
    
    return {
        "project_root": project_root,
        "ai_path": ai_path,
        "python_path": sys.path,
        "current_dir": os.getcwd(),
        "files_in_ai": os.listdir(ai_path) if os.path.exists(ai_path) else [],
        "args_received": sys.argv[1:]  # Log received arguments
    }

async def generate_trivia(topic: str, difficulty: str, num_questions: int) -> Dict:
    """Generate trivia game using TriviaAgent"""
    try:
        agent = TriviaAgent()
        game = await agent.generate_trivia_game(
            topic=topic,
            difficulty=difficulty,
            num_questions=num_questions
        )
        return game.dict()
    except Exception as e:
        raise Exception(f"Failed to generate trivia: {str(e)}")

async def main():
    try:
        # Output initial debug info
        print(json.dumps({"debug": debug_info()}))

        # Parse command line arguments
        if len(sys.argv) != 4:
            raise ValueError(f"Expected 3 arguments: topic, difficulty, num_questions. Got {len(sys.argv)-1}")
        
        topic = sys.argv[1]
        difficulty = sys.argv[2]
        num_questions = int(sys.argv[3])

        # Validate inputs
        if difficulty not in ['easy', 'medium', 'hard']:
            raise ValueError(f"Invalid difficulty: {difficulty}")
        
        if not (1 <= num_questions <= 20):
            raise ValueError(f"Number of questions must be between 1 and 20")

        # Generate trivia game
        game_data = await generate_trivia(topic, difficulty, num_questions)
        
        # Output final result
        print(json.dumps({
            "status": "success",
            "game": game_data
        }))
        
        sys.exit(0)
        
    except Exception as e:
        print(json.dumps({
            "error": f"Error generating trivia game: {str(e)}",
            "traceback": traceback.format_exc(),
            "python_path": sys.path
        }))
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main()) 