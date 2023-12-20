import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { socketClient} from "../main.jsx";
import SocketEventEnum from "../enum/SocketEventEnum.jsx";
import SocketStatusEnum from "../enum/SocketStatusEnum.jsx";
import {ConnectToSocket, DisconnectFromSocket} from "./SocketSlice.jsx";

export const PlayerToggleReady = createAsyncThunk(
    'toggleReady',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SocketEventEnum.PLAYER_TOGGLE_READY, (player) =>
            dispatch({ type: 'socketGameListener/PlayerToggleReady', payload: { player: player } })
        );
    }
);
export const StartGame = createAsyncThunk(
    'startGame',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SocketEventEnum.START_GAME, () =>
            dispatch({ type: 'socketGameListener/StartGame', payload: { isGameStarted: true } })
        );
    }
);
export const PlayerConnected = createAsyncThunk(
    'playerConnected',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SocketEventEnum.PLAYER_CONNECTED, (player) => {
                console.log("player_connected receive")
            dispatch({ type: 'socketGameListener/PlayerConnected', payload: { player: player } })
        }
        );
    }
);
export const PlayerInGame = createAsyncThunk(
    'playerInGame',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SocketEventEnum.PLAYERS_IN_GAME, (players) => {
            console.log("player_in_game_event receive")
            dispatch({ type: 'socketGameListener/PlayerInGame', payload: { players: players } })
        }
    );
    }
);
export const PlayerDisconnected = createAsyncThunk(
    'playerDisconnected',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SocketEventEnum.PLAYER_DISCONNECTED, (player) =>
            dispatch({ type: 'socketGameListener/PlayerDisconnected', payload: { player: player } })
        );
    }
);
export const Auction = createAsyncThunk(
    'auction',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SocketEventEnum.AUCTION, (result) =>
            dispatch({ type: 'socketGameListener/Auction', payload: { result: result } })
        );
    }
);
export const SelectMainCard = createAsyncThunk(
    'selectMainCard',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SocketEventEnum.SELECT_MAIN_CARD, (result) =>
            dispatch({ type: 'socketGameListener/SelectMainCard', payload: { result: result } })
        );
    }
);
export const CardPlayed = createAsyncThunk(
    'cardPlayed',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SocketEventEnum.CARD_PLAYED, (result) =>
            dispatch({ type: 'socketGameListener/CardPlayed', payload: { result: result } })
        );
    }
);
export const TrickFinished = createAsyncThunk(
    'trickFinished',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SocketEventEnum.TRICK_FINISHED, (result) =>
            dispatch({ type: 'socketGameListener/TrickFinished', payload: { result: result } })
        );
    }
);
export const RoundFinished = createAsyncThunk(
    'roundFinished',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SocketEventEnum.ROUND_FINISHED, (result) =>
            dispatch({ type: 'socketGameListener/RoundFinished', payload: { result: result } })
        );
    }
);

const initialState = {
    playerToggleReady: null,
    isGameStarted: false,
    newPlayerConnected: null,
    playerBeforeJoinRoom: null,
    playerDisconnected: null,
    actionResult: null,
    selectMainCardResult: null,
    cardPlayedResult: null,
    trickFinishedResult: null,
    roundFinishedResult: null,

    playerConnectedStatus: null
};

const socketGameListenerSlice = createSlice({
    name: 'socketGameListener',
    initialState,
    reducers: {
        ResetAllListenerState: (state) => {
            state.playerToggleReady = null
            state.isGameStarted = false
            state.newPlayerConnected = null
            state.playerBeforeJoinRoom = null
            state.playerDisconnected = null
            state.actionResult = null
            state.selectMainCardResult = null
            state.cardPlayedResult = null
            state.trickFinishedResult = null
            state.roundFinishedResult = null

            state.playerConnectedStatus = null
        },
        PlayerToggleReady: (state, action) => { state.playerToggleReady = action.payload.player },
        StartGame: (state, action) => { state.isGameStarted = action.payload.isGameStarted },
        PlayerConnected: (state, action) => { state.newPlayerConnected = action.payload.player },
        PlayerInGame: (state, action) => { state.playerBeforeJoinRoom = action.payload.players },
        PlayerDisconnected: (state, action) => { state.playerDisconnected = action.payload.player },
        Auction: (state, action) => { state.actionResult = action.payload.result },
        SelectMainCard: (state, action) => { state.selectMainCardResult = action.payload.result },
        CardPlayed: (state, action) => { state.cardPlayedResult = action.payload.result },
        TrickFinished: (state, action) => { state.trickFinishedResult = action.payload.result },
        RoundFinished: (state, action) => { state.roundFinishedResult = action.payload.result },
    },
    extraReducers: (builder) => {
        builder.addCase(PlayerConnected.pending, (state) => {
            state.playerConnectedStatus = SocketStatusEnum.PENDING;
        });
        builder.addCase(PlayerConnected.fulfilled, (state) => {
            state.playerConnectedStatus = SocketStatusEnum.SUCCESS;
        });
        builder.addCase(PlayerConnected.rejected, (state) => {
            state.playerConnectedStatus = SocketStatusEnum.FAILED;
        });
    },
});
export const {
    ResetAllListenerState,
} = socketGameListenerSlice.actions
export default socketGameListenerSlice.reducer;