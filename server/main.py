import os
from app import create_app
from app.launch import LaunchMode
from app.log.logger import get_logger

from flask import Response, jsonify
from werkzeug.exceptions import HTTPException

server = create_app()

logger = get_logger("Main")


@server.errorhandler(Exception)
def handle_error(e) -> tuple[Response, int]:
    code = 500
    if isinstance(e, HTTPException):
        if e.code is not None:
            code = e.code

    logger.error(str(e))
    return jsonify(error="internal server error"), code


@server.route("/health/live")
def liveness_probe():
    return (
        jsonify(
            msg="""if you're seeing this, the app is live! 
                   also, hi from anish and jenny (:"""
        ),
        200,
    )


@server.route("/health/ready")
def readiness_probe():
    return (
        jsonify(
            msg="""if you're seeing this, the app is ready!, 
                   also, hi from anish and jenny (:"""
        ),
        200,
    )


if __name__ == "__main__":
    env = os.environ["LAUNCH_MODE"]
    debug = env != LaunchMode.PROD
    logger.info("initialized app")
    server.run(host="0.0.0.0", port=8888, debug=debug)
