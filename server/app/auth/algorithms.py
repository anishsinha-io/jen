from strenum import StrEnum

import bcrypt

from argon2 import PasswordHasher
from argon2.exceptions import HashingError

from app.log.logger import get_logger
from app.util.enum_base import EnumBase

logger = get_logger("Algorithms")


class HashAlgorithm(StrEnum, metaclass=EnumBase):
    BCRYPT = "bcrypt"
    ARGON2 = "argon2"


def hash_argon2(password: str) -> str | None:
    try:
        hasher = PasswordHasher()
        return hasher.hash(password)
    except HashingError as e:
        logger.error(str(e))
        return None


def hash_bcrypt(password: str) -> str | None:
    try:
        return bcrypt.hashpw(password, bcrypt.gensalt())
    except:  # nolint
        return None


def verify_argon2(hashed: str, candidate: str) -> bool:
    try:
        hasher = PasswordHasher()
        return hasher.verify(hashed, candidate)
    except:
        return False


def verify_bcrypt(hashed: str, candidate: str) -> bool:
    try:
        return bcrypt.checkpw(candidate, hashed)
    except:
        return False
