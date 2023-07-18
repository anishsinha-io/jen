import os
import redis
from flask import Flask
from flask_cors import CORS
from flask_session import Session
from dotenv import load_dotenv

from app.middleware.prefix import PrefixMiddleware

load_dotenv()

cors = CORS()
server_session = Session()


def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    app.config["SESSION_TYPE"] = "redis"
    app.config["SESSION_PERMANENT"] = True
    app.config["SESSION_USE_SIGNER"] = True
    app.config["SESSION_REDIS"] = redis.from_url("redis://localhost:6379")

    from .auth.urls import module as auth
    from .users.urls import module as users

    app.register_blueprint(auth)
    app.register_blueprint(users)

    cors.init_app(app, supports_credentials=True)
    server_session.init_app(app)

    app.wsgi_app = PrefixMiddleware(app.wsgi_app, prefix="/api")

    return app
