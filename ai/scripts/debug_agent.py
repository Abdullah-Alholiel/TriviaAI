#!/usr/bin/env python3
import os
import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent.parent
sys.path.append(str(project_root))

from ai.agents.trivia_agent import TriviaAgent

def main():
    try:
        print("Initializing TriviaAgent...")
        agent = TriviaAgent()
        print("TriviaAgent initialized successfully!")
        print(f"Config loaded: {bool(agent.config)}")
        print(f"Embedder initialized: {bool(agent.embedder)}")
        print(f"Vector DB initialized: {bool(agent.vector_db)}")
    except Exception as e:
        print(f"Error during initialization: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 