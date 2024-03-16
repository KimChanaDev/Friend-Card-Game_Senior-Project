import '../ProfilePopup/ProfilePopUp.css'
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import GUEST_CONFIG from "../../enum/GuestConfigEnum.jsx";

export default function RoundFinishedAlert() {
    const roundFinishedResult = useSelector(state => state.socketGameListenersStore.roundFinishedResult)
    const gameFinishedResult = useSelector(state => state.socketGameListenersStore.gameFinishedResult)
    const isJoinGuestMode = useSelector(state => state.gameStore.isJoinGuestMode);
    const userIdCookie = useSelector(state => state.userStore.userId)
    const userId = isJoinGuestMode ? GUEST_CONFIG.UID : userIdCookie
    const [currentRoundResult, setCurrentRoundResult] = useState(null);

    useEffect(() => {
        if(roundFinishedResult){
            setCurrentRoundResult(roundFinishedResult.currentRound)
        }
    }, [roundFinishedResult]);

    useEffect(() => {
        if(gameFinishedResult){
            setCurrentRoundResult(gameFinishedResult.roundsFinishedDetail.currentRound)
        }
    }, [gameFinishedResult]);

    function FindCardsPointReceive(){
        let result = ""
        if(currentRoundResult?.playersPoint){
            result = currentRoundResult.playersPoint.find(p => p.playerId === userId)?.cardsPointReceive ?? ""
        }
        return result
    }
    function FindGamePointReceive(){
        let result = ""
        if(currentRoundResult?.playersPoint){
            result = currentRoundResult.playersPoint.find(p => p.playerId === userId)?.gamePointReceive ?? ""
        }
        return result
    }
    function IsWinner(){
        let result = false
        if(currentRoundResult?.playersPoint){
            result = currentRoundResult.playersPoint.find(p => p.playerId === userId)?.isRoundWinner ?? false
        }
        return result
    }
    return (
        <div className="popup">
            <div className="popup-inner">
                <h1>{`Round ${currentRoundResult?.roundNumber}`}</h1>
                <h1>{`You ${ IsWinner() ? "Win" : "Lose" }`}</h1>
                <h2>{`Cards Point Received: ${FindCardsPointReceive()}`}</h2>
                <h2>{`Game Point Received: ${FindGamePointReceive()}`}</h2>
                <hr/>
                <hr/>
            </div>
        </div>
    )
}