from dataclasses import dataclass, field

from app.dto import Dto


@dataclass
class GetPostDto(Dto):
    """Information needed to fetch a single post by id"""

    post_id: str


@dataclass
class CreatePostDto(Dto):
    """Information needed to create a post"""

    user_id: str
    title: str
    content: str
    read_time: int
    tag_ids: list[str]


@dataclass
class GetPostsDto(Dto):
    """Search, filter, and paginate posts"""

    user_id: str
    max_read_time: int
    min_read_time: int
    tag_ids: list[str] = field(default_factory=lambda: [])
    paginate: int = 20
    offset: int = 0


@dataclass
class DeletePostsDto(Dto):
    """Delete a post by id"""

    post_id: str
