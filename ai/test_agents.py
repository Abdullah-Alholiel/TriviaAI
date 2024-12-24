from phi.model.ollama import Ollama
from phi.workspace import Workspace
from phi.utils.log import logger
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_agents():
    # Initialize workspace with absolute path
    workspace_dir = Path(__file__).parent / "agents" / "workspace"
    print(f"Loading workspace from: {workspace_dir}")
    
    # Initialize Ollama LLM
    llm = Ollama(
        model="qwen2.5-coder:latest",  # or llama2, codellama
        api_base="http://localhost:11434"
    )
    
    ws = Workspace(
        workspace_dir=str(workspace_dir),
        llm=llm
    )
    
    await ws.start()
    return ws

if __name__ == "__main__":
    asyncio.run(test_agents())