from flask import Blueprint, request, jsonify
import os, tempfile
from service.pipeline_service import FoodPipeline
from service.document_service import DocumentService
from components.manager import GenerationManager
from components.manager import PromptManager

bp = Blueprint("ai-api", __name__, url_prefix="/api")

pipeline = FoodPipeline()

doc_service = DocumentService()
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
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        suffix = os.path.splitext(file.filename)[1]
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
        file.save(tmp.name)
        
        result = doc_service.ingest_file(tmp.name, file.filename)
        
        try:
            os.remove(tmp.name)
        except:
            pass
            
        return jsonify(result)


@bp.route("/rag/chat", methods=["POST"])
def rag_chat():
    data = request.json
    query = data.get("query")
    
    if not query:
        return jsonify({"error": "Missing 'query'"}), 400
    
    context_chunks = doc_service.retrieve_context(query, n_results=3)
    
    if not context_chunks:
        return jsonify({"answer": "Tôi không tìm thấy thông tin này trong tài liệu.", "token_usage": {}})

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
        "answer": response.get("text", "Lỗi khi sinh câu trả lời."),
        "token_usage": {
            "prompt_tokens": response.get("prompt_tokens", 0),
            "completion_tokens": response.get("completion_tokens", 0),
            "total_tokens": response.get("total_tokens", 0)
        }
    })


@bp.route("/rag/documents", methods=["GET"])
def list_all_documents():
    try:
        documents = doc_service.list_documents()
        return jsonify({"documents": documents})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route("/rag/document", methods=["DELETE"])
def delete_one_document():
    data = request.json
    filename = data.get("filename")
    
    if not filename:
        return jsonify({"error": "Missing 'filename' in request body"}), 400
        
    try:
        result = doc_service.delete_document(filename)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500