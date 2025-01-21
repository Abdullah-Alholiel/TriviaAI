from phi.vectordb.lancedb import LanceDB
from typing import List, Optional
from pathlib import Path

class TriviaVectorStore:
    def __init__(self):
        db_path = Path(__file__).parent / "trivia.db"
        self.db = LanceDB(
            database_path=str(db_path),
            table_name="trivia_questions"
        )

    async def store_question(self, question: dict):
        """Store a trivia question with embeddings"""
        return await self.db.add_texts(
            texts=[question["text"]],
            metadata=[{
                "category": question["category"],
                "difficulty": question["difficulty"],
                "answers": question["answers"]
            }]
        )

    async def store_document_embedding(self, doc_id: int, text: str, embedding: list):
        """
        Store embedding with reference to a PostgreSQL doc record.
        """
        return await self.db.add_texts(
            texts=[text],
            metadata=[{"doc_id": doc_id, "embedding": embedding}]
        )

    async def search_questions(
        self,
        category: str,
        difficulty: str,
        limit: int = 10
    ) -> List[dict]:
        """Search for similar questions"""
        results = await self.db.search(
            query=f"category:{category} difficulty:{difficulty}",
            limit=limit
        )
        return [
            {
                "text": result.text,
                **result.metadata
            }
            for result in results
        ]

    async def get_embedding_by_doc_id(self, doc_id: int):
        """
        Retrieve stored embedding for a given PostgreSQL doc record.
        """
        results = await self.db.search(
            query=f"doc_id:{doc_id}",
            limit=1
        )
        if results:
            return results[0].metadata.get("embedding")
        return None

    async def get_random_questions(
        self,
        category: Optional[str] = None,
        limit: int = 10
    ) -> List[dict]:
        """Get random questions optionally filtered by category"""
        query = f"category:{category}" if category else ""
        return await self.db.random_sample(
            query=query,
            limit=limit
        )