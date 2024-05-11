import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import SOCKET_STATUS from "../enum/SocketStatusEnum.jsx";
import {SetPage} from "../store/PageStateSlice.jsx";
import PAGE_STATE from "../enum/PageStateEnum.jsx";

export default function Loading(){
    const fetchPlayerBeforeJoinRoomStatus = useSelector(state => state.socketGameListenersStore.playerInGameListenerResponseStatus)
    const dispatch = useDispatch()

    useEffect(() => {
        if (fetchPlayerBeforeJoinRoomStatus === SOCKET_STATUS.SUCCESS){
            dispatch(SetPage({ pageState: PAGE_STATE.IN_GAME_INTERFACE }))
        }
    }, [fetchPlayerBeforeJoinRoomStatus]);

    return (
        <>
            <img
                src={"https://images.unsplash.com/photo-1607434472257-d9f8e57a643d?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                alt={"loading"}
            />
        </>
    )
}