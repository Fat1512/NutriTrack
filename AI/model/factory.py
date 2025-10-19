import os
from .wrapper.ollama import OllamaLLM
from .wrapper.openai import OpenAILLM

def get_llm():
    provider = os.getenv("LLM_PROVIDER")  # "ollama" | "openai"
    if provider == "openai":
        return OpenAILLM()
    elif provider == "ollama":
        return OllamaLLM()
    else:
        raise Exception