import functools

from app.log.logger import get_logger
from flask import request, session, jsonify, g

from .tokens import verify_token

logger = get_logger("auth")


def rbac_guard(
    groups=None,
    roles=None,
    permissions=None,
    # scopes: list[str] = [],
):
    """Role Based Access Control

    This function may be used a as a decorator over any endpoint that needs
    access control. Specifically, this guard can be used to ensure that the
    groups, roles, and permissions a user has are enough to be allowed
    access to the guarded route. It can be used as follows:

    ```python

    from flask import Flask

    app = Flask(__name__)

    # unguarded route
    app.route("/", methods=["GET"])
    def handle_unguarded():
        pass

    # guarded route

    @rbac_guard(groups=["admin"], roles=["admin_default", "default"],
                permissions=["default_post_permmissions"])
    @app.route("/protected")
    def handle_guarded():
        pass
    ```

    This guard does NOT recursively check the permissions belonging to groups
    or roles, and will only check against the inline permissions that a user has.
    This is done to increase performance. However, it should be noted that this
    means the guard may return false negatives (where a user is actually allowed
    to access a route but they are denied anyway). Some creative caching solutions
    could be formulated to handle this...
    """

    if groups is None:
        groups = ["default"]
    if permissions is None:
        permissions = []
    if roles is None:
        roles = []

    def outer(fn: callable):
        @functools.wraps(fn)
        def inner(*args, **kwargs):
            client_session_cookie = request.cookies.get("session_state")

            session_state = session.get("session_state")

            if session_state is None:
                return jsonify(msg="unauthorized"), 401

            if session_state != client_session_cookie:
                return jsonify(msg="unauthorized"), 401

            auth_header = request.headers.get("Authorization")
            if auth_header is None:
                return jsonify(msg="malformed authorization header"), 403

            parts = auth_header.split(" ")
            if len(parts) != 2:
                return jsonify(msg="malformed authorization header"), 403

            bearer_token = parts[1]

            claims = verify_token(token=bearer_token)
            if claims is None:
                return jsonify(msg="invalid token"), 401

            g.claims = claims

            # valid session + valid cookie

            user_groups = [group["group_name"] for group in claims.access["groups"]]
            user_roles = [role["role_name"] for role in claims.access["roles"]]
            user_permissions = [
                permission["permission_name"]
                for permission in claims.access["permissions"]
            ]

            if not all(group in user_groups for group in groups):
                return jsonify(msg="not enough permissions"), 403
            if not all(role in user_roles for role in roles):
                return jsonify(msg="not enough permissions"), 403
            if not all(permission in user_permissions for permission in permissions):
                return jsonify(msg="not enough permissions"), 403

            result = fn(*args, **kwargs)
            return result

        return inner

    return outer
