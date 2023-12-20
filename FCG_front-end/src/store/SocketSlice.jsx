import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { socketClient} from "../main.jsx";
import SocketStatusEnum from "../enum/SocketStatusEnum.jsx";
import {SetPage} from "./PageStateSlice.jsx";
import PageStateEnum from "../enum/PageStateEnum.jsx";
import {useDispatch} from "react-redux";

const initialState = {
    connectionStatus: '',
};

export const ConnectToSocket = createAsyncThunk(
    'connectToSocket',
    async ({ token, gameId, password }) => { return await socketClient.Connect(token, gameId, password) }
);

export const DisconnectFromSocket = createAsyncThunk(
    'disconnectFromSocket',
    async () => { return await socketClient.Disconnect() }
);



const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(ConnectToSocket.pending, (state) => {
            state.connectionStatus = SocketStatusEnum.CONNECTING;
        });
        builder.addCase(ConnectToSocket.fulfilled, (state) => {
            state.connectionStatus = SocketStatusEnum.CONNECTED;
        });
        builder.addCase(ConnectToSocket.rejected, (state) => {
            state.connectionStatus = SocketStatusEnum.CONNECTION_FAILED;
        });
        builder.addCase(DisconnectFromSocket.pending, (state) => {
            state.connectionStatus = SocketStatusEnum.DISCONNECTING;
        });
        builder.addCase(DisconnectFromSocket.fulfilled, (state) => {
            state.connectionStatus = SocketStatusEnum.DISCONNECTED;
        });
        builder.addCase(DisconnectFromSocket.rejected, (state) => {
            state.connectionStatus = SocketStatusEnum.CONNECTION_FAILED;
        });
    },
});
export default socketSlice.reducer;