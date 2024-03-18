import {useEffect, useState} from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CreateLobbyPopUp from "../CreateLobbyPopUp/CreateLobbyPopUp.jsx";
import PasswordRoomPopup from "../PasswordRoomPopup/PasswordRoomPopup.jsx";
import SearchLobbyPopUp from "../SearchLobbyPopup/SearchLobbyPopup.jsx";
import {GetRooms} from "../../service/Api/ApiService.jsx";
import {useDispatch, useSelector} from "react-redux";
import {SetPage} from "../../store/PageStateSlice.jsx";
import PAGE_STATE from "../../enum/PageStateEnum.jsx";
import PropTypes from "prop-types";
import {ConnectToSocket} from "../../store/SocketSlice.jsx";
import SOCKET_STATUS from "../../enum/SocketStatusEnum.jsx";
import {SetJoinRoomDetail} from "../../store/GameSlice.jsx";
import {
    Auction, CardPlayed, EmojiReceived, GameFinished, PlayerConnected, PlayerDisconnected,
    PlayerInGame, PlayerToggleReady, RoundFinished, SelectMainCard, StartGame, TrickFinished
} from "../../store/SocketGameListenersSlice.jsx";

import Vfx from "../../components/Vfx.jsx";

LobbyList.propTypes = {
    CloseLobbyList: PropTypes.func,
}
export default function LobbyList({CloseLobbyList}){
    const { playButton } = Vfx();

    const [allRooms, setAllRooms] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isShowCreateLobbyPopup, setIsShowCreateLobbyPopup] = useState(false)
    const [isShowSearchLobbyPopup, setIsShowSearchLobbyPopup] = useState(false)
    const [isShowPasswordPopup, setIsShowPasswordPopup] = useState(false)
    const [roomConnectObjectIfPasswordRequire, setRoomConnectObjectIfPasswordRequire] = useState(null)

    const token = useSelector(state => state.userStore.token)
    const joinRoomDetail = useSelector(state => state.gameStore.joinRoomDetail)
    const socketConnectionStatus = useSelector(state => state.socketStore.connectionStatus)
    const dispatch = useDispatch()


    useEffect(() => {
        FetchRoom().then()
    }, []);

    /// Join room
    useEffect(() => {
        if (joinRoomDetail) {
            dispatch(ConnectToSocket({
                token: token,
                gameId: joinRoomDetail.roomDetail.id,
                password: joinRoomDetail.password
            }));
            dispatch(SetJoinRoomDetail(null))
            StartGameListener()
        }
    }, [joinRoomDetail]);

    /// Start Game
    useEffect(() => {
        if(socketConnectionStatus === SOCKET_STATUS.CONNECTED){
            dispatch(SetPage({ pageState: PAGE_STATE.LOADING }))
        }
    }, [socketConnectionStatus]);

    function StartGameListener(){
        dispatch(PlayerToggleReady())
        dispatch(StartGame())
        dispatch(PlayerConnected())
        dispatch(PlayerInGame())
        dispatch(PlayerDisconnected())
        dispatch(Auction())
        dispatch(SelectMainCard())
        dispatch(CardPlayed())
        dispatch(TrickFinished())
        dispatch(RoundFinished())
        dispatch(GameFinished())
        dispatch(EmojiReceived())
    }
    async function FetchRoom(){
        try{
            const rooms = await GetRooms(token)
            setAllRooms(rooms)
        }catch(error){
            // console.log("Fetch rooms failed: ", error)
        }
    }
    function OpenCreateLobbyPopup(){ setIsShowCreateLobbyPopup(true) }
    function CloseCreateLobbyPopup(){ playButton(); setIsShowCreateLobbyPopup(false) }
    function OpenSearchLobbyPopup(){ setIsShowSearchLobbyPopup(true) }
    function CloseSearchLobbyPopup(){ setIsShowSearchLobbyPopup(false) }
    function OpenIsShowPasswordPopup(){ setIsShowPasswordPopup(true) }
    function CloseIsShowPasswordPopup(){ setIsShowPasswordPopup(false) }

    function HandleChangePage (event, newPage){ setPage(newPage); }
    function HandleChangeRowsPerPage (event) {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }
    const columns = [
        { id: 'matchId', label: 'MatchID', minWidth: 170 },
        { id: 'status', label: 'Status', minWidth: 170 },
        { id: 'owner', label: 'Owner', minWidth: 170 },
        { id: 'lobbyName', label: 'Lobby\u00a0Name', minWidth: 170 },
    ];

    /// join room when selected room from table
    function HandleClickedRowRoom(room){
        if (room.isPasswordProtected){
            setRoomConnectObjectIfPasswordRequire(room)
            OpenIsShowPasswordPopup()
        }else{
            dispatch(SetJoinRoomDetail({
                roomDetail: room,
                password: null
            }))
        }
    }


    function GetCellValue(row, columeId){
        let value = ""
        switch (columeId){
            case "matchId":
                value = row["id"]
                break;
            case "status":
                value = row["numPlayersInGame"] === 4 ? "In Game" : `${row["numPlayersInGame"].toString()}/4`
                break;
            case "owner":
                value = row?.owner?.username
                break;
            case "lobbyName":
                value = row["roomName"]
                break;
            default:
                break;
        }
        return value
    }

    function Render(){
        return (
            <>
                <div className="popup">
                    <div className="popup-inner">
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    {/*<TableHead>*/}
                                    {/*    <TableRow>*/}
                                    {/*    }}>*/}
                                    {/*        {columns.map((column) => (*/}
                                    {/*            <TableCell*/}
                                    {/*                key={column.id}*/}
                                    {/*                align={column.align}*/}
                                    {/*                style={{ minWidth: column.minWidth }}*/}
                                    {/*            >*/}
                                    {/*                {column.label}*/}
                                    {/*            </TableCell>*/}
                                    {/*        ))}*/}
                                    {/*    </TableRow>*/}
                                    {/*</TableHead>*/}
                                    <TableBody>
                                        {allRooms
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow onClick={() => HandleClickedRowRoom(row)} hover role="checkbox" tabIndex={-1} key={row.id}>
                                                        {columns.map((column) => {
                                                            const value = GetCellValue(row, column.id)
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={allRooms.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={HandleChangePage}
                                onRowsPerPageChange={HandleChangeRowsPerPage}
                            />

                            <button onClick={FetchRoom}>REFRESH&emsp;</button>
                            <button onClick={OpenCreateLobbyPopup}>CREATE&emsp;</button>
                            <button onClick={OpenSearchLobbyPopup}>SEARCH&emsp;</button>
                            <button onClick={CloseLobbyList}>BACK&emsp;</button>
                        </Paper>
                    </div>
                </div>

                { isShowCreateLobbyPopup &&
                    <CreateLobbyPopUp CloseCreateLobbyPopup={CloseCreateLobbyPopup} />
                }
                { isShowSearchLobbyPopup &&
                    <SearchLobbyPopUp CloseSearchLobbyPopup={CloseSearchLobbyPopup} />
                }
                { isShowPasswordPopup &&
                    <PasswordRoomPopup
                        CloseIsShowPasswordPopup={CloseIsShowPasswordPopup}
                        roomConnectObjectIfPasswordRequire={roomConnectObjectIfPasswordRequire}
                    />
                }
            </>
        )
    }

    return (
        <>
            {Render()}
        </>
    )
}