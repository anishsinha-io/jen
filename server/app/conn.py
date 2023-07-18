import os
import psycopg
from psycopg.rows import dict_row
from app.log.logger import get_logger


conn_info = {
    "host": os.environ["PG_HOST"],
    "port": os.environ["PG_PORT"],
    "user": os.environ["PG_USER"],
    "password": os.environ["PG_PASSWORD"],
    "dbname": os.environ["PG_DB"],
}


logger = get_logger("ConnectionWrapper")


def with_connection(fn: callable):
    """Open a database connection and automatically close it after an operation
    :param fn: function that performs an operation on the database
    :return: result of the operation
    """

    def wrapper(*args, **kwargs):
        conn = psycopg.connect(**conn_info, row_factory=dict_row)
        try:
            res = fn(conn, *args, **kwargs)
        except Exception as e:
            logger.error(str(e))
            conn.rollback()
            raise
        else:
            conn.commit()
        finally:
            conn.close()
        return res

    return wrapper
