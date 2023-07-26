from dataclasses import dataclass
from datetime import datetime

from app.entity import Entity


@dataclass
class Post(Entity):
    """A post object from the database"""

    id: str
    user_id: str
    title: str
    content: str
    read_time: str
    tags: list[str]
    created_at: datetime
    updated_at: datetime
