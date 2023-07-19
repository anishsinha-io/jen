from dataclasses import dataclass, field

from app.dto import Dto


@dataclass
class GetPostDto(Dto):
    post_id: str


@dataclass
class GetPostsDto(Dto):
    user_id: str
    max_read_time: int
    min_read_time: int
    tag_ids: list[str] = field(default_factory=lambda: [])
    paginate: int = 20

