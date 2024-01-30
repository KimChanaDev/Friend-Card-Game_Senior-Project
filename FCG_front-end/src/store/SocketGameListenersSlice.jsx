import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { socketClient} from "../main.jsx";
import SOCKET_EVENT from "../enum/SocketEventEnum.jsx";
import SOCKET_STATUS from "../enum/SocketStatusEnum.jsx";
import {EmitGetGameStateFromServer, SetGameState} from "./SocketGameEmittersSlice.jsx";
import {AddPlayersInGame, RemovePlayersInGame, SetNewHostRoom, SetPlayersInGame, TogglePlayer} from "./GameSlice.jsx";

export const PlayerToggleReady = createAsyncThunk(
    'toggleReady',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SOCKET_EVENT.PLAYER_TOGGLE_READY, (player) =>{
            dispatch(TogglePlayer({ player }))
        });
    }
);
export const StartGame = createAsyncThunk(
    'startGame',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SOCKET_EVENT.START_GAME, () => {
            socketClient.Emit(SOCKET_EVENT.GET_GAME_STATE).then(response => {
                dispatch(SetGameState({ gameState: response }))
            })
            dispatch({ type: 'socketGameListener/StartGame', payload: { isGameStarted: true } })
        });
    }
);

export const PlayerConnected = createAsyncThunk(
    'playerConnected',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SOCKET_EVENT.PLAYER_CONNECTED, (player) => {
            dispatch(AddPlayersInGame({player}))
        });
    }
);
export const PlayerInGame = createAsyncThunk(
    'playerInGame',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SOCKET_EVENT.PLAYERS_IN_GAME, (result) => {
            dispatch(SetPlayersInGame(result))
        });
    }
);
export const PlayerDisconnected = createAsyncThunk(
    'playerDisconnected',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SOCKET_EVENT.PLAYER_DISCONNECTED, (player) =>{
            dispatch(RemovePlayersInGame({player : player.disconnectPlayer}))
            if(player.newHostPlayer){
                dispatch(SetNewHostRoom({player: player.newHostPlayer}))
            }
        });
    }
);
export const Auction = createAsyncThunk(
    'auction',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SOCKET_EVENT.AUCTION, (result) => {
            dispatch({ type: 'socketGameListener/Auction', payload: { result: result } })
            dispatch(EmitGetGameStateFromServer())
        });
    }
);
export const SelectMainCard = createAsyncThunk(
    'selectMainCard',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SOCKET_EVENT.SELECT_MAIN_CARD, (mainCard) => {
            dispatch({ type: 'socketGameListener/SelectMainCard', payload: { mainCard: mainCard } })
            dispatch(EmitGetGameStateFromServer())
        }
    );
    }
);
export const CardPlayed = createAsyncThunk(
    'cardPlayed',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SOCKET_EVENT.CARD_PLAYED, (cardPlayDetail) => {
            dispatch({ type: 'socketGameListener/CardPlayed', payload: { cardPlayDetail: cardPlayDetail } })
            dispatch(EmitGetGameStateFromServer())
        });
    }
);
export const TrickFinished = createAsyncThunk(
    'trickFinished',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SOCKET_EVENT.TRICK_FINISHED, (result) => {
            dispatch({ type: 'socketGameListener/TrickFinished', payload: { result: result } })
        });
    }
);
export const RoundFinished = createAsyncThunk(
    'roundFinished',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SOCKET_EVENT.ROUND_FINISHED, (result) =>{
            dispatch({ type: 'socketGameListener/RoundFinished', payload: { result: result } })
        });
    }
);
export const GameFinished = createAsyncThunk(
    'gameFinished',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SOCKET_EVENT.GAME_FINISHED, (result) =>{
            dispatch({ type: 'socketGameListener/GameFinished', payload: { result: result } })
        });
    }
);
export const EmojiReceived = createAsyncThunk(
    'emojiReceived',
    async function (_, { getState, dispatch }) {
        return await socketClient.On(SOCKET_EVENT.EMOJI, (result) =>{
            dispatch({ type: 'socketGameListener/Emoji', payload: { result: result } })
        });
    }
);

