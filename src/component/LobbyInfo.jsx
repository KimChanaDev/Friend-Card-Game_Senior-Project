import './LobbyInfo.css'
import {useSelector} from "react-redux";

export default function LobbyInfo() {
    const gameId = useSelector(state => state.socketStore.gameIdConnected)
    const roomPassword = useSelector(state => state.socketStore.passwordRoomConnected)
    const roundNumber = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.roundNumber) ?? 0
    const isGameStarted = useSelector(state => state.socketGameListenersStore.isGameStarted)
    return (
    <div className='lobby_info'>
        <section className='match_id'>
            <h1>Match ID:</h1><p>{gameId}</p>
        </section>
        <section className='date'>
            <h1>{`Password:${roomPassword ?? "None"}${isGameStarted ? ` | Round:${roundNumber+1}/4`: ''}`}</h1>
        </section>
    </div>
    )
}