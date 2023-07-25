import os
from strenum import StrEnum

from .util.enum_base import EnumBase


class LaunchMode(StrEnum, metaclass=EnumBase):
    """The possible modes for the app to launch in"""

    DEV = "development"
    STAGE = "staging"
    TEST = "testing"
    PROD = "production"


# The app starts in production mode unless overriden
LAUNCH_MODE = (
    LaunchMode(os.environ.get("LAUNCH_MODE"))
    if os.environ.get("LAUNCH_MODE") in LaunchMode
    else LaunchMode.PROD
)

WORKDIR = os.path.dirname(os.path.abspath(__file__))
