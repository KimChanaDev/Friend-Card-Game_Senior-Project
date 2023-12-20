import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { socketClient} from "../main.jsx";
import SocketEventEnum from "../enum/SocketEventEnum.jsx";

const initialState = {
    gameStateFromServer: null
};

export const EmitToggleReady = createAsyncThunk(
    'emitToggleReady',
    async () => {
    return await socketClient.Emit(SocketEventEnum.PLAYER_TOGGLE_READY);
});
export const EmitStartGame = createAsyncThunk(
'emitStartGame',
async () => {
    return await socketClient.Emit(SocketEventEnum.START_GAME);
});
export const EmitGetGameStateFromServer = createAsyncThunk(
'emitGetGameStateFromServer',
async () => {
    return await socketClient.Emit(SocketEventEnum.GET_GAME_STATE);
});

const socketGameEmittersSlice = createSlice({
    name: 'socketGameEmitters',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(EmitGetGameStateFromServer.fulfilled, (state,action) => {
            state.gameStateFromServer = action.payload
        });
    },
});
export default socketGameEmittersSlice.reducer;