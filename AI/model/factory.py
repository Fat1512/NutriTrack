import os
from .wrapper.ollama_llm import OllamaLLM
from .wrapper.openai_llm import OpenAILLM

def get_llm():
    provider = os.getenv("LLM_PROVIDER")  # "ollama" | "openai"
    if provider == "openai":
        return OpenAILLM()
    elif provider == "ollama":
        return OllamaLLM()
    else:
        raise Exception