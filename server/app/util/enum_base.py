from enum import EnumMeta


class EnumBase(EnumMeta):
    def __contains__(self, other):
        try:
            self(other)
        except ValueError:
            return False
        else:
            return True
