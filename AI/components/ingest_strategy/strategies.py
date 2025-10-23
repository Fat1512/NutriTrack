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