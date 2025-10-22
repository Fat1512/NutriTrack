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