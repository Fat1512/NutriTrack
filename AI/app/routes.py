from flask import Blueprint, request, jsonify
import os, tempfile
from service.pipeline_service import FoodPipeline

bp = Blueprint("ai-api", __name__, url_prefix="/api")

pipeline = FoodPipeline()

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