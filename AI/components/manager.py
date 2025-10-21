import os

from typing import List

# Generator
from components.generation.ollama_generator import OllamaGenerator
from components.generation.openai_generator import OpenAIGenerator
from components.interfaces import Generator

# Embedder
from components.embedding.sentence_transformer_embedder import SentenceTransformerEmbedder
from components.embedding.ollama_embedder import OllamaEmbedder
from components.interfaces import Embedding

# Reader
from components.reader import basic_reader

# Database
from components.interfaces import VectorDatabase
from components.database.chroma_db import ChromaDB

# Ingestor
from components.ingest_strategy.strategies import (
    HTMLIngestStrategy,
    MarkdownIngestStrategy,
    PlainTextIngestStrategy,
    BinaryIngestStrategy,
)


class GenerationManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GenerationManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        
        provider = os.getenv("LLM_PROVIDER")
        self.generator: Generator = None

        if provider == "openai":
            print("Initializing GenerationManager with OpenAILLM")
            self.generator = OpenAIGenerator()
        elif provider == "ollama":
            print("Initializing GenerationManager with OllamaLLM")
            self.generator = OllamaGenerator()
        else:
            raise ValueError(f"Unknown LLM_PROVIDER: {provider}")
        
        self._initialized = True

    def generate(self, prompt: str, images: list = None):
        return self.generator.generate(prompt, images)

        

class EmbeddingManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        
        provider = os.getenv("EMBEDDING_PROVIDER", "sentence_transformer")

        self.embedder: Embedding = None

        if provider == "sentence_transformer":
            print(f"Initializing EmbeddingManager with SentenceTransformerEmbedding")
            self.embedder = SentenceTransformerEmbedder() 
        elif provider == "ollama":
            print(f"Initializing EmbeddingManager with OllamaEmbedding")
            self.embedder = OllamaEmbedder()
        else:
            raise ValueError(f"Unknown EMBEDDING_PROVIDER: {provider}")
        
        self._initialized = True

    def vectorize(self, content: List[str]) -> List[List[float]]:
        return self.embedder.vectorize(content)

    def vectorize_single(self, content: str) -> List[float]:
        return self.embedder.vectorize([content])[0]

        

class PromptManager:
    def __init__(self, base_dir="prompt"):
        self.base_dir = base_dir

    def load(self, name: str, **kwargs) -> str:
        path = os.path.join(self.base_dir, f"{name}.txt")
        if not os.path.exists(path):
            raise FileNotFoundError(f"Prompt file not found: {path}")

        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        if kwargs:
            content = content.format(**kwargs)

        return content

        
class ReaderManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ReaderManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        
        self.readers = {
            ".pdf": basic_reader.read_pdf,
            ".docx": basic_reader.read_docx,
            ".md": basic_reader.read_text_based,
            ".txt": basic_reader.read_text_based
        }
        print("ReaderManager initialized.")
        self._initialized = True

    def read_file(self, file_path: str):
        _, extension = os.path.splitext(file_path)
        extension = extension.lower()
        
        reader_func = self.readers.get(extension)
        
        if not reader_func:
            error_msg = f"Unsupported file type: {extension}"
            print(error_msg)
            return None, error_msg

        content = reader_func(file_path)
        
        if not content or not content.strip():
            error_msg = f"Could not extract text from file: {file_path}"
            print(error_msg)
            return None, error_msg
            
        return content, None

        
class IngestStrategyManager:
    def __init__(self):
        self.strategies = [
            HTMLIngestStrategy(),
            MarkdownIngestStrategy(),
            PlainTextIngestStrategy(),
            BinaryIngestStrategy(),
        ]

    def get_strategy(self, filename: str):
        for strategy in self.strategies:
            if strategy.can_handle(filename):
                return strategy
        return None


class DatabaseManager:
    _instance: VectorDatabase = None

    def __new__(cls):
        if cls._instance is None:
            provider = os.getenv("DB_PROVIDER", "chroma")
            
            if provider == "chroma":
                print("Initializing DatabaseManager with ChromaDB.")
                cls._instance = ChromaDB()
            else:
                raise ValueError(f"Unknown DB_PROVIDER: {provider}")
        
        return cls._instance