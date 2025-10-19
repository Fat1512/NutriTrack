import os

class PromptManager:
    def __init__(self, base_dir="prompt"):
        self.base_dir = base_dir

    def load(self, name: str, **kwargs) -> str:
        path = os.path.join(self.base_dir, f"{name}.txt")
        if not os.path.exists(path):
            raise FileNotFoundError(f"Prompt file not found: {path}")

        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        if kwargs:
            content = content.format(**kwargs)

        return content
