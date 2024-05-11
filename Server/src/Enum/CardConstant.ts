export const Shapes = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
export const Colors = ['C', 'D', 'H', 'S'] as const;
export type ShapeType = typeof Shapes[number];
export type ColorType = typeof Colors[number];
export type CardId = `${typeof Shapes[number]}${typeof Colors[number]}`;
export const CARD_AI_FORMAT: Record<string, string> = {
    0: "2H",
    1: "3H",
    2: "4H",
    3: "5H",
    4: "6H",
    5: "7H",
    6: "8H",
    7: "9H",
    8: "TH",
    9: "JH",
    10: "QH",
    11: "KH",
    12: "AH",

    13: "2D",
    14: "3D",
    15: "4D",
    16: "5D",
    17: "6D",
    18: "7D",
    19: "8D",
    20: "9D",
    21: "TD",
    22: "JD",
    23: "QD",
    24: "KD",
    25: "AD",

    26: "2C",
    27: "3C",
    28: "4C",
    29: "5C",
    30: "6C",
    31: "7C",
    32: "8C",
    33: "9C",
    34: "TC",
    35: "JC",
    36: "QC",
    37: "KC",
    38: "AC",

    39: "2S",
    40: "3S",
    41: "4S",
    42: "5S",
    43: "6S",
    44: "7S",
    45: "8S",
    46: "9S",
    47: "TS",
    48: "JS",
    49: "QS",
    50: "KS",
    51: "AS",
}
export const TRUMP_SUIT_AI_FORMAT: Record<string, string> = {
    "Hearts": "H",
    "Diamonds": "D",
    "Clubs": "C",
    "Spades": "S"
}