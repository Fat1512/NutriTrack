from components.interfaces import BaseIngestStrategy

class HTMLIngestStrategy(BaseIngestStrategy):
    def get_supported_extensions(self) -> list[str]:
        return [".html", ".htm"]

class MarkdownIngestStrategy(BaseIngestStrategy):
    def get_supported_extensions(self) -> list[str]:
        return [".md"]

class PlainTextIngestStrategy(BaseIngestStrategy):
    def get_supported_extensions(self) -> list[str]:
        return [".txt", ".json"]

class BinaryIngestStrategy(BaseIngestStrategy):
    def get_supported_extensions(self) -> list[str]:
        return [".pdf", ".docx"]