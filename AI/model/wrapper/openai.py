import os
import json
import base64
from openai import OpenAI
from ..base_llm import BaseLLM


class OpenAILLM(BaseLLM):
    def __init__(self):
        self.model = os.getenv("OPENAI_MODEL")
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def _make_content(self, prompt, images=None):
        content = [{"type": "text", "text": prompt}]
        if images:
            for img in images:
                if os.path.exists(img):
                    with open(img, "rb") as f:
                        data = base64.b64encode(f.read()).decode("utf-8")
                    content.append({
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{data}"}
                    })
                else:
                    content.append({
                        "type": "image_url",
                        "image_url": {"url": img}
                    })
        return content


    def generate(self, prompt, images=None, response_format=None):
        try:
            messages = [
                {"role": "user", "content": self._make_content(prompt, images)}
            ]

            params = {
                "model": self.model,
                "messages": messages,
            }

            if response_format == "json":
                params["response_format"] = {"type": "json_object"}

            res = self.client.chat.completions.create(**params)
            return res.choices[0].message.content.strip()

        except Exception as e:
            return f"[OpenAI Error] {e}"
