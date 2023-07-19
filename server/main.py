import os
from app import create_app
from app.launch import LaunchMode
from app.log.logger import get_logger

server = create_app()

logger = get_logger("MAIN")

if __name__ == "__main__":
    env = os.environ["LAUNCH_MODE"]
    debug = env != LaunchMode.PROD
    logger.info("initialized app")
    server.run(host="0.0.0.0", port=8888, debug=debug)
