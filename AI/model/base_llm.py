from abc import ABC, abstractmethod
from typing import List

class BaseLLM(ABC):
    @abstractmethod
    def generate(self, prompt: str, images: List[str] = None):
        pass