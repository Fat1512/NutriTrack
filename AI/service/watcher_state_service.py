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
import threading
import os

class WatcherStateService:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(WatcherStateService, cls).__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self):
        if self._initialized:
            return
        
        with self._lock:
            self._state = {
                'local': bool(os.getenv("WATCHER_LOCAL_PATH")),
                'rss': bool(os.getenv("WATCHER_RSS_URLS"))
            }
            self._initialized = True
            print(f"WatcherStateService initialized with states: {self._state}")

    def is_enabled(self, watcher_name: str) -> bool:
        with self._lock:
            return self._state.get(watcher_name, False)

    def set_state(self, watcher_name: str, is_enabled: bool):
        with self._lock:
            if watcher_name in self._state:
                self._state[watcher_name] = is_enabled
                print(f"✅ Watcher state '{watcher_name}' set to {is_enabled}")
            else:
                print(f"⚠️ Warning: Tried to set state for unknown watcher '{watcher_name}'")

    def get_all_states(self) -> dict:
        with self._lock:
            return self._state.copy()