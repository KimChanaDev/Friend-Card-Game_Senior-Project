import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    gameState: 0,
    joinRoomDetail: null,
    playersInGame: null,
    cardInHand: null
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        SetJoinRoomDetail: (state, action) => {
            state.joinRoomDetail = action.payload
        },
        SetPlayersInGame: (state, action) => {
            state.playersInGame = action.payload
        },
        ResetPlayersInGame: (state) => {
            state.playersInGame = null
        },
        SetCardInHand: (state, action) => {
            state.cardInHand = action.payload
        },
        TogglePlayer: (state, action) => {
            if(state.playersInGame){
                const  { player } = action.payload
                state.playersInGame = {
                    players: state.playersInGame.players.filter(p => {
                        if (p.id === player.id) {
                            p.isReady = player.isReady
                        }
                        return true
                    }),
                    thisPlayer: state.playersInGame.thisPlayer,
                };
            }
        }
    }
})
export const {
    SetJoinRoomDetail,
    SetPlayersInGame,
    TogglePlayer,
    ResetPlayersInGame,
} = gameSlice.actions
export default gameSlice.reducer