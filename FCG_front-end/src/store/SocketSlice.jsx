import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { socketClient} from "../main.jsx";
import SOCKET_STATUS from "../enum/SocketStatusEnum.jsx";

const initialState = {
    connectionStatus: '',
    gameIdConnected: '',
    passwordRoomConnected: ''
};

export const ConnectToSocket = createAsyncThunk(
    'connectToSocket',
    async ({ token, gameId, password }, { getState, dispatch }) => {
        return await socketClient.Connect(token, gameId, password).then(() => {
            dispatch({ type: 'socket/SetRoomIdAndPasswordConnected', payload: { gameId, password } })
        })
    }
);

export const DisconnectFromSocket = createAsyncThunk(
    'disconnectFromSocket',
    async () => { return await socketClient.Disconnect() }
);



const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        SetRoomIdAndPasswordConnected: (state, action) => {
            state.gameIdConnected = action.payload.gameId
            state.passwordRoomConnected = action.payload.password
        }
    },
    extraReducers: (builder) => {
        builder.addCase(ConnectToSocket.pending, (state) => {
            state.connectionStatus = SOCKET_STATUS.CONNECTING;
        });
        builder.addCase(ConnectToSocket.fulfilled, (state) => {
            state.connectionStatus = SOCKET_STATUS.CONNECTED;
        });
        builder.addCase(ConnectToSocket.rejected, (state) => {
            state.connectionStatus = SOCKET_STATUS.CONNECTION_FAILED;
        });
        builder.addCase(DisconnectFromSocket.pending, (state) => {
            state.connectionStatus = SOCKET_STATUS.DISCONNECTING;
        });
        builder.addCase(DisconnectFromSocket.fulfilled, (state) => {
            state.connectionStatus = SOCKET_STATUS.DISCONNECTED;
        });
        builder.addCase(DisconnectFromSocket.rejected, (state) => {
            state.connectionStatus = SOCKET_STATUS.CONNECTION_FAILED;
        });
    },
});
export default socketSlice.reducer;