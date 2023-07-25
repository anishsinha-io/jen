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
    """Handle user logins

    A valid body contains an email and a candidate password. The
    email is used to search for the user in the database and if found,
    the hashed password retrived is compared to a hash of the candidate
    using an algorithm-specific function (verify_bcrypt for bcrypt and
    verify_argon2 for argon2). If the user is authorized, then an access
    token and refresh token are generated and sent back to the client
    alongside the user object. A HTTPOnly session cookie is generated
    by appending a+j to a uuid. This cookie is then set on the response
    body and sent to the client with a 200 status code.

    If a user is unauthenticated, then a 401 is returned.
    """
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
    """This route generates new credentials for authenticated users
    if they are still authenticated.

    JSON Web Tokens issued by this server are active for exactly
    120 seconds for security purposes. New credentials must be generated
    at a rate slightly greater than this. For example, on the client that
    comes with this backend, intervals of 100 seconds are used. Every 100
    seconds, a POST request is made to this endpoint with no data. The
    HTTPOnly session cookie keyed with "session_state" is then queried and
    compared with the server side session stored in Redis on this server. If
    the cookies match, then new credentials are generated for the user. A
    new session_state value is generated and set in the cache and the cookie
    is regenerated.

    This architecture is very robust and makes it extremely difficult to steal
    credentials. JWT's are ephemeral by design, and secure session cookies are
    regenerated rapidly. The session cookies are extraordinarily difficult to
    steal as that would require finding a vulnerability in the browser itself.
    """

    session_state = session.get("session_state")
    user_id = session.get("user_id")

    if session_state is None or user_id is None:
        return jsonify(msg="unauthorized"), 401

    client_session_cookie = request.cookies.get("session_state")

    if client_session_cookie is None or session_state != client_session_cookie:
        return jsonify(msg="unauthorized"), 401

    login_response = create_login_response(user_id=user_id)

    new_session_state = "a+j" + str(uuid4())

    session["session_state"] = new_session_state

    res = jsonify(
        token=login_response.access_token.sign_and_issue(), user=login_response.user
    )

    res.set_cookie("session_state", new_session_state, httponly=True)

    return res, 200


@module.route("/logout", methods=["POST"])
@rbac_guard()
def handle_logout():
    """Handle user logouts

    This function handles user logouts. When a POST request is sent to this
    endpoint, the server side session in the Redis cache is purged immediately,
    and the session_state cookie is deletes. This, by design, invalidates any
    still-active tokens, although the tokens expire rapidly anyway.
    """

    session.pop("session_state", "")
    print(session.get("session_state"))
    res = jsonify(msg="successfully logged out")
    res.set_cookie("session_state", "", httponly=True, expires=0)
    return res, 204
