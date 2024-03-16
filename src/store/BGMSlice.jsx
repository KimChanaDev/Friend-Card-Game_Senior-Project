import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    song: null
}

export const BGMSlice = createSlice({
    name: "BGM",
    initialState,
    reducers: {
        ChangeBGM: (state, action) => {
            state.song = action.payload;
        }
    }
})

export const {
    ChangeBGM
} = BGMSlice.actions

export default BGMSlice.reducer