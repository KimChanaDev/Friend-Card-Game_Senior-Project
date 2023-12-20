const SocketEventEnum = {
    PLAYER_CONNECTED: 'player_connected',
    PLAYER_DISCONNECTED: 'player_disconnected',
    PLAYERS_IN_GAME: 'players_in_game',
    PLAYER_TOGGLE_READY: 'player_toggle_ready',
    START_GAME: 'start_game',
    GET_GAME_STATE: 'get_game_state',
    CARD_PLAYED: 'card_played',
    GAME_FINISHED: 'game_finished',
    AUCTION: 'auction',
    SELECT_MAIN_CARD: 'select_main_card',
    TRICK_FINISHED: 'trick_finished',
    ROUND_FINISHED: 'round_finished'
}
export default SocketEventEnum