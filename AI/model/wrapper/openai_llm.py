import os, json, base64
from openai import OpenAI
from ..base_llm import BaseLLM

class OpenAILLM(BaseLLM):
    def __init__(self):
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def _make_content(self, prompt, images=None):
        if not images:
            return [{"type": "text", "text": prompt}]
        parts = [{"type": "text", "text": prompt}]
        for img in images:
            if os.path.exists(img):
                with open(img, "rb") as f:
                    data = base64.b64encode(f.read()).decode()
                parts.append({"type": "image_url", "image_url": f"data:image/jpeg;base64,{data}"})
            else:
                parts.append({"type": "image_url", "image_url": img})
        return parts

    def generate(self, prompt, images=None):
        try:
            res = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": self._make_content(prompt, images)}],
            )
            return res.choices[0].message.content.strip()
        except Exception as e:
            return f"[OpenAI Error] {e}"