import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { socketClient} from "../main.jsx";
import SOCKET_EVENT from "../enum/SocketEventEnum.jsx";
import GAME_STATE from "../enum/GameStateEnum.jsx";
import SOCKET_STATUS from "../enum/SocketStatusEnum.jsx";

const initialState = {
    selectMainCardStatus: null,
    gameStateFromServer: null,
    //     {
    //     currentPlayerId: "",
    //     currentPlayerTimeout: "",
    //     thisPlayer: {
    //         id: null,
    //         username: null,
    //         cardIds: [],
    //     },
    //     otherPlayer: [{
    //         id: null,
    //         username: null,
    //         cardIds: [],
    //     }],
    //     playersInOrderIds: [],
    //     thisPlayerActions: {
    //         isPlayerTurn: false,
    //         cardsPlayerCanPlay: []
    //     },
    //     gameState: GAME_STATE.NOT_STARTED,
    //     gameRoundState: GAME_STATE.NOT_STARTED,
    //     gameplayState: GAME_STATE.NOT_STARTED,
    //     roundNumber: null,
    //     trickNumber: null,
    //     cardsInField: [],
    //     isFriendAppeared: false,
    //     auctionWinnerTeamIds: null,
    //     anotherTeamIds: [],
    //     success: false,
    // }
    scoreCardIds: null,
    currentPlayerTimeoutId: "",
    currentPlayerTimeout: null,
};

export const EmitToggleReady = createAsyncThunk(
    'emitToggleReady',
    async () => {
    return await socketClient.Emit(SOCKET_EVENT.PLAYER_TOGGLE_READY);
});
export const EmitStartGame = createAsyncThunk(
'emitStartGame',
async (_, {getState, dispatch}) => {
    return await socketClient.Emit(SOCKET_EVENT.START_GAME).then(() => {
        dispatch(EmitGetGameStateFromServer())
    });
});
export const EmitGetGameStateFromServer = createAsyncThunk(
'emitGetGameStateFromServer',
async () => {
    return await socketClient.Emit(SOCKET_EVENT.GET_GAME_STATE);
});
export const EmitGetScoreCard = createAsyncThunk(
'emitGetScoreCard',
async ({playerId}) => {
    return await socketClient.Emit(SOCKET_EVENT.GET_SCORE_CARD, playerId);
});

export const EmitAuction = createAsyncThunk(
'emitAuction',
async ({ auctionPass, auctionPoint}, {getState, dispatch}) => {
    return socketClient.Emit(SOCKET_EVENT.AUCTION, auctionPass, auctionPoint).then(() => {
        dispatch(EmitGetGameStateFromServer())
    });
});
export const EmitSelectMainCard = createAsyncThunk(
'emitSelectMainCard',
async ({ trumpSuit, friendCard}, {getState, dispatch}) => {
    return socketClient.Emit(SOCKET_EVENT.SELECT_MAIN_CARD, trumpSuit, friendCard)
});
export const EmitCardPlayed = createAsyncThunk(
'emitCardPlayed',
async ({ cardId }, {getState, dispatch}) => {
    return socketClient.Emit(SOCKET_EVENT.CARD_PLAYED, cardId).then(() => {
        dispatch(EmitGetGameStateFromServer())
    });
});
export const EmitSendEmoji = createAsyncThunk(
'emitSendEmoji',
async ({ emoji }, {getState, dispatch}) => {
    return socketClient.Emit(SOCKET_EVENT.EMOJI, emoji)
});
export const EmitKickPlayer = createAsyncThunk(
'emitKickPlayer',
async ({ userId }, {getState, dispatch}) => {
    return socketClient.Emit(SOCKET_EVENT.KICK_PLAYER, userId)
});
export const EmitGetTimeout = createAsyncThunk(
'emitEmitGetTimeout',
async ({ userId }, {getState, dispatch}) => {
    return socketClient.Emit(SOCKET_EVENT.GET_TIMEOUT)
});
export const EmitAddBotPlayer = createAsyncThunk(
'emitAddBotPlayer',
async ({ botLevel }, {getState, dispatch}) => {
    return socketClient.Emit(SOCKET_EVENT.ADD_BOT_PLAYER, botLevel).then(a => {
    }).catch(a => {
    })
});

const socketGameEmittersSlice = createSlice({
    name: 'socketGameEmitters',
    initialState,
    reducers: {
        SetGameState: (state, action) => {
            state.gameStateFromServer = action.payload.gameState
            state.currentPlayerTimeoutId = action.payload.gameState.currentPlayerId
            state.currentPlayerTimeout = action.payload.gameState.currentPlayerTimeout
        },
        ResetAllEmitterState: (state, action) => {
            state.selectMainCardStatus = null
            state.gameStateFromServer = null
            state.scoreCardIds = null
        },
        ClearSelectMainCardStatus: (state, action) => {
            state.selectMainCardStatus = null
        },
        SetPlayerTimeout: (state, action) => {
            state.currentPlayerTimeout = action.payload.time
        },
        DecreasePlayerTimeout: (state, action) => {
            state.currentPlayerTimeout = state.currentPlayerTimeout-1
        }
    },
    extraReducers: (builder) => {
        builder.addCase(EmitGetGameStateFromServer.fulfilled, (state,action) => {
            console.log("timer: " + action.payload.currentPlayerTimeout)
            state.gameStateFromServer = action.payload
            state.currentPlayerTimeoutId = action.payload.currentPlayerId
            state.currentPlayerTimeout = action.payload.currentPlayerTimeout
        });
        builder.addCase(EmitGetScoreCard.fulfilled, (state,action) => {
            state.scoreCardIds = action.payload
        });
        builder.addCase(EmitSelectMainCard.pending, (state,action) => {
            state.selectMainCardStatus = SOCKET_STATUS.PENDING
        });
        builder.addCase(EmitSelectMainCard.fulfilled, (state,action) => {
            state.selectMainCardStatus = SOCKET_STATUS.SUCCESS
        });
        builder.addCase(EmitSelectMainCard.rejected, (state,action) => {
            state.selectMainCardStatus = SOCKET_STATUS.FAILED
        });
        builder.addCase(EmitGetTimeout.fulfilled, (state,action) => {
            state.currentPlayerTimeoutId = action.payload.playerId
            state.currentPlayerTimeout = action.payload.timer
            console.log("Emit timeout: " + action.payload.timer)
        });
    },
});
export const {
    ClearSelectMainCardStatus,
    ResetAllEmitterState,
    SetGameState,
    SetPlayerTimeout,
    DecreasePlayerTimeout,
} = socketGameEmittersSlice.actions
export default socketGameEmittersSlice.reducer;