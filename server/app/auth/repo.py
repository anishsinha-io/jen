from psycopg import Connection
from psycopg.rows import DictRow

from app.conn import with_connection

from .dto import GetUser, GetUserByEmail, GetUserAccess
from .entity import UserWithCredentialData, Access


@with_connection
def get_user(conn: Connection[DictRow], dto: GetUser) -> UserWithCredentialData | None:
    query = """
            select blog.users.id, first_name, last_name, email, username, blog.users.created_at,
            blog.users.updated_at, user_credentials.algorithm, user_credentials.secret_data from 
            blog.users left join blog.user_credentials on blog.users.id=blog.user_credentials.user_id 
            and blog.users.id=%(user_id)s
            """
    with conn.cursor() as cursor:
        user = cursor.execute(query, {"user_id": dto.user_id}).fetchone()
        if user is None:
            return user
        return UserWithCredentialData(**user)


@with_connection
def get_user_by_email(conn: Connection[DictRow], dto: GetUserByEmail) -> UserWithCredentialData | None:
    query = """
            select blog.users.id, first_name, last_name, email, username, blog.users.created_at,
            blog.users.updated_at, user_credentials.algorithm, user_credentials.secret_data from 
            blog.users left join blog.user_credentials on blog.users.id=blog.user_credentials.user_id 
            and blog.users.email=%(email)s
            """
    with conn.cursor() as cursor:
        user = cursor.execute(query, {"email": dto.email}).fetchone()
        if user is None:
            return user
        return UserWithCredentialData(**user)


@with_connection
def get_user_access(conn: Connection[DictRow], dto: GetUserAccess) -> Access:
    with conn.cursor() as cursor:
        query = """--sql
                select coalesce((select json_agg(user_groups) from 
                    (select id, group_name from blog.groups where 
                        id=(select group_id from blog.user_group_mappings where 
                        user_id=%(user_id)s)) 
                    user_groups), '[]'::json) as groups
                """

        groups = cursor.execute(query, {"user_id": dto.user_id}).fetchone()

        # get user roles
        query = """--sql
                select coalesce((select json_agg(user_roles) from 
                    (select id, role_name from blog.roles where 
                        id=(select role_id from blog.user_role_mappings where 
                        user_id=%(user_id)s)) 
                    user_roles), '[]'::json) as roles
                """

        roles = cursor.execute(query, {"user_id": dto.user_id}).fetchone()

        # get user inline permissions
        query = """--sql
                select coalesce((select json_agg(user_permissions) from 
                    (select id, permission_name from blog.permissions where 
                        id=(select permission_id from blog.user_permission_mappings where 
                        user_id=%(user_id)s)) 
                    user_permissions), '[]'::json) as permissions
                """
        permissions = cursor.execute(query, {"user_id": dto.user_id}).fetchone()

        return Access(
            groups=groups["groups"],
            roles=roles["roles"],
            permissions=permissions["permissions"],
        )
