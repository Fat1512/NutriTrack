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
import asyncio
import feedparser
import httpx
import trafilatura
import hashlib
import os
import functools
from dateutil import parser as date_parser
from datetime import datetime, timezone, timedelta
from components.interfaces import BaseWatcher
from service.mini_rag_service import MiniRagService
from service.watcher_state_service import WatcherStateService


class RSSWatcher(BaseWatcher):
    def __init__(self, feed_urls: list[str], check_interval_seconds: int = 3600, save_dir: str | None = None):
        self.feed_urls = feed_urls
        self.check_interval = check_interval_seconds
        self.max_backfill_pages = int(os.getenv("RSS_MAX_BACKFILL_PAGES", "1"))
        self.max_age_days = int(os.getenv("RSS_MAX_AGE_DAYS", "0"))
        self.state_service = WatcherStateService()

        self.rag_service: MiniRagService = None
        self.loop: asyncio.AbstractEventLoop = None
        self.seen_articles: dict[str, str] = {}
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
        }
        self.http_client = httpx.AsyncClient(timeout=20.0, follow_redirects=True, headers=headers)

        self.save_dir = save_dir
        print(f"Initialized RSSWatcher, checking every {check_interval_seconds} seconds.")

        if self.max_age_days > 0:
            print(f"Auto-delete RSS files older than {self.max_age_days} days: ENABLED")
        else:
            print("Auto-delete old RSS files: DISABLED")

    async def start(self, rag_service: MiniRagService, loop: asyncio.AbstractEventLoop):
        self.rag_service = rag_service
        self.loop = loop
        print(f"Starting RSSWatcher for {len(self.feed_urls)} feed(s).")

        try:
            if self.state_service.is_enabled('rss'):
                print("RSSWatcher: ENABLED on startup. Running backfill...")
                await self._run_backfill()
                print("Backfill completed. Starting to monitor for new articles...")
            else:
                print("RSSWatcher: DISABLED on startup. Backfill skipped.")

            while True:
                if self.state_service.is_enabled('rss'):
                    print("RSSWatcher: ENABLED. Checking for new articles...")
                    for feed_url in self.feed_urls:
                        await self._process_feed_url(feed_url, is_backfill=False)

                    if self.max_age_days > 0:
                        self.rag_service.delete_documents_older_than(
                            prefix="rss_",
                            days=self.max_age_days
                        )

                    print(f"RSSWatcher: Finished checking. Sleeping for {self.check_interval} seconds...")
                    await asyncio.sleep(self.check_interval)
                
                else:
                    print("RSSWatcher: DISABLED. Sleeping for 60s...")
                    await asyncio.sleep(60)

        except asyncio.CancelledError:
            print("RSSWatcher is stopping...")
        except Exception as e:
            print(f"Critical error in RSSWatcher: {e}")
        finally:
            await self.http_client.aclose()

    async def _run_backfill(self):
        print("Starting RSS history backfill process...")
        for base_feed_url in self.feed_urls:
            for page_num in range(1, self.max_backfill_pages + 1):
                feed_url = base_feed_url if page_num == 1 else f"{base_feed_url}?paged={page_num}"
                print(f"Backfilling feed: {feed_url}")
                had_entries = await self._process_feed_url(feed_url, is_backfill=True)
                if not had_entries:
                    print(f"Feed {feed_url} has no posts, stopping backfill.")
                    break
        print("RSS history backfill completed.")

    async def _process_feed_url(self, feed_url: str, is_backfill: bool) -> bool:
        try:
            print(f"Fetching feed: {feed_url}")
            response = await self.http_client.get(feed_url)
            response.raise_for_status()
            feed_content_bytes = response.content
            
            print(f"Parsing feed: {feed_url} ({len(feed_content_bytes)} bytes)")
            
            func_to_run = functools.partial(feedparser.parse, feed_content_bytes)
            parsed_feed = await self.loop.run_in_executor(None, func_to_run)

            if parsed_feed.bozo:
                print(f"ERROR: Feed has error (bozo=True). Feed: {feed_url}")
                if isinstance(parsed_feed.bozo_exception, Exception):
                    print(f"   (Cause: {parsed_feed.bozo_exception})")
                return False 
            
            if not parsed_feed.entries:
                print(f"INFO: Feed parsed successfully but no articles found (entries=0). Feed: {feed_url}")
                return False

            now_utc = datetime.now(timezone.utc)
            had_valid_entries = False

            for entry in parsed_feed.entries:
                article_id = entry.get("id", entry.get("guid", entry.link))
                pub_date_str = entry.get("published", entry.get("updated", None))
                last_updated = entry.get("updated", pub_date_str)

                if self.max_age_days > 0 and pub_date_str and date_parser:
                    try:
                        pub_date_dt = date_parser.parse(pub_date_str)
                        if pub_date_dt.tzinfo is None:
                            pub_date_dt = pub_date_dt.replace(tzinfo=timezone.utc)
                        
                        cutoff_dt = now_utc - timedelta(days=self.max_age_days)
                        
                        if pub_date_dt < cutoff_dt:
                            print(f"SKIPPING (Too old: {pub_date_dt.date()}): {entry.title}")
                            continue

                    except Exception as e:
                        print(f"Could not parse date '{pub_date_str}' for age check. Error: {e}")

                if not is_backfill and article_id in self.seen_articles and \
                   self.seen_articles.get(article_id) == last_updated:
                    continue

                raw_bytes = await self._fetch_and_extract_content(entry.link)
                if not raw_bytes:
                    continue

                filename = self._create_filename(entry.link, entry.title)
                if self.save_dir:
                    save_path = os.path.join(self.save_dir, filename)
                    
                    if os.path.exists(save_path):
                        continue

                    print(f"Saving RSS: {filename} to watch directory...")
                    try:
                        with open(save_path, "wb") as f:
                            f.write(raw_bytes)
                    except Exception as e:
                        print(f"Error saving RSS file {save_path}: {e}")
                
                else:
                    if self.rag_service.document_exists(filename):
                        print(f"Skipping existing article '{filename}'")
                        continue

                    if not is_backfill:
                        print(f"New/updated article (direct ingest): {entry.title}")

                    publication_date = pub_date_str or now_utc.isoformat()
                    await self.rag_service.ingest_bytes(
                        raw_bytes,
                        filename,
                        extra_metadata={
                            "publication_date": publication_date,
                            "source_url": entry.link
                        }
                    )

                self.seen_articles[article_id] = last_updated
                had_valid_entries = True
                await asyncio.sleep(1)

            return had_valid_entries

        except Exception as e:
            print(f"Error processing feed {feed_url}: {e}")
            return False

    async def _fetch_and_extract_content(self, url: str) -> bytes | None:
        try:
            response = await self.http_client.get(url)
            response.raise_for_status() 
            text_content = trafilatura.extract(response.text, 
                                               include_comments=False, 
                                               include_tables=True)
            if text_content:
                return text_content.encode("utf-8")
            return None
        except Exception as e:
            print(f"Error downloading/extracting {url}: {e}")
            return None

    def _create_filename(self, url: str, title: str) -> str:
        url_hash = hashlib.md5(url.encode()).hexdigest()
        safe_title = "".join(c for c in title if c.isalnum() or c in " _-").strip()
        safe_title = safe_title[:50].strip().replace(" ", "_")
        return f"rss_{safe_title}_{url_hash}.txt"