# Copyright 2025 NutriTrack
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import os, json, base64, requests
from components.interfaces import Generator


class OllamaGenerator(Generator):
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
            return res.json() 
        except Exception as e:
            print(f"[Ollama Error] {e}")
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