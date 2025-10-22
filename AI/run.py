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
import sys
try:
    __import__('pysqlite3')
    sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
    print("Using pysqlite3-binary for ChromaDB compatibility")
except ImportError:
    print("Warning: pysqlite3-binary not installed, using system SQLite")

from dotenv import load_dotenv
load_dotenv()

import os
import asyncio
import threading
from flask import Flask
from app.routes import bp
from flask_cors import CORS

from service.mini_rag_service import MiniRagService
from components.watcher.local_watcher import LocalFolderWatcher
from components.watcher.rss_watcher import RSSWatcher


async def start_watchers(loop):
    print("Initializing Watchers...")
    
    rag_service = MiniRagService()

    tasks = []

    
    local_watch_dir = os.getenv("WATCHER_LOCAL_PATH")
    if local_watch_dir:
        print(f"Detected WATCHER_LOCAL_PATH, starting LocalFolderWatcher at {local_watch_dir}")
        local_watcher = LocalFolderWatcher(watch_dir=local_watch_dir)
        tasks.append(loop.create_task(local_watcher.start(rag_service, loop)))
    
    rss_urls_str = os.getenv("WATCHER_RSS_URLS")
    if rss_urls_str:
        rss_urls = [url.strip() for url in rss_urls_str.split(',')]
        if rss_urls:
            print(f"Detected WATCHER_RSS_URLS, starting RSSWatcher for {len(rss_urls)} feeds")
            rss_interval = int(os.getenv("WATCHER_RSS_INTERVAL", "3600"))
            rss_watcher = RSSWatcher(feed_urls=rss_urls, check_interval_seconds=rss_interval, save_dir=local_watch_dir)
            tasks.append(loop.create_task(rss_watcher.start(rag_service, loop)))

    if tasks:
        print(f"Running {len(tasks)} watchers in event loop...")
        await asyncio.gather(*tasks)
    else:
        print("No watchers configured. Watcher thread will exit.")

def run_asyncio_loop():
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(start_watchers(loop))
    except Exception as e:
        print(f"Critical error in Watcher thread: {e}")
    finally:
        loop.close()

def main():
    print("Starting Watcher thread (asyncio)...")
    watcher_thread = threading.Thread(target=run_asyncio_loop, daemon=True)
    watcher_thread.start()

    print("Starting Flask server...")
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(bp)
    
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT", 5000))
    
    app.run(host=host, port=port)

if __name__ == "__main__":
    main()