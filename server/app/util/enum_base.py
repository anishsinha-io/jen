from enum import EnumMeta


class EnumBase(EnumMeta):
    """Useful metaclass that allows using the 'in' operator to check for membership"""

    def __contains__(self, other):
        try:
            self(other)
        except ValueError:
            return False
        else:
            return True
