from flask import Blueprint, request, Response, jsonify, g

from app.auth.guards import rbac_guard
from app.log.logger import get_logger
from app.posts.dto import CreatePostDto

from .repo import get_all_posts, create_post

module = Blueprint("posts", __name__, url_prefix="/posts")

logger = get_logger("PostsController")


@module.route("/", methods=["GET", "POST"])
@rbac_guard()
def handle_posts() -> tuple[Response, int]:
    """Handle top level post endpoints

    On GET, fetch all posts. On POST, create a new post
    """

    if request.method == "GET":
        body = request.json
        if body is None or body.get("data") is None:
            return jsonify(msg="bad request"), 400

        posts = get_all_posts()
        return jsonify(posts=posts), 200
    if request.method == "POST":
        claims = g.claims
        if claims is None:
            return jsonify(msg="internal server error"), 500

        user_id = claims.user_id

        body = request.json

        if body is None or body.get("data") is None:
            return jsonify(msg="bad request"), 400

        dto = CreatePostDto(**body, user_id=user_id)

        if not create_post(conn=None, dto=dto):
            logger.error("create post")
            return jsonify(msg="internal server error"), 500

        return jsonify(msg="successfully created post"), 201

    return jsonify(msg="internal server error"), 500
