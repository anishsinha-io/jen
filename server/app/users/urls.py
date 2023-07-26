import os

from flask import Blueprint, Response, jsonify, request

from app.auth.algorithms import HashAlgorithm, hash_argon2, hash_bcrypt

from .dto import CreateUser
from .repo import create_user

module = Blueprint("users", __name__, url_prefix="/users")


@module.route("/", methods=["POST"])
def handle_users() -> tuple[Response, int]:
    """Function that handles fetching users"""

    body = request.json
    if body is None:
        return jsonify(msg="invalid request body"), 400

    dto = CreateUser(**body)

    if body.get("secret_data"):
        alg = (
            os.environ["HASH_ALG"]
            if os.environ.get("HASH_ALG")
            else HashAlgorithm.ARGON2
        )

        secret_data = None
        if alg == HashAlgorithm.ARGON2:
            secret_data = hash_argon2(body["secret_data"])
        else:
            secret_data = hash_bcrypt(body["secret_data"])

        dto.secret_data = secret_data
        dto.algorithm = HashAlgorithm(alg)

    create_user(dto=dto)
    return jsonify(msg="successfully created user"), 201
