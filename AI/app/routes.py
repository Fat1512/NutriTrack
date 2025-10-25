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
from flask import Blueprint, request, jsonify
import os, tempfile
import uuid
import json
from datetime import datetime

from app.utils import resize_image

from werkzeug.utils import secure_filename

from service.pipeline_service import FoodPipeline
from service.mini_rag_service import MiniRagService 
from service.history_service import RedisHistoryService
from service.guardrail_service import RAGGuardrailService
from service.watcher_state_service import WatcherStateService

from components.manager import GenerationManager
from components.manager import PromptManager

bp = Blueprint("ai-api", __name__, url_prefix="/api")

pipeline = FoodPipeline()

rag_service = MiniRagService()
rag_llm = GenerationManager()
rag_prompts = PromptManager()
rag_guardrails = RAGGuardrailService()
history_service = RedisHistoryService()
watcher_state_service = WatcherStateService()


@bp.route("/watcher/status", methods=["GET"])
def get_watcher_status():
    try:
        states = watcher_state_service.get_all_states()
        return jsonify({"status": "success", "watchers": states})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@bp.route("/watcher/toggle", methods=["POST"])
def toggle_watcher():
    data = request.json
    watcher_name = data.get("watcher")
    enabled_state = data.get("enabled")

    if watcher_name not in ["local", "rss"]:
        return jsonify({"status": "error", "message": "Invalid 'watcher' name. Must be 'local' or 'rss'."}), 400

    if not isinstance(enabled_state, bool):
        return jsonify({"status": "error", "message": "'enabled' field must be a boolean (true or false)."}), 400

    try:
        watcher_state_service.set_state(watcher_name, enabled_state)
        return jsonify({
            "status": "success",
            "watcher": watcher_name,
            "new_state": enabled_state
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@bp.route("/analyze", methods=["POST"])
def analyze_food():
    image_files = request.files.getlist("images")
    MAX_IMAGE_SIZE = (1024, 1024)
    IMAGE_QUALITY = 85

    image_paths = []
    processed_image_paths = []
    for file in image_files:
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        file.save(tmp.name)
        image_paths.append(tmp.name)
        try:
            resized_path = resize_image(tmp.name, MAX_IMAGE_SIZE, IMAGE_QUALITY)
            processed_image_paths.append(resized_path)
        except Exception as e:
            print(f"Failed to resize {tmp.name}: {e}")
            pass

    if not processed_image_paths:
        for p in image_paths:
            try: os.remove(p) 
            except: pass
        return jsonify({"error": "Could not process any images."}), 400

    result = pipeline.analyze_image(image_paths)

    for p in image_paths:
        try:
            os.remove(p)
        except:
            pass

    return jsonify(result)

    
@bp.route("/analyze-routine", methods=["POST"])
def analyze_routine():
    data = request.json
    
    routine_data = data.get("routine")
    user_status = data.get("userStatus")

    if not routine_data or not user_status:
        return jsonify({"error": "Missing 'routine' or 'userStatus' in request body"}), 400

    result = pipeline.analyze_routine(routine_data, user_status)

    return jsonify(result)

    
@bp.route("/rag/upload", methods=["POST"])
def upload_document():
    watch_dir = os.getenv("WATCHER_LOCAL_PATH", None)
    if not watch_dir:
        return jsonify({"error": "Server error: WATCHER_LOCAL_PATH not configured."}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        filename = secure_filename(file.filename)
        save_path = os.path.join(watch_dir, filename)

        try:
            os.makedirs(watch_dir, exist_ok=True)
        except Exception as e:
            return jsonify({"error": f"Cannot create watch directory: {e}"}), 500
        
        try:
            file.save(save_path)
            
            return jsonify({
                "status": "success", 
                "filename": filename,
                "message": "File saved to watch directory. Ingest process will start automatically."
            })

        except Exception as e:
            return jsonify({"error": f"Cannot save file {filename}: {e}"}), 500


@bp.route("/rag/chat", methods=["POST"])
def rag_chat():
    data = request.json
    query = data.get("query")
    conversation_id = data.get("conversation_id", None)

    if not query:
        return jsonify({"error": "Missing 'query'"}), 400
    
    if not history_service.is_available:
         return jsonify({"error": "Server error: Chat history service (Redis) is unavailable."}), 503
    
    if not conversation_id:
        conversation_id = str(uuid.uuid4())
        print(f"Starting new conversation: {conversation_id}")
    
    history_list = history_service.load_history(conversation_id)
    K_TURNS = int(os.getenv("K_TURNS", 5))
    recent_history_list = history_list[-K_TURNS:]
    
    history_string = ""
    for turn in recent_history_list:
        history_string += f"Người dùng: {turn['query']}\nTrợ lý: {turn['answer']}\n\n"


    intent, router_tokens = rag_guardrails.route_intent(query)

    if intent == "GREETING":
        try:
            greeting_prompt = rag_prompts.load("greeting_response", query=query)
            final_prompt_with_history = f"{history_string}{greeting_prompt}"
            response = rag_llm.generate(final_prompt_with_history)
            answer = response.get("text", "Xin chào! Tôi có thể giúp gì cho bạn?")
            
            history_list.append({"query": query, "answer": answer})
            history_service.save_history(conversation_id, history_list)
            
            return jsonify({
                "answer": answer,
                "token_usage": {
                    "prompt_tokens": response.get("prompt_tokens", 0),
                    "completion_tokens": response.get("completion_tokens", 0),
                    "total_tokens": response.get("total_tokens", 0)
                },
                "conversation_id": conversation_id
            })
        except Exception as e:
            return jsonify({"error": f"Could not load greeting_response prompt: {e}"}), 500

    elif intent == "META_QUERY":
        try:
            meta_prompt_template = rag_prompts.load("meta_info")
            final_prompt_with_history = f"{history_string}{meta_prompt_template}\n\nCâu hỏi của người dùng: {query}\nCâu trả lời của bạn:"
            response = rag_llm.generate(final_prompt_with_history)
            answer = response.get("text", "Tôi là một trợ lý AI.")
            
            history_list.append({"query": query, "answer": answer})
            history_service.save_history(conversation_id, history_list)
            
            return jsonify({
                "answer": answer,
                "token_usage": {
                    "prompt_tokens": response.get("prompt_tokens", 0),
                    "completion_tokens": response.get("completion_tokens", 0),
                    "total_tokens": response.get("total_tokens", 0)
                },
                "conversation_id": conversation_id
            })
        except Exception as e:
            return jsonify({"error": f"Could not load meta_info prompt: {e}"}), 500
    elif intent == "OUT_OF_DOMAIN":
        try:
            answer = "Tôi xin lỗi, tôi chỉ có thể trả lời các câu hỏi liên quan đến chủ đề sức khỏe và dinh dưỡng. Bạn có câu hỏi nào khác về chủ đề này không?"

            history_list.append({"query": query, "answer": answer})
            history_service.save_history(conversation_id, history_list)

            return jsonify({
                "answer": answer,
                "token_usage": router_tokens,
                "conversation_id": conversation_id
            })
        except Exception as e:
            return jsonify({"error": f"Error handling OUT_OF_DOMAIN: {e}"}), 500

    else:
        print(f"Executing RAG query for: {query}")
        context_chunks = rag_service.retrieve_context(query, n_results=3)
        
        is_valid, failure_answer = rag_guardrails.check_retrieval(context_chunks)

        if not is_valid:
            try:
                if history_service.is_available:
                    log_entry = {
                        "query": query,
                        "conversation_id": conversation_id,
                        "timestamp": datetime.now().isoformat()
                    }
                    history_service.client.lpush(
                        "rag:missing_queries",
                        json.dumps(log_entry, ensure_ascii=False)
                    )
                    history_service.client.expire(
                        "rag:missing_queries",
                        history_service.ttl
                    )
                    print(f"[WARN] RAG - Logged missing query to Redis: {query}")
                else:
                    print(f"[WARN] Redis unavailable — cannot log missing RAG query: {query}")
            except Exception as e:
                print(f"[ERROR] Failed to log missing RAG query: {e}")

            history_list.append({"query": query, "answer": failure_answer})
            history_service.save_history(conversation_id, history_list)
            
            return jsonify({
                "answer": failure_answer,
                "token_usage": router_tokens,
                "conversation_id": conversation_id
            })

        context_str = "\n\n---\n\n".join(context_chunks)
        
        try:
            chat_prompt = rag_prompts.load(
                "rag_chat",
                context=context_str,
                query=query
            )
        except Exception as e:
            return jsonify({"error": f"Could not load rag_chat prompt: {e}"}), 500

        final_prompt_with_history = f"{history_string}{chat_prompt}"
        
        response = rag_llm.generate(final_prompt_with_history)
        raw_text = response.get("text", "").strip()

        try:
            parsed = json.loads(raw_text)
            answer = parsed.get("answer", "Error parsing model output.")
            found = parsed.get("found", True)
        except Exception:
            answer = raw_text
            found = "Tôi chưa có đủ thông tin" not in raw_text
        
        history_list.append({"query": query, "answer": answer})
        history_service.save_history(conversation_id, history_list)
        if not found:
            try:
                if history_service.is_available:
                    log_entry = {
                        "query": query,
                        "conversation_id": conversation_id,
                        "timestamp": datetime.now().isoformat()
                    }
                    history_service.client.lpush(
                        "rag:missing_queries",
                        json.dumps(log_entry, ensure_ascii=False)
                    )
                    history_service.client.expire(
                        "rag:missing_queries",
                        history_service.ttl
                    )
                    print(f"[WARN] RAG - Logged missing query to Redis: {query}")
            except Exception as e:
                print(f"[ERROR] Failed to log missing RAG query: {e}")
        
        return jsonify({
            "answer": answer,
            "token_usage": {
                "prompt_tokens": response.get("prompt_tokens", 0),
                "completion_tokens": response.get("completion_tokens", 0),
                "total_tokens": response.get("total_tokens", 0)
            },
            "conversation_id": conversation_id
        })


@bp.route("/rag/documents", methods=["GET"])
def list_all_documents():
    try:
        documents = rag_service.list_documents()
        return jsonify({"documents": documents})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/rag/document", methods=["DELETE"])
def delete_one_document():
    data = request.json
    filename_from_request = data.get("filename")
    
    if not filename_from_request:
        return jsonify({"error": "Missing 'filename' in request body"}), 400
    
    filename = secure_filename(filename_from_request)
    if filename != filename_from_request:
        return jsonify({"error": "Invalid filename format."}), 400

    db_result = {}
    file_result = {}
    
    try:
        db_result = rag_service.delete_document(filename)
    except Exception as e:
        db_result = {"error": f"Error deleting from DB: {e}"}

    watch_dir = os.getenv("WATCHER_LOCAL_PATH", None)
    if not watch_dir:
        file_result = {"status": "skipped", "message": "WATCHER_LOCAL_PATH not configured, cannot delete local file."}
    else:
        try:
            file_path = os.path.join(watch_dir, filename)
            
            if os.path.exists(file_path) and os.path.isfile(file_path):
                os.remove(file_path)
                file_result = {"status": "deleted", "filename": filename}
            else:
                file_result = {"status": "not_found", "message": "Local file not found for deletion."}
        
        except Exception as e:
            file_result = {"error": f"Error deleting local file {filename}: {e}"}

    return jsonify({
        "database_status": db_result,
        "filesystem_status": file_result
    })