const initialState = {
    /// startGame
    isGameStarted: false,

    /// playerInGame
    playerInGameListenerResponseStatus: '',

    emojiDetail: null, // { playerId, emoji }

    /// Auction
    playersAuctionDetail: [], //playerId, isPass, actionPoint
    highestAuctionPlayerId: null,
    highestAuctionPoint: null,

    /// Trump and Friend
    winnerAuctionId: null,
    trumpSuit: null,
    friendCard: null,

    /// CardPlayed
    currentCardPlayedResult: null,  /// {playerId, cardId}
    cardsInField: [],

    trickFinishedResult: null,
    // trickFinishedResult: {
    //     winnerId: "",
    //     winnerCardId: "",
    //     winnerReceivePoint: 0,
    //     trickNumber: 0,
    //     playersPoint: [{
    //         playerId: "",
    //         playerName: "",
    //         point: 0
    //     }]
    // },

    roundFinishedResult: null,
    // [{
    //     winnerPlayerIds: ["",""],
    //     winnerTotalPointInRound: 0,
    //     roundNumber: 0,
    //     playersPoint: [{
    //         playerId: "",
    //         playerName: "",
    //         cardsPointReceive: 0,
    //         gamePointReceive: 0,
    //     }]
    // }]

    gameFinishedResult: null,
    // {
    //     winnerId: string;
    //     winnerName: string;
    //     winnerPoint: number;
    //     roundsFinishedDetail: []  //same as roundFinishedResult
    // }


};

const socketGameListenerSlice = createSlice({
    name: 'socketGameListener',
    initialState,
    reducers: {
        ResetAllListenerState: (state) => {
            state.isGameStarted = false
            state.emojiDetail = null
            state.playersAuctionDetail = []
            state.highestAuctionPlayerId = null
            state.highestAuctionPoint = null
            state.winnerAuctionId = null
            state.trumpSuit = null
            state.friendCard = null
            state.currentCardPlayedResult = null
            state.cardsInField = []
            state.trickFinishedResult = null
            state.roundFinishedResult = null
            state.gameFinishedResult = null
            state.playerInGameListenerResponseStatus = ''
        },
        ClearStateForNextRound: (state) => {
            state.playersAuctionDetail = [];
            state.highestAuctionPlayerId = null;
            state.highestAuctionPoint = null;

            state.winnerAuctionId = null;
            state.trumpSuit = null;
            state.friendCard = null;

            state.currentCardPlayedResult = null;
            state.cardsInField = [];

            state.trickFinishedResult = null;
            state.roundFinishedResult = null;
        },
        StartGame: (state, action) => { state.isGameStarted = action.payload.isGameStarted },
        Auction: (state, action) => {
            const {playerId, isPass, auctionPoint, highestAuctionPlayerId, highestAuctionPoint} = action.payload.result
            if (state.playersAuctionDetail.some(player => player.playerId === playerId)){
                state.playersAuctionDetail = state.playersAuctionDetail.map(player => {
                    return player.playerId === playerId ? {...player, isPass,  auctionPoint} : player
                })
            }
            else{
                state.playersAuctionDetail = [...state.playersAuctionDetail, { playerId, isPass, auctionPoint }]
            }
            state.highestAuctionPlayerId = highestAuctionPlayerId
            state.highestAuctionPoint = highestAuctionPoint
        },
        SelectMainCard: (state, action) => {
            const { playerId, trumpColor, friendCard} = action.payload.mainCard
            state.winnerAuctionId = playerId
            state.trumpSuit = trumpColor
            state.friendCard = friendCard
        },
        CardPlayed: (state, action) => {
            state.currentCardPlayedResult = action.payload.cardPlayDetail
            if (state.cardsInField.length < 4) {
                state.cardsInField = [...state.cardsInField, action.payload.cardPlayDetail.cardId]
            }
            else{
                state.cardsInField = [action.payload.cardPlayDetail.cardId]
            }
        },
        TrickFinished: (state, action) => {
            state.trickFinishedResult = action.payload.result
        },
        RoundFinished: (state, action) => {
            state.roundFinishedResult = action.payload.result
        },
        GameFinished: (state, action) => {
            state.gameFinishedResult = action.payload.result
        },
        Emoji: (state, action) => {
            state.emojiDetail = action.payload.result
        },
        ClearCardInField: (state, action) => { state.cardsInField = [] },
        ClearEmojiDetail: (state, action) => {
            state.emojiDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(PlayerInGame.pending, (state) => {
            state.playerInGameListenerResponseStatus = SOCKET_STATUS.PENDING;
        });
        builder.addCase(PlayerInGame.fulfilled, (state) => {
            state.playerInGameListenerResponseStatus = SOCKET_STATUS.SUCCESS;
        });
        builder.addCase(PlayerInGame.rejected, (state) => {
            state.playerInGameListenerResponseStatus = SOCKET_STATUS.FAILED;
        });
    },
});
export const {
    ResetAllListenerState,
    ClearCardInField,
    ClearStateForNextRound,
    ClearEmojiDetail,
} = socketGameListenerSlice.actions
export default socketGameListenerSlice.reducer;