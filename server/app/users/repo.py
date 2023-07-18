from psycopg import Connection
from psycopg.rows import DictRow

from app.conn import with_connection


@with_connection
def create_user(conn: Connection[DictRow], dto) -> None:
    query = """--sql
            insert into blog.users (first_name, last_name, email, username) 
            values (%(first_name)s, %(last_name)s, %(email)s, %(username)s)
            returning id 
            """

    with conn.cursor() as cursor:
        user = cursor.execute(
            query,
            {
                "first_name": dto.first_name,
                "last_name": dto.last_name,
                "email": dto.email,
                "username": dto.username,
            },
        ).fetchone()

        user_id = user["id"]

        if user is not None and dto.add_to_default_group:
            query = """--sql
                    insert into blog.user_group_mappings (group_id, user_id) 
                    values ((select id from blog.groups where group_name='default'), %(user_id)s)
                    """
            cursor.execute(query, {"user_id": user_id})

        if user is not None and dto.secret_data is not None:
            query = """--sql
                    insert into blog.user_credentials (user_id, secret_data, algorithm)
                    values (%(user_id)s, %(secret_data)s, %(algorithm)s)
                    """
            cursor.execute(
                query,
                {
                    "user_id": user_id,
                    "secret_data": dto.secret_data,
                    "algorithm": str(dto.algorithm),
                },
            )
