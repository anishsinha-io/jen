from dataclasses import dataclass

from app.dto import Dto


@dataclass
class GetUser(Dto):
    """Get a user by id"""

    user_id: str


@dataclass
class GetUserByEmail(Dto):
    """Get a user by email"""

    email: str


@dataclass
class GetUserAccess(Dto):
    """Get a user's role-based access permissions"""

    user_id: str

    # turn these on for more granularity if necessary
    include_groups: bool = True
    include_roles: bool = False
    include_permissions: bool = False
