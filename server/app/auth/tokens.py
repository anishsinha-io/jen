import time
from uuid import uuid4

import jwt
from jwt import InvalidTokenError

from app.auth import PUBLIC_KEY, AUD, ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME, ISS

from .dto import GetUserAccess, GetUser
from .entity import Token, LoginResponse, User
from .repo import get_user_access, get_user


def verify_token(token: str) -> Token | None:
    try:
        return Token(
            **jwt.decode(token, PUBLIC_KEY, algorithms=["RS256"], audience=AUD)
        )
    except InvalidTokenError:
        return None


def create_login_response(user_id: str) -> LoginResponse:
    dto = GetUserAccess(user_id=user_id)

    access = get_user_access(dto=dto)

    dto = GetUser(user_id=user_id)

    user = get_user(dto=dto)

    jti = str(uuid4())

    iat = int(time.time())
    nbf = iat
    exp = iat + ACCESS_TOKEN_LIFETIME

    access_token = Token(
        iss=ISS,
        sub=str(user_id),
        aud=AUD,
        jti=jti,
        nbf=nbf,
        iat=iat,
        exp=exp,
        access=access.dict(),
    )

    exp = iat + REFRESH_TOKEN_LIFETIME
    refresh_token = Token(
        iss=ISS,
        sub=str(user_id),
        aud=AUD,
        jti=jti,
        nbf=nbf,
        iat=iat,
        exp=exp,
        access=access.dict(),
    )

    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=User(
            id=user.id,
            email=user.email,
            username=user.username,
            created_at=user.created_at,
            updated_at=user.updated_at,
            first_name=user.first_name,
            last_name=user.last_name,
            access=access,
        ),
    )
