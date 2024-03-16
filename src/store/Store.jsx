import {configureStore, createSelector} from '@reduxjs/toolkit'
import {useSelector} from "react-redux";
import userSlice from './UserSlice.tsx'
import gameSlice from "./GameSlice.jsx";
import pageStateSlice from "./PageStateSlice.jsx"
import socketSlice from "./SocketSlice.jsx";
import socketGameListenersSlice from "./SocketGameListenersSlice.jsx";
import socketGameEmittersSlice from "./SocketGameEmittersSlice.jsx";
import BGMSlice from './BGMSlice.jsx';

export const store = configureStore({
    reducer: {
        userStore: userSlice,
        gameStore: gameSlice,
        pageStateStore: pageStateSlice,
        socketStore: socketSlice,
        socketGameListenersStore: socketGameListenersSlice,
        socketGameEmittersStore: socketGameEmittersSlice,
        BGMStore: BGMSlice
    }
})

export function GetStores(){
    const reduxStores = useSelector(
        createSelector(
            (state) => {return state},
            //     (state) => {return state.gameStore},
            (stores) => {
                console.log('Memoized store selector');
                return {stores}
            })
    )
    return reduxStores.stores
}