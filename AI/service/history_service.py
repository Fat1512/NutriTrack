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
import redis
import json
import os

class RedisHistoryService:
    def __init__(self):
        self.ttl = int(os.getenv("CHAT_HISTORY_TTL", 3600))
        self.client = None
        self.is_available = False
        
        try:
            self.client = redis.Redis(
                host=os.getenv("REDIS_HOST", "localhost"),
                port=int(os.getenv("REDIS_PORT", 6379)),
                # db=0,
                decode_responses=True,
                username=os.getenv("REDIS_USERNAME", None),
                password=os.getenv("REDIS_PASSWORD", None)
            )
            self.client.ping()
            self.is_available = True
            print(f"Successfully connected to Redis at {os.getenv('REDIS_HOST', 'localhost')}:{os.getenv('REDIS_PORT', 6379)}")
        except Exception as e:
            print(f"ERROR: Cannot connect to Redis: {e}")
            print("Chat history service will be DISABLED.")
            
    def load_history(self, conversation_id: str) -> list:
        if not self.is_available:
            return []
            
        try:
            redis_key = f"chat_history:{conversation_id}"
            json_string = self.client.get(redis_key)
            
            if json_string:
                return json.loads(json_string)
            else:
                return []
        except Exception as e:
            print(f"Error loading history {conversation_id} from Redis: {e}")
            return []

    def save_history(self, conversation_id: str, history_list: list):
        if not self.is_available:
            return
            
        try:
            redis_key = f"chat_history:{conversation_id}"
            json_string = json.dumps(history_list, ensure_ascii=False)
            
            self.client.set(redis_key, json_string)
            
            if self.ttl > 0:
                self.client.expire(redis_key, self.ttl)
                
        except Exception as e:
            print(f"Error saving history {conversation_id} to Redis: {e}")