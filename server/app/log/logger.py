import os
import sys

from logging import Formatter, FileHandler, StreamHandler, Logger, getLogger, DEBUG


from app.launch import WORKDIR, LaunchMode


def get_logger(name: str) -> Logger:
    """Function to initialize a logger for a specified module

    :param name: Logger name
    :return: New logger or reference to existing logger with the same name if it's
             already been created
    """

    logger = getLogger(name=name)
    logger.setLevel(DEBUG)
    format_string = "[%(name)s] [%(asctime)s] | [%(levelname)s] | %(message)s"
    formatter = Formatter(format_string)

    console_handler = StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    env = os.environ["LAUNCH_MODE"]

    if env == LaunchMode.PROD:
        file_handler = FileHandler(f"{WORKDIR}/../log.txt")
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger
