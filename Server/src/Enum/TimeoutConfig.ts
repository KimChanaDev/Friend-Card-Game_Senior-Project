export enum FRIEND_TIMEOUT_CONFIG
{
    // CONFIG ASSOCIATE WITH FRONTEND
    AUCTION_IN_SEC = 10,
    // AUCTION_IN_SEC = 999,
    SELECT_MAIN_CARD_IN_SEC = 30,
    // SELECT_MAIN_CARD_IN_SEC = 999,
    PLAY_CARD_IN_SEC = 30,
    // PLAY_CARD_IN_SEC = 999,

    // CONFIG ASSOCIATE WITH FRONTEND
    TRICK_FINISHED_POPUP_IN_SEC = 5,
    FRIEND_APPEAR_POPUP_IN_SEC = 2,
    ROUND_FINISHED_POPUP_IN_SEC = 10,

    PLAY_CARD_WITH_TRICK_FINISH_POPUP_IN_SEC = PLAY_CARD_IN_SEC + TRICK_FINISHED_POPUP_IN_SEC,
    PLAY_CARD_WITH_ONLY_FRIEND_APPEAR_POPUP_IN_SEC = PLAY_CARD_IN_SEC + FRIEND_APPEAR_POPUP_IN_SEC,
    AUCTION_WITH_ROUND_FINISH_IN_SEC = AUCTION_IN_SEC + ROUND_FINISHED_POPUP_IN_SEC
}