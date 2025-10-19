import os, json, base64, requests
from ..base_llm import BaseLLM

class OllamaLLM(BaseLLM):
    def __init__(self, model):
        self.model = model or os.getenv("OLLAMA_MODEL")
        self.host = os.getenv("OLLAMA_HOST")

    def _encode(self, path):
        with open(path, "rb") as f:
            return base64.b64encode(f.read()).decode()

    def _query(self, prompt, images=None):
        payload = {"model": self.model, "prompt": prompt, "stream": False}
        if images:
            payload["images"] = [self._encode(img) for img in images]
        try:
            res = requests.post(f"{self.host}/api/generate", json=payload, timeout=120)
            res.raise_for_status()
            return res.json().get("response", "").strip()
        except Exception as e:
            return f"[Ollama Error] {e}"

    def generate(self, prompt, images=None):
        return self._query(prompt, images)