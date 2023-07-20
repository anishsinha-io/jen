from flask import Blueprint, request, jsonify, session
from uuid import uuid4

from .algorithms import HashAlgorithm, verify_bcrypt, verify_argon2
from .dto import GetUserByEmail
from .entity import UserWithCredentialData, LoginResponse
from .guards import rbac_guard
from .repo import get_user_by_email
from .tokens import create_login_response

module = Blueprint("auth", __name__, url_prefix="/auth")


@module.route("/login", methods=["POST"])
def handle_login():
    body = request.json

    email = body.get("email")
    password = body.get("password")

    if email is None or password is None:
        return jsonify(msg="invalid email or password"), 400

    dto = GetUserByEmail(email=email)

    user: UserWithCredentialData = get_user_by_email(dto=dto)
    if user is None:
        return jsonify(msg="requested user not found"), 404

    hashed = user.secret_data
    hash_alg = user.algorithm

    if hash_alg == HashAlgorithm.ARGON2:
        if not verify_argon2(hashed, password):
            return jsonify(msg="unauthorized"), 401
    elif hash_alg == HashAlgorithm.BCRYPT:
        if not verify_bcrypt(hashed, password):
            return jsonify(msg="unauthorized"), 401
    else:
        return jsonify(msg="invalid algorithm"), 403

    user_id = user.id
    email = user.email

    session_state = "a+j" + str(uuid4())

    session["session_state"] = session_state
    session["user_id"] = user_id
    session["user_email"] = email

    tokens: LoginResponse = create_login_response(user_id=user_id)

    access_token = tokens.access_token.sign_and_issue()
    refresh_token = tokens.access_token.sign_and_issue()

    res = jsonify(access_token=access_token, refresh_token=refresh_token)

    res.set_cookie("session_state", session_state, httponly=True)
    # res.set_cookie("session_state", session_state, httponly=True, domain="client")

    return res, 200


@module.route("/token", methods=["POST"])
def handle_token():
    session_state = session.get("session_state")
    user_id = session.get("user_id")

    if session_state is None or user_id is None:
        return jsonify(msg="unauthorized"), 401

    client_session_cookie = request.cookies.get("session_state")

    if client_session_cookie is None or session_state != client_session_cookie:
        return jsonify(msg="unauthorized"), 401

    login_response = create_login_response(user_id=user_id)

    return jsonify(token=login_response.access_token.sign_and_issue(), user=login_response.user), 200


@module.route("/logout", methods=["POST"])
@rbac_guard()
def handle_logout():
    session.pop("session_state", "")
    print(session.get("session_state"))
    res = jsonify(msg="successfully logged out")
    res.set_cookie("session_state", "", httponly=True, expires=0)
    return res, 204
