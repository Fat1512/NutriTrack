import os
import feedparser
import asyncio
from trafilatura import fetch_url, extract
from service.mini_rag_service import MiniRagService
from service.history_service import RedisHistoryService
from typing import List, Dict, Any

class TriggerService:
    def __init__(self, rag_service: MiniRagService, redis_service: RedisHistoryService):
        self.rag_service = rag_service
        self.redis_client = redis_service.client
        self.redis_key = "processed_rss_guids"
        print("TriggerService initialized.")

    
    def scan_local_directory(self) -> Dict[str, Any]:
        local_watch_dir = os.getenv("WATCHER_LOCAL_PATH")
        if not local_watch_dir:
            print("Error: WATCHER_LOCAL_PATH not configured.")
            return {"status": "error", "message": "WATCHER_LOCAL_PATH not configured."}
        
        print(f"TriggerService: Scanning local directory: {local_watch_dir}")
        ingested_files = []
        skipped_files = []
        
        try:
            for filename in os.listdir(local_watch_dir):
                file_path = os.path.join(local_watch_dir, filename)
                if os.path.isfile(file_path):
                    print(f"Found file: {filename}. Attempting to ingest...")
                    try:
                        result = self.rag_service.ingest_file(file_path, filename)
                        if "error" in result:
                            skipped_files.append({"file": filename, "reason": result["error"]})
                        else:
                            ingested_files.append({"file": filename, "chunks": result.get("chunks_added", 0)})
                    except Exception as e:
                        print(f"Error ingesting {filename}: {e}")
                        skipped_files.append({"file": filename, "reason": str(e)})
            
            return {
                "status": "completed",
                "path": local_watch_dir,
                "ingested": ingested_files,
                "skipped": skipped_files
            }
        except Exception as e:
            print(f"Error reading directory {local_watch_dir}: {e}")
            return {"status": "error", "message": f"Failed to scan directory: {str(e)}"}


    async def poll_rss_feeds_async(self) -> Dict[str, Any]:
        rss_urls_str = os.getenv("WATCHER_RSS_URLS")
        if not rss_urls_str:
            print("Error: WATCHER_RSS_URLS not configured.")
            return {"status": "error", "message": "WATCHER_RSS_URLS not configured."}
        
        feed_urls = [url.strip() for url in rss_urls_str.split(',') if url.strip()]
        if not feed_urls:
             return {"status": "error", "message": "No valid RSS URLs found in WATCHER_RSS_URLS."}

        print(f"TriggerService: Polling {len(feed_urls)} RSS feeds...")
        
        tasks = [self._process_feed_async(feed_url) for feed_url in feed_urls]
        results_list_of_lists = await asyncio.gather(*tasks)
        
        ingested_articles = []
        skipped_articles = []
        for feed_result in results_list_of_lists:
            for item in feed_result:
                if item["status"] == "ingested":
                    ingested_articles.append(item)
                else:
                    skipped_articles.append(item)

        print(f"RSS poll complete. Ingested {len(ingested_articles)} new articles.")
        return {
            "status": "completed",
            "feeds_polled": len(feed_urls),
            "ingested": ingested_articles,
            "skipped": skipped_articles
        }

    async def _process_feed_async(self, feed_url: str) -> List[Dict[str, str]]:
        results = []
        print(f"Polling feed: {feed_url}")
        try:
            parsed_feed = feedparser.parse(feed_url)
            for entry in parsed_feed.entries:
                guid = entry.get("guid", entry.link)
                
                if self.redis_client.sismember(self.redis_key, guid):
                    results.append({"status": "skipped", "title": entry.title, "reason": "already processed"})
                    continue

                print(f"RSS: Found new article: '{entry.title}'")
                try:
                    downloaded = fetch_url(entry.link)
                    if not downloaded:
                        results.append({"status": "skipped", "title": entry.title, "reason": "could not download content"})
                        continue
                    
                    main_content = extract(downloaded, include_comments=False, include_tables=False)
                    if not main_content:
                        results.append({"status": "skipped", "title": entry.title, "reason": "could not extract content"})
                        continue

                    metadata = {
                        "source_url": entry.link,
                        "publication_date": entry.get("published", ""),
                        "feed_title": entry.feed.title if hasattr(entry, 'feed') else 'N/A'
                    }
                    
                    self.rag_service.ingest_bytes(
                        raw_bytes=main_content.encode('utf-8'),
                        filename=f"rss_{entry.title}.txt",
                        extra_metadata=metadata
                    )
                    
                    self.redis_client.sadd(self.redis_key, guid)
                    results.append({"status": "ingested", "title": entry.title, "url": entry.link})
                
                except Exception as e:
                    print(f"Error processing article {entry.link}: {e}")
                    results.append({"status": "skipped", "title": entry.title, "reason": f"processing error: {str(e)}"})
        
        except Exception as e:
            print(f"Failed to parse feed {feed_url}: {str(e)}")
            results.append({"status": "skipped", "title": f"Feed: {feed_url}", "reason": f"feed parse error: {str(e)}"})
        
        return results