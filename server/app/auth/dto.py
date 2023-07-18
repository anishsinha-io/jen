from dataclasses import dataclass

from app.dto import Dto


@dataclass
class GetUser(Dto):
    user_id: str


@dataclass
class GetUserByEmail(Dto):
    email: str


@dataclass
class GetUserAccess(Dto):
    user_id: str
