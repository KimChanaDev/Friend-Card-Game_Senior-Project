import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId: null,
    username: null,
    token: null,
    isLogIn: false,
}

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        Login: (state, action) => {
            const {userId, username, token} = action.payload;
            state.userId = userId;
            state.username = username;
            state.token = token;
            state.isLogIn = true;
        },
        Logout: (state) => {
            state.userId = null;
            state.username = null;
            state.token = null;
            state.isLogIn = false;
        },


    }
})
export const {
    Login,
    Logout,
} = userSlice.actions
export default userSlice.reducer