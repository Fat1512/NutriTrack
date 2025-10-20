from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
from app.routes import bp as vision_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(vision_bp)
    CORS(app)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
