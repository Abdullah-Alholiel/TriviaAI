
from ..storage.vector_store import TriviaVectorStore
from ..services.question_generator import QuestionGenerator

class RAGAgent:
    def __init__(self, vector_store: TriviaVectorStore, question_generator: QuestionGenerator):
        self.vector_store = vector_store
        self.question_generator = question_generator
    
    async def generate_questions_from_doc(self, doc_id: int, num_questions: int = 5):
        embedding = await self.vector_store.get_embedding_by_doc_id(doc_id)
        if not embedding:
            raise ValueError("No embedding found for this doc")
        # ...perform retrieval/augmentation with embedding...
        # ...return generated questions...
        return ["Q1", "Q2", "Q3"]