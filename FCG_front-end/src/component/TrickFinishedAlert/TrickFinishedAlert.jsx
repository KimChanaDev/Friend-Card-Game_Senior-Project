import '../ProfilePopup/ProfilePopUp.css'
import {useSelector} from "react-redux";

export default function TrickFinishedAlert(){
    const trickFinishedResult = useSelector(state => state.socketGameListenersStore.trickFinishedResult)
    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>{`Trick number : ${(trickFinishedResult?.trickNumber ?? 998) + 1}`}</h2>
                <h2>{`Winner UID : ${trickFinishedResult?.winnerId}`}</h2>
                <h2>{`Winner Card : ${trickFinishedResult?.winnerCardId}`}</h2>
                <h2>{`Point Received : ${trickFinishedResult?.winnerReceivePoint}`}</h2>
            </div>
        </div>
    )
}