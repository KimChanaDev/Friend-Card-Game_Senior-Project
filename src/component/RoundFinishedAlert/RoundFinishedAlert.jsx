import '../ProfilePopup/ProfilePopUp.css'
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

export default function RoundFinishedAlert() {
    const roundFinishedResult = useSelector(state => state.socketGameListenersStore.roundFinishedResult)
    const userId = useSelector(state => state.userStore.userId)
    const [maxRoundObject, setMaxRoundObject] = useState(null)
    const [playerPointsObjectAtMaxRound, setPlayerPointsObjectAtMaxRound] = useState(null)
    const [isWinner, setIsWinner] = useState(false)

    useEffect(() => {
        if(roundFinishedResult){
            const maxRoundObj = roundFinishedResult.reduce((maxRound, currentRound) => {
                return maxRound.roundNumber > currentRound.roundNumber ? maxRound : currentRound;
            }, roundFinishedResult.at(0))
            setMaxRoundObject(maxRoundObj)

            const playerPointsObj = maxRoundObj.playersPoint.filter(a => a.playerId === userId).at(0)
            setPlayerPointsObjectAtMaxRound(playerPointsObj)

            const isWin = maxRoundObj.winnerPlayerIds.some(winner => userId === winner)
            setIsWinner(isWin)
        }
    }, [roundFinishedResult]);

    return (
        <div className="popup">
            <div className="popup-inner">
                <h1>{`Round ${maxRoundObject?.roundNumber}`}</h1>
                <h1>{`You ${ isWinner ? "Win" : "Lose" }`}</h1>
                <h2>{`Cards Point Received: ${playerPointsObjectAtMaxRound?.cardsPointReceive}`}</h2>
                <h2>{`Game Point Received: ${playerPointsObjectAtMaxRound?.gamePointReceive}`}</h2>
                <hr/>
                <hr/>
                <h3>Case 1 : ผู้ชนะการประมูลด้วย bidPoint ชนะเกม</h3>
                <h3>ผู้ชนะเกม และ ชนะการประมูล ได้แต้มเท่ากับ bidPoint + cardsPoint</h3>
                <h3>ผู้ชนะเกม และ ไม่ได้ชนะการประมูล ได้แต้มเท่ากับ bidPoint/2 + cardsPoint</h3>
                <h3>ผู้แพ้ เสียแต้ม 100 - bidPoint</h3>
                <hr/>
                <h3>Case 2 : ผู้ชนะการประมูลด้วย bidPoint แพ้เกม</h3>
                <h3>ผู้แพ้เกม และ ชนะการประมูล เสียแต้มเท่ากับ bidPoint</h3>
                <h3>ผู้แพ้เกม และ ไม่ได้ชนะการประมูล เสียแต้มเท่ากับ bidPoint/2 - cardsPoint</h3>
                <h3>ผู้ชนะ ได้แต้ม (cardsPoint ทั้งหมดของ Team)/2</h3>
            </div>
        </div>
    )
}