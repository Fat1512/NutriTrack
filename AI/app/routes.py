from flask import Blueprint, request, jsonify
import os, tempfile
from service.pipeline_service import FoodPipeline

bp = Blueprint("llm", __name__, url_prefix="/api/llm")

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