from dataclasses import dataclass, astuple


@dataclass
class Dto:
    """Base class for data transfer objects"""

    def __iter__(self):
        return iter(astuple(self))

    def __getitem__(self, keys):
        return iter(getattr(self, k) for k in keys)

    def __str__(self):
        return str(self.dict())

    def dict(self):
        return vars(self)
