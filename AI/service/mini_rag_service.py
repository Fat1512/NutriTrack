from typing import List, Dict, Any
from datetime import datetime, timezone, timedelta
from dateutil import parser as date_parser

from components.manager import EmbeddingManager
from langchain_text_splitters import RecursiveCharacterTextSplitter
from components.manager import ReaderManager
from components.manager import DatabaseManager

class MiniRagService:
    def __init__(self, collection_name="rag_documents"):
        self.embedder = EmbeddingManager()
        self.reader_manager = ReaderManager()
        self.db = DatabaseManager()
        self.collection_name = collection_name

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        print("MiniRag initialized.")

    def ingest_file(self, file_path: str, filename: str) -> Dict[str, Any]:
        text, error = self.reader_manager.read_file(file_path)
        if error:
            return {"error": error, "filename": filename}
        
        return self._process_and_store_text(text, filename, extra_metadata=None)

    def ingest_bytes(self, raw_bytes: bytes, filename: str, extra_metadata: dict = None) -> Dict[str, Any]:
        try:
            text = raw_bytes.decode('utf-8')
        except Exception as e:
            return {"error": f"Error decoding bytes: {e}", "filename": filename}
        
        return self._process_and_store_text(text, filename, extra_metadata)

    def _process_and_store_text(self, text: str, filename: str, extra_metadata: dict = None) -> Dict[str, Any]:
        chunks = self.text_splitter.split_text(text)
        print(f"Split '{filename}' into {len(chunks)} chunks.")

        embeddings = self.embedder.vectorize(chunks)

        ids = [f"{filename}_{i}" for i in range(len(chunks))]
        metadatas = []
        for i in range(len(chunks)):
            meta = {"source": filename, "chunk_index": i}
            if extra_metadata:
                meta.update(extra_metadata)
            metadatas.append(meta)
        
        documents = chunks
        
        self.db.delete(
            collection_name=self.collection_name,
            where_filter={"source": filename}
        )
        
        self.db.add(
            collection_name=self.collection_name,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        print(f"Successfully ingested and vectorized file: {filename}")
        return {
            "status": "success",
            "filename": filename,
            "chunks_added": len(chunks)
        }

    def retrieve_context(self, query: str, n_results: int = 3) -> List[str]:
        query_vector = self.embedder.vectorize_single(query)
        results = self.db.query(
            collection_name=self.collection_name,
            query_embeddings=[query_vector],
            n_results=n_results
        )
        
        return results.get("documents", [[]])[0]

    def list_documents(self) -> List[str]:
        print("Listing unique documents...")
        unique_files = self.db.get_unique_metadata_values(
            self.collection_name, 
            "source"
        )
        return sorted(list(unique_files))

    def delete_document(self, filename: str) -> Dict[str, Any]:
        print(f"Attempting to delete document: {filename}")
        try:
            self.db.delete(
                collection_name=self.collection_name,
                where_filter={"source": filename}
            )
            print(f"Successfully deleted document: {filename}")
            return {"status": "deleted", "filename": filename}
        except Exception as e:
            print(f"Error deleting document {filename}: {e}")
            return {"error": str(e), "filename": filename}

    def document_exists(self, filename: str) -> bool:
        results = self.db.get_unique_metadata_values(self.collection_name, "source")
        return filename in results

    def delete_documents_older_than(self, prefix: str, days: int):
        if days <= 0:
            print(f"Stale document deletion is disabled (days={days}).")
            return 0
        
        if date_parser is None:
            print("Cannot delete old files: 'python-dateutil' is not installed.")
            return 0

        try:
            cutoff_dt = datetime.now(timezone.utc) - timedelta(days=days)
            print(f"Deleting documents with prefix '{prefix}' published before {cutoff_dt.isoformat()}...")

            # --- BẮT ĐẦU LOGIC MỚI ---
            
            # 1. Lấy TẤT CẢ metadata từ DB bằng phương thức mới
            db_data = self.db.get_all(
                collection_name=self.collection_name,
                include=["metadatas"]
            )

            all_metadatas = db_data.get('metadatas', [])
            if not all_metadatas:
                print("No documents found in the collection. Nothing to check.")
                return 0

            # 2. Xây dựng một dict để theo dõi ngày cũ nhất của mỗi file
            #    và lọc các file có prefix
            #    Format: { "filename": "oldest_date_found" }
            document_dates = {}
            
            for meta in all_metadatas:
                filename = meta.get("source")
                pub_date_str = meta.get("publication_date") # Lấy ngày xuất bản từ metadata

                if not filename or not pub_date_str:
                    # Bỏ qua chunk này nếu nó không có 'source' hoặc 'publication_date'
                    continue
                
                # Chỉ quan tâm đến các file có prefix
                if not filename.startswith(prefix):
                    continue
                    
                # Parse ngày
                try:
                    pub_date_dt = date_parser.parse(pub_date_str)
                    if pub_date_dt.tzinfo is None:
                        pub_date_dt = pub_date_dt.replace(tzinfo=timezone.utc)
                except Exception as e:
                    print(f"Skipping check for {filename}: Cound not parse date '{pub_date_str}'. Error: {e}")
                    continue

                # Vì tất cả các chunk của một file đều có cùng 1 ngày, 
                # chúng ta chỉ cần lưu lại ngày đầu tiên tìm thấy.
                if filename not in document_dates:
                    document_dates[filename] = pub_date_dt

            # 3. Lặp qua danh sách đã lọc và xóa nếu quá cũ
            if not document_dates:
                print(f"No documents with prefix '{prefix}' and valid 'publication_date' found.")
                return 0

            print(f"Found {len(document_dates)} document(s) with prefix '{prefix}'. Checking publication dates...")

            deleted_count = 0
            for filename, pub_date in document_dates.items():
                if pub_date < cutoff_dt:
                    print(f"🗑️ Deleting stale file: {filename} (Published: {pub_date.isoformat()})")
                    # Gọi hàm delete_document hiện có (sẽ xóa tất cả các chunk của file)
                    self.delete_document(filename)
                    deleted_count += 1

            # --- KẾT THÚC LOGIC MỚI ---

            print(f"Stale document check complete. Deleted {deleted_count} document(s).")
            return deleted_count

        except Exception as e:
            print(f"Error in delete_documents_older_than: {e}")
            return 0