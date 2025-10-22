import sys
try:
    __import__('pysqlite3')
    sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
    print("Using pysqlite3-binary for ChromaDB compatibility")
except ImportError:
    print("Warning: pysqlite3-binary not installed, using system SQLite")

from dotenv import load_dotenv
load_dotenv()

import os
from flask import Flask
from app.routes import bp
from flask_cors import CORS

def main():
    print("Starting Flask server...")
    
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(bp)
    
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT", 5000))
    
    print(f"Server is running. API available at http://{host}:{port}/api")
    
    app.run(host=host, port=port)

if __name__ == "__main__":
    main()