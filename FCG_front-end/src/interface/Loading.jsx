import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import SocketStatusEnum from "../enum/SocketStatusEnum.jsx";
import {SetPage} from "../store/PageStateSlice.jsx";
import PageStateEnum from "../enum/PageStateEnum.jsx";

export default function Loading(){
    const fetchPlayerBeforeJoinRoomStatus = useSelector(state => state.socketGameListenersStore.playerConnectedStatus)
    const dispatch = useDispatch()

    useEffect(() => {
        if (fetchPlayerBeforeJoinRoomStatus === SocketStatusEnum.SUCCESS){
            dispatch(SetPage({ pageState: PageStateEnum.IN_GAME_INTERFACE }))
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