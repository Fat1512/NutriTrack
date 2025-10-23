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
import os
import json
import base64
from openai import OpenAI
from components.interfaces import Generator


class OpenAIGenerator(Generator):
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
            generated_text = res.choices[0].message.content.strip()
            usage = res.usage
            return {
                "text": generated_text,
                "prompt_tokens": usage.prompt_tokens,
                "completion_tokens": usage.completion_tokens,
                "total_tokens": usage.total_tokens
            }

        except Exception as e:
            print(f"[OpenAI Error] {e}")
            return {
                "text": f"[OpenAI Error] {e}",
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0
            }
