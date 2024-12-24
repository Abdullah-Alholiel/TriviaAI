from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ..agents.trivia_agent import TriviaAgent
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TriviaRequest(BaseModel):
    topic: str
    difficulty: str = "medium"

@app.post("/generate")
async def generate_trivia(request: TriviaRequest):
    agent = TriviaAgent()
    game = await agent.generate_trivia_game(request.topic, request.difficulty)
    return game