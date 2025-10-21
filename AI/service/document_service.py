import os
from typing import List, Dict, Any
from components.manager import EmbeddingManager, ReaderManager, DatabaseManager
from langchain_text_splitters import RecursiveCharacterTextSplitter

class DocumentService:
    def __init__(self, collection_name="rag_documents"):
        self.embedder = EmbeddingManager()
        self.reader_manager = ReaderManager()
        
        self.db = DatabaseManager()
        self.collection_name = collection_name

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        print("DocumentService initialized.")

    def ingest_file(self, file_path: str, filename: str) -> Dict[str, Any]:
        text, error = self.reader_manager.read_file(file_path)
        if error:
            return {"error": error, "filename": filename}
        
        chunks = self.text_splitter.split_text(text)
        print(f"Split '{filename}' into {len(chunks)} chunks.")

        embeddings = self.embedder.vectorize(chunks)
        
        ids = [f"{filename}_{i}" for i in range(len(chunks))]
        metadatas = [{"source": filename, "chunk_index": i} for i in range(len(chunks))]
        documents = chunks
        
        self.db.delete(
            collection_name=self.collection_name,
            where_filter={"source": filename}
        )
        
        self.db.add(
            collection_name=self.collection_name,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        print(f"Successfully ingested and vectorized file: {filename}")
        return {
            "status": "success",
            "filename": filename,
            "chunks_added": len(chunks)
        }

    def retrieve_context(self, query: str, n_results: int = 3) -> List[str]:
        query_vector = self.embedder.vectorize_single(query)
        
        results = self.db.query(
            collection_name=self.collection_name,
            query_embeddings=[query_vector],
            n_results=n_results
        )
        
        return results.get("documents", [[]])[0]

    def list_documents(self) -> List[str]:
        print("Listing unique documents...")
        unique_files = self.db.get_unique_metadata_values(
            self.collection_name, 
            "source"
        )
        return sorted(list(unique_files))

    def delete_document(self, filename: str) -> Dict[str, Any]:
        print(f"Attempting to delete document: {filename}")
        try:
            self.db.delete(
                collection_name=self.collection_name,
                where_filter={"source": filename}
            )
            print(f"Successfully deleted document: {filename}")
            return {"status": "deleted", "filename": filename}
        except Exception as e:
            print(f"Error deleting document {filename}: {e}")
            return {"error": str(e), "filename": filename}