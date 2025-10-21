from flask import Blueprint, request, jsonify
import os, tempfile
from service.pipeline_service import FoodPipeline
from service.mini_rag_service import MiniRagService 
from components.manager import GenerationManager
from components.manager import PromptManager
from werkzeug.utils import secure_filename

bp = Blueprint("ai-api", __name__, url_prefix="/api")

pipeline = FoodPipeline()

rag_service = MiniRagService()
rag_llm = GenerationManager()
rag_prompts = PromptManager()

@bp.route("/analyze", methods=["POST"])
def analyze_food():
    image_files = request.files.getlist("images")

    image_paths = []
    for file in image_files:
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        file.save(tmp.name)
        image_paths.append(tmp.name)

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
                "filename_saved": filename,
                "message": "File saved to watch directory. Ingest process will start automatically."
            })

        except Exception as e:
            return jsonify({"error": f"Cannot save file {filename}: {e}"}), 500


@bp.route("/rag/chat", methods=["POST"])
def rag_chat():
    data = request.json
    query = data.get("query")
    
    if not query:
        return jsonify({"error": "Missing 'query'"}), 400
    
    context_chunks = rag_service.retrieve_context(query, n_results=3)
    
    if not context_chunks:
        return jsonify({"answer": "I couldn't find this information in the documents.", "token_usage": {}})

    context_str = "\n\n---\n\n".join(context_chunks)
    
    try:
        chat_prompt = rag_prompts.load(
            "rag_chat",
            context=context_str,
            query=query
        )
    except Exception as e:
        return jsonify({"error": f"Could not load rag_chat prompt: {e}"}), 500

    response = rag_llm.generate(chat_prompt)
    
    return jsonify({
        "answer": response.get("text", "Error generating response."),
        "token_usage": {
            "prompt_tokens": response.get("prompt_tokens", 0),
            "completion_tokens": response.get("completion_tokens", 0),
            "total_tokens": response.get("total_tokens", 0)
        }
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