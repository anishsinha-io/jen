from dataclasses import dataclass, field
from datetime import datetime

import jwt

from app.auth import PRIVATE_KEY
from app.entity import Entity

from .algorithms import HashAlgorithm


@dataclass
class TokenGroupMapping(Entity):
    """Represent a token mapping which includes the group's id and name"""

    id: str
    group_name: str


@dataclass
class TokenRoleMapping(Entity):
    """Represent a token mapping which includes the role's id and name"""

    id: str
    role_name: str


@dataclass
class TokenPermissionMapping(Entity):
    """Represent a token mapping which includes the permission's id and name"""

    id: str
    permission_name: str
    scopes: list[str]


@dataclass
class Access(Entity):
    """Represent a user's access rights"""

    groups: list[TokenGroupMapping] = field(default_factory=lambda: [])
    roles: list[TokenRoleMapping] = field(default_factory=lambda: [])
    permissions: list[TokenPermissionMapping] = field(default_factory=lambda: [])


@dataclass
class User(Entity):
    """Generic user entity that should be returned from *most* functions returning user data"""

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
    """User entity which includes information about the user's credentials,
    i.e. their password hash and the hashing algorithm used. This shouldn't be
    sent to the client side, but is necessary to handle logins (we need to
    fetch the user's credential data in order to validate it, and we need their
    hash to compare a hashed candidate to)
    """

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
    """An access token object. Is an extension of the JWT specification
    [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519)
    """

    iss: str
    sub: str
    aud: str
    jti: str
    nbf: int
    iat: int
    exp: int
    access: dict

    def sign_and_issue(self) -> str:
        """Sign a token object and encode it as a URL-safe string"""
        return jwt.encode(self.dict(), PRIVATE_KEY, "RS256")


@dataclass
class LoginResponse(Entity):
    """Data that should be returned from a successful login response"""

    user: User
    access_token: Token
    refresh_token: Token
