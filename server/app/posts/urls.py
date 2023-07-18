from flask import Blueprint

from app.auth.guards import rbac_guard

module = Blueprint("posts", __name__, url_prefix="/posts")


@module.route("/")
@rbac_guard(groups=["admin"])
def handle_posts():
    pass
