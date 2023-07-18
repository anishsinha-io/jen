import os

from dataclasses import dataclass, field
from datetime import datetime

import jwt

from app.auth import PRIVATE_KEY
from app.entity import Entity

from .algorithms import HashAlgorithm


@dataclass
class TokenGroupMapping(Entity):
    id: str
    group_name: str


@dataclass
class TokenRoleMapping(Entity):
    id: str
    role_name: str


@dataclass
class TokenPermissionMapping(Entity):
    id: str
    permission_name: str
    scopes: list[str]


@dataclass
class Access(Entity):
    groups: list[TokenGroupMapping] = field(default_factory=lambda: [])
    roles: list[TokenRoleMapping] = field(default_factory=lambda: [])
    permissions: list[TokenPermissionMapping] = field(default_factory=lambda: [])


@dataclass
class User(Entity):
    id: str
    first_name: str
    last_name: str
    email: str
    username: str
    created_at: datetime
    updated_at: datetime
    access: Access


@dataclass(kw_only=True)
class UserWithCredentialData(Entity):
    id: str
    first_name: str
    last_name: str
    email: str
    username: str
    created_at: datetime
    updated_at: datetime
    secret_data: str
    algorithm: HashAlgorithm


@dataclass
class Token(Entity):
    iss: str
    sub: str
    aud: str
    jti: str
    nbf: int
    iat: int
    exp: int
    access: dict

    def sign_and_issue(self) -> str:
        return jwt.encode(self.dict(), PRIVATE_KEY, "RS256")


@dataclass
class LoginResponse(Entity):
    user: User
    access_token: Token
    refresh_token: Token
