from enum import Enum

from app.util.enum_base import EnumBase


class ReadTime(Enum, metaclass=EnumBase):
    FIVE_MINUTES = 5
    SIX_MINUTES = 6
    SEVEN_MINUTES = 7
    EIGHT_MINUTES = 8
    NINE_MINUTES = 9
    TEN_MINUTES = 10
    ELEVEN_MINUTES = 11
    TWELVE_MINUTES = 12
    THIRTEEN_MINUTES = 13
    FOURTEEN_MINUTES = 14
    FIFTEEN_MINUTES = 15
    SIXTEEN_MINUTES = 16
    SEVENTEEN_MINUTES = 17
    EIGHTEEN_MINUTES = 18
    NINETEEN_MINUTES = 19
    TWENTY_MINUTES = 20

    def get_aesthetic_value(self):
        return "About " + str(self.name).lower().split("_")[0] + "."
