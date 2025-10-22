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
import asyncio
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from components.interfaces import BaseWatcher
from service.mini_rag_service import MiniRagService

class LocalFolderWatcher(BaseWatcher, FileSystemEventHandler):
    def __init__(self, watch_dir: str):
        self.watch_dir = watch_dir
        self.observer = Observer()
        self.rag_service: MiniRagService = None
        self.loop: asyncio.AbstractEventLoop = None
        self._recent_tasks: dict[str, float] = {}

    async def start(self, rag_service: MiniRagService, loop: asyncio.AbstractEventLoop):
        self.rag_service = rag_service
        self.loop = loop
        
        os.makedirs(self.watch_dir, exist_ok=True)
        
        await self.scan_and_ingest_existing_files()

        print(f"Watching for new changes in: {self.watch_dir}")
        self.observer.schedule(self, self.watch_dir, recursive=True)
        self.observer.start()
        
        try:
            while self.observer.is_alive():
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            self.observer.stop()
        self.observer.join()

    async def scan_and_ingest_existing_files(self):
        print(f"Starting to scan existing files in {self.watch_dir}...")
        
        for path_obj in Path(self.watch_dir).glob('**/*'):
            if path_obj.is_file():
                filename = path_obj.name
                try:
                    exists = await self.loop.run_in_executor(
                        None, self.rag_service.document_exists, filename
                    )
                    
                    if exists:
                        print(f"Skipping existing file: {filename}")
                        continue
                    
                    print(f"New file found, starting ingest: {filename}")
                    
                    await self.loop.run_in_executor(
                        None,
                        self.rag_service.ingest_file,
                        str(path_obj), 
                        filename
                    )
                except Exception as e:
                    print(f"Error ingesting file (scan) {path_obj}: {e}")
        
        print("File scanning completed.")

    def on_created(self, event):
        if not event.is_directory:
            asyncio.run_coroutine_threadsafe(
                self._schedule_process(event.src_path, "created"), self.loop
            )

    def on_modified(self, event):
        if not event.is_directory:
            asyncio.run_coroutine_threadsafe(
                self._schedule_process(event.src_path, "modified"), self.loop
            )

    def on_deleted(self, event):
        if not event.is_directory:
            filename = Path(event.src_path).name
            
            asyncio.run_coroutine_threadsafe(
                self._async_delete_wrapper(filename), self.loop
            )

    async def _async_delete_wrapper(self, filename: str):
        print(f"Delete request from Watcher: {filename}")
        try:
            await self.loop.run_in_executor(
                None,
                self.rag_service.delete_document,
                filename
            )
        except Exception as e:
            print(f"Error deleting local file {filename}: {e}")

    async def _schedule_process(self, path: str, event_type: str, debounce_seconds: float = 0.2):
        now = asyncio.get_event_loop().time()
        last = self._recent_tasks.get(path)
        if last and now - last < debounce_seconds:
            return
        self._recent_tasks[path] = now
        await asyncio.sleep(0.05)
        
        try:
            path_obj = Path(path)
            filename = path_obj.name
            
            print(f"Watcher detected file {event_type}: {filename}")

            await self.loop.run_in_executor(
                None,
                self.rag_service.ingest_file,
                str(path_obj),
                filename
            )
            print(f"File {event_type} processing completed: {filename}")

        except Exception as e:
            print(f"Error processing local file {path}: {e}")