from psycopg import Connection
from psycopg.rows import DictRow

from app.conn import with_connection

from .entity import Post


@with_connection
def create_post(conn: Connection[DictRow], dto) -> None:
    query = """
            insert into blog.posts (user_id, title, content, read_time) values 
            (%(user_id)s, %(title)s, %(content)s, %(read_time)s) returning id
            """

    with conn.cursor() as cursor:
        post = cursor.execute(query,
                              {"user_id": dto.user_id, "title": dto.title, "content": dto.content,
                               "read_time": dto.read_time}).fetchone()

        query = """
                insert into blog.post_tags (post_id, tag_id) values (%(post_id)s, %(tag_id)s)
                """

        for tag_id in dto.tag_ids:
            cursor.execute(query, {"post_id": post["id"], tag_id: tag_id})


@with_connection
def get_posts(conn: Connection[DictRow], dto) -> list[Post]:
    query = """
            select id, user_id, title, content, read_time, created_at, updated_at, 
            (select tag_id from blog.post_tags where post_id=%(post_id)s) as tags from 
            blog.posts limit %(paginate)s
            """

    with conn.cursor() as cursor:
        posts = cursor.execute(query, {"post_id": dto.ids, "paginate": dto.paginate})

        return [Post(**post) for post in posts]


@with_connection
def get_post(conn: Connection[DictRow], dto) -> Post:
    query = """select id, user_id, title, content, read_time, created_at, updated_at,
            (select tag_id from blog.post_tags where post_id=%(post_id)s) as tags from 
            blog.posts where id=%(post_id)s
            """

    with conn.cursor() as cursor:
        post = cursor.execute(query, {"post_id": dto.post_id}).fetchone()
        return Post(**post)


@with_connection
def edit_post(conn: Connection[DictRow], dto) -> None:
    pass


@with_connection
def delete_post(conn: Connection[DictRow], dto) -> None:
    pass
