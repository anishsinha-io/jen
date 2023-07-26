from psycopg import Connection, sql
from psycopg.rows import DictRow

from app.conn import with_connection
from app.posts.dto import CreatePostDto, DeletePostsDto, GetPostsDto

from .entity import Post


@with_connection
def create_post(
    conn: Connection[DictRow] | None, dto: CreatePostDto | None = None
) -> bool:
    if conn is None or dto is None:
        return False
    query = """
            insert into blog.posts (user_id, title, content, read_time) values 
            (%(user_id)s, %(title)s, %(content)s, %(read_time)s) returning id
            """

    with conn.cursor() as cursor:
        post = cursor.execute(
            query,
            {
                "user_id": dto.user_id,
                "title": dto.title,
                "content": dto.content,
                "read_time": dto.read_time,
            },
        ).fetchone()

        if post is None:
            return False

        query = """
                insert into blog.post_tags (post_id, tag_id) values (%(post_id)s, 
                %(tag_id)s)
                """

        for tag_id in dto.tag_ids:
            cursor.execute(query, {"post_id": post["id"], tag_id: tag_id})
    return True


@with_connection
def get_posts(
    conn: Connection[DictRow] | None = None, dto: GetPostsDto | None = None
) -> list[Post]:
    if conn is None or dto is None:
        return []

    read_time_col = sql.Identifier("read_time")

    min_read_time_query = (
        sql.SQL("{}>=%(min_read_time)s").format(
            read_time_col, {"min_read_time": dto.min_read_time}
        )
        if dto.min_read_time
        else 1
    )

    max_read_time_query = (
        sql.SQL("{}<=%(max_read_time)s").format(
            read_time_col, {"max_read_time": dto.max_read_time}
        )
        if dto.max_read_time
        else 1
    )

    tags_query = (
        sql.SQL("and tags in {tag_ids}").format(tag_ids=dto.tag_ids)
        if dto.tag_ids
        else 1
    )

    query = sql.SQL(
        """select id, user_id, title, content, read_time, created_at, updated_at, 
            (select tag_id from blog.post_tags where blog.post_tags.tag_id=
            blog.post_tags.post_id) as tags from blog.posts where {min_read_time_stmt} 
            and {max_read_time_stmt} limit %(paginate)s offset %(offset)s and 
            {tags_stmt}            """
    ).format(
        min_read_time_stmt=min_read_time_query,
        max_read_time_stmt=max_read_time_query,
        tags_stmt=tags_query,
    )

    with conn.cursor() as cursor:
        posts = cursor.execute(
            query, {"paginate": dto.paginate, "offset": dto.offset}
        ).fetchall()
        if len(posts) == 0:
            return []
        return [Post(**post) for post in posts]


@with_connection
def get_all_posts(conn: Connection[DictRow] | None = None) -> list[Post]:
    if conn is None:
        return []

    query = """select id, user_id, title, content, read_time, image_uri,
               created_at, updated_at, (select tag_id from blog.post_tags 
               where post_id=%(post_id)s) as tags from blog.posts
            """

    with conn.cursor() as cursor:
        posts = cursor.execute(query).fetchall()
        if len(posts) == 0:
            return []

        return [Post(**post) for post in posts]


@with_connection
def get_post(conn: Connection[DictRow], dto) -> Post | None:
    query = """select id, user_id, title, content, read_time, created_at, updated_at,
            (select tag_id from blog.post_tags where post_id=%(post_id)s) as tags from 
            blog.posts where id=%(post_id)s
            """

    with conn.cursor() as cursor:
        post = cursor.execute(query, {"post_id": dto.post_id}).fetchone()
        if post is None:
            return None
        return Post(**post)


@with_connection
def edit_post(conn: Connection[DictRow], dto) -> None:
    pass


@with_connection
def delete_post(conn: Connection[DictRow], dto: DeletePostsDto) -> None:
    query = """delete from posts where id=%(id)s"""

    with conn.cursor() as cursor:
        cursor.execute(query, {"id": dto.post_id})
