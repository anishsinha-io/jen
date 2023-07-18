import os
from strenum import StrEnum

from .util.enum_base import EnumBase


class LaunchMode(StrEnum, metaclass=EnumBase):
    DEV = "development"
    STAGE = "staging"
    TEST = "testing"
    PROD = "production"


LAUNCH_MODE = (
    LaunchMode(os.environ.get("LAUNCH_MODE"))
    if os.environ.get("LAUNCH_MODE") in LaunchMode
    else LaunchMode.PROD
)

WORKDIR = os.path.dirname(os.path.abspath(__file__))
