# Mini-RAG: Automated RAG Service

This project is an automated Retrieval-Augmented Generation (RAG) service. It automatically ingests documents from local folders and RSS feeds, stores them in a vector database, and provides a simple API for chatting with your documents.

## Features

- **Modular Architecture**: Core components like the LLM, embedding model, and vector database are abstracted and managed by singletons.
- **Configurable Backends**: Easily switch between providers using environment variables:
  - **LLM**: `openai`, `ollama`.
  - **Embedding**: `sentence_transformer`, `ollama`.
  - **Database**: `chroma`.
- **Automated Ingestion**:
  - **`LocalFolderWatcher`**: Monitors a local directory for file creation, modification, and deletion and automatically syncs with the RAG service.
  - **`RSSWatcher`**: Monitors multiple RSS feeds, extracts article content, and ingests them into the RAG service.
- **API Interface**: A Flask-based API to interact with the RAG service.
- **Automatic Cleanup**: Automatically deletes old RSS articles from the vector store based on a configurable age limit.

## Core Components

- **`MiniRagService`**: The central service that handles text splitting, embedding, and interaction with the vector database (add, delete, query).
- **Managers (`manager.py`)**: A set of singleton managers that initialize and provide access to the `Generator` (LLM), `Embedding`, and `VectorDatabase` components based on environment variables.
- **Watchers (`local_watcher.py`, `rss_watcher.py`)**: Asynchronous background services that monitor for new content. They are designed to run in a separate event loop and call the synchronous `MiniRagService` methods safely using `run_in_executor`.
- **API (`routes.py`)**: Provides HTTP endpoints for uploading documents, deleting documents, and running RAG chat queries.

## How to Run

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configuration (Environment Variables)

Set these in your `.env` file or as system variables.

```bash
# LLM & Embedding Providers ("openai" or "ollama")
LLM_PROVIDER="ollama"
EMBEDDING_PROVIDER="sentence_transformer"

# OPENAI_MODEL=gpt-4o-mini
# OPENAI_API_KEY=<api-key>


# Database Provider ("chroma")
DB_PROVIDER="chroma"

# --- Watcher Configuration ---

# Directory for the LocalFolderWatcher
# The API will also save uploaded files here
WATCHER_LOCAL_PATH=./storage

# Enable/disable the RSS watcher ("true" or "false")
RSS_WATCHER_ENABLED="true"

# Days to keep RSS articles (0 to disable cleanup)
RSS_MAX_AGE_DAYS=1

# RSS Feed (use ',' for separate)
WATCHER_RSS_URLS=https://example/dinh-duong.rss, https://example/rss/suc-khoe.rss
```

### 3. Run app

```bash
python run.py
```

## Food Analysis API

This service also provides endpoints for analyzing food images and dietary routines using a separate `FoodPipeline`.

## API Endpoints

- `POST /api/analyze`
  - **Action**: Analyzes one or more food images.
  - **Input**: `multipart/form-data` containing one or multiple files under the key `images`.
  - **Response**: Returns a JSON object with the analysis results from the `FoodPipeline`.
  - **Note**: Temporary files are created and cleaned up automatically on the server.

- `POST /api/analyze-routine`
  - **Action**: Analyzes a user's dietary routine and status.
  - **Input**: A JSON body containing `routine` and `userStatus` keys.
  - **Response**: Returns a JSON object with the analysis results from the `FoodPipeline`.

- `POST /api/rag/upload`
  - Upload a file. It will be saved to WATCH_DIR and ingested by the LocalFolderWatcher.

- `POST /api/rag/chat`
  - Body: `{ "query": "Your question here" }
  - Streams a RAG response based on the ingested documents.

- `GET /api/rag/documents`
  - Lists all unique documents currently in the vector store.

- `DELETE /api/rag/document`
  - Body: `{ "filename": "filename_to_delete.pdf" }`
