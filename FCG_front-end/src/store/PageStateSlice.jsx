import { createSlice } from '@reduxjs/toolkit'
import PageStateEnum from "../enum/PageStateEnum.jsx";

const initialState = {
    pageState: PageStateEnum.MENU
}

export const pageStateSlice = createSlice({
    name: "pageState",
    initialState,
    reducers: {
        SetPage: (state, action) => {
            const { pageState } = action.payload
            state.pageState = pageState
        }
    }
})
export const {SetPage} = pageStateSlice.actions
export default pageStateSlice.reducer