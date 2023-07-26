from dataclasses import dataclass

from app.auth.algorithms import HashAlgorithm
from app.dto import Dto


@dataclass
class CreateUser(Dto):
    """Data transfer object to create a user"""

    first_name: str
    last_name: str
    email: str
    username: str
    image_uri: str
    secret_data: str | None = None
    algorithm: HashAlgorithm = HashAlgorithm("argon2")
    add_to_default_group: bool = True
