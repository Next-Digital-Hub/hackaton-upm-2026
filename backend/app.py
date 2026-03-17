import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask
from flask_cors import CORS
from config import Config
import pymysql

from extensions import db, jwt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    url = os.getenv("DATABASE_URL", "")
    if url.startswith("mysql"):
        from urllib.parse import urlparse
        parsed = urlparse(url.replace("mysql+pymysql://", "mysql://"))
        conn = pymysql.connect(
            host=parsed.hostname,
            port=parsed.port or 3306,
            user=parsed.username,
            password=parsed.password,
        )
        conn.cursor().execute(
            f"CREATE DATABASE IF NOT EXISTS {parsed.path.lstrip('/')} "
            f"CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
        )
        conn.close()

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from routes.auth import auth_bp
    from routes.citizen import citizen_bp
    from routes.backoffice import backoffice_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(citizen_bp, url_prefix="/api/citizen")
    app.register_blueprint(backoffice_bp, url_prefix="/api/backoffice")

    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True,host="0.0.0.0")
