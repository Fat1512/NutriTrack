import os
from .wrapper.ollama import OllamaLLM
from .wrapper.openai import OpenAILLM

def get_llm(model, provider):
    if provider == "openai":
        return OpenAILLM()
    elif provider == "ollama":
        return OllamaLLM(model=model)
    else:
        raise Exception