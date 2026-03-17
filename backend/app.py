import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

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
    app.run(debug=True)
