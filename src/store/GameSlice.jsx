import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    joinRoomDetail: null,
    playersInGame: null,
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
        AddPlayersInGame: (state, action) => {
            const { player } = action.payload
            state.playersInGame = {
                ...state.playersInGame,
                players:[...state.playersInGame.players, player]
            }
        },
        RemovePlayersInGame: (state, action) => {
            const { player } = action.payload
            state.playersInGame = {
                players: state.playersInGame.players.filter(p => p.id !== player.id),
                thisPlayer: state.playersInGame.thisPlayer,
            }
        },
        ResetPlayersInGame: (state) => {
            state.playersInGame = null
        },
        TogglePlayer: (state, action) => {
            if(state.playersInGame){
                const  { player } = action.payload
                let newThisPlayer
                if(player.id === state.playersInGame.thisPlayer.id){
                    newThisPlayer = {...state.playersInGame.thisPlayer}
                    newThisPlayer.isReady = player.isReady
                }else{
                    newThisPlayer = state.playersInGame.thisPlayer
                }
                state.playersInGame = {
                    players: state.playersInGame.players.filter(p => {
                        if (p.id === player.id) {
                            p.isReady = player.isReady
                        }
                        return true
                    }),
                    thisPlayer: newThisPlayer,
                };
            }
        },
        SetNewHostRoom: (state, action) => {
            if(state.playersInGame){
                const  { player } = action.payload
                let newThisPlayer
                if(player.id === state.playersInGame.thisPlayer.id){
                    newThisPlayer = {...state.playersInGame.thisPlayer}
                    newThisPlayer.isOwner = player.isOwner
                    newThisPlayer.isReady = player.isReady
                }else{
                    newThisPlayer = state.playersInGame.thisPlayer
                }
                state.playersInGame = {
                    players: state.playersInGame.players.filter(p => {
                        if (p.id === player.id) {
                            p.isOwner = player.isOwner
                            p.isReady = player.isReady
                        }
                        return true
                    }),
                    thisPlayer: newThisPlayer,
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
    AddPlayersInGame,
    RemovePlayersInGame,
    SetNewHostRoom,
} = gameSlice.actions
export default gameSlice.reducer