import os, json, base64, requests
from ..base_llm import BaseLLM

class OllamaLLM(BaseLLM):
    def __init__(self):
        self.model = os.getenv("OLLAMA_MODEL")
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
        response = self._query(prompt, images)
        print(response)

        if isinstance(response, str):
            return {
                "text": response,
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0
            }
        
        generated_text = response.get("response", "").strip()

        prompt_tokens = response.get("prompt_eval_count", 0)
        completion_tokens = response.get("eval_count", 0)
        total_tokens = prompt_tokens + completion_tokens

        return {
            "text": generated_text,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens": total_tokens
        }