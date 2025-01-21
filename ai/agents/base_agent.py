from typing import Dict, Any
import os
import yaml
from openai import AsyncOpenAI
from phi.assistant import Assistant
from phi.embedder.sentence_transformer import SentenceTransformerEmbedder
from phi.vectordb.lancedb import LanceDb
from phi.vectordb.search import SearchType

class BaseAgent:
    def __init__(self):
        self._init_config()
        self._init_openai()

    def _init_config(self):
        """Initialize configuration from YAML"""
        try:
            config_path = os.path.join(os.path.dirname(__file__), 'workspace', 'agents.yaml')
            with open(config_path, 'r') as f:
                self.config = yaml.safe_load(f)
        except Exception as e:
            print(f"Error loading config: {str(e)}")
            # Provide default configuration
            self.config = {
                'resources': {
                    'assistant_agents': {
                        'trivia_master': {
                            'name': 'Trivia Master',
                            'system_message': """You are an expert trivia game creator. 
                            Generate engaging and educational trivia content.""",
                            'model': 'gpt-4-turbo-preview',
                            'temperature': 0.7
                        },
                        'question_generator': {
                            'name': 'Question Generator',
                            'system_message': """You are an expert at creating trivia questions.
                            Create clear, accurate, and engaging questions.""",
                            'model': 'gpt-4-turbo-preview',
                            'temperature': 0.7
                        }
                    }
                }
            }

    def _init_openai(self):
        """Initialize OpenAI client"""
        self.client = AsyncOpenAI(
            api_key=os.getenv('OPENROUTER_API_KEY'),
            base_url="https://openrouter.ai/api/v1"
        )

    async def _create_chat_completion(self, messages: list, config: Dict[str, Any]) -> str:
        """Create a chat completion using OpenAI"""
        try:
            response = await self.client.chat.completions.create(
                model=config.get('model', 'gpt-4-turbo-preview'),
                messages=messages,
                temperature=config.get('temperature', 0.7)
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error in chat completion: {str(e)}")
            raise

    def _create_assistant(self, config: Dict[str, Any]):
        """Create an assistant with the given configuration"""
        return Assistant(self._create_chat_completion, config)

class Assistant:
    def __init__(self, chat_func, config: Dict[str, Any]):
        self.chat_func = chat_func
        self.config = config
        self.system_message = config['system_message']

    async def chat(self, messages: list) -> str:
        """Send a chat message to the assistant"""
        try:
            return await self.chat_func(messages, self.config)
        except Exception as e:
            print(f"Error in assistant chat: {str(e)}")
            raise 