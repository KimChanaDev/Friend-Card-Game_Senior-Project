import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  userId: string | undefined;
  username: string | undefined;
  token: string | undefined;
  imagePath: string | undefined;
  isLogIn: boolean;
  song: string | undefined;
  volume: number;
}

export interface LoginPayload {
  userId?: string;
  username?: string;
  token?: string;
  imagePath?:string;
}

const initialState: UserState = {
  userId: undefined,
  username: undefined,
  token: undefined,
  imagePath: undefined,
  isLogIn: false,
  song: undefined,
  volume: 0
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    Login: (state, action: PayloadAction<LoginPayload>) => {
      const { userId, username, token, imagePath} = action.payload;
      state.userId = userId;
      state.username = username;
      state.token = token;
      state.imagePath = imagePath;
      state.isLogIn = true;
    },
    Logout: (state) => {
      state.userId = undefined;
      state.username = undefined;
      state.token = undefined;
      state.imagePath = undefined;
      state.isLogIn = false;
    },
    ChangeBGM: (state, action) => {
      state.song = action.payload;
    },
    ChangeVolume: (state, action) => {
      state.volume = action.payload;
    }
  },
});

export const { Login, Logout, ChangeBGM, ChangeVolume } = userSlice.actions;
export default userSlice.reducer;