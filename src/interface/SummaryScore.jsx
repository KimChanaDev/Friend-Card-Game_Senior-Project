import "./SummaryScore.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { SetPage } from "../store/PageStateSlice.jsx";
import PAGE_STATE from "../enum/PageStateEnum.jsx";
import { DisconnectFromSocket } from "../store/SocketSlice.jsx";
import { ResetPlayersInGame } from "../store/GameSlice.jsx";
import { ResetAllListenerState } from "../store/SocketGameListenersSlice.jsx";
import { ResetAllEmitterState } from "../store/SocketGameEmittersSlice.jsx";
export default function SummaryScore({
  isShowButton,
  setIsShowGameFinishedPopup,
}) {
  const roundFinishedResult =
    useSelector(
      (state) => state.socketGameListenersStore.roundFinishedResult
    ) ?? [];
  const gameFinishResult = useSelector(
    (state) => state.socketGameListenersStore.gameFinishedResult
  );

  const [totalGamePointModel, setTotalGamePointModel] = useState(null);
  const [summaryRound, setSummaryRound] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (roundFinishedResult && !isShowButton) {
      setTotalGamePointModel(roundFinishedResult.totalGamePointModel)
      setSummaryRound(roundFinishedResult.summaryRound)
    }
  }, [roundFinishedResult]);

  useEffect(() => {
    if (gameFinishResult && isShowButton) {
      setTotalGamePointModel(gameFinishResult.roundsFinishedDetail.totalGamePointModel)
      setSummaryRound(gameFinishResult.roundsFinishedDetail.summaryRound)
    }
  }, [gameFinishResult]);

  function HighestTotalScoreRedBoldText(playerIndex) {
    return totalGamePointModel?.at(playerIndex)?.isHighestPoint
      ? "text-red-600 font-bold"
      : "";
  }
  function HandleBackToMenu() {
    dispatch(DisconnectFromSocket());
    dispatch(ResetPlayersInGame());
    dispatch(ResetAllListenerState());
    dispatch(ResetAllEmitterState())
    dispatch(SetPage({ pageState: PAGE_STATE.MENU }));
  }
  function HandleStayThisLobby() {
    dispatch(ResetAllEmitterState());
    dispatch(ResetAllListenerState());
    setIsShowGameFinishedPopup(false);
  }

  function GeneratePlayerPointText(roundNumber, playerUID){
    const summaryRoundModel = summaryRound && summaryRound.find(a => a.roundNumber === roundNumber)
    const playersRoundPointModel = summaryRoundModel && summaryRoundModel?.playersRoundPointModel?.find(a => a.playerId === playerUID)
    const point = playersRoundPointModel?.roundPoint
    const isRoundWinner = playersRoundPointModel?.isRoundWinner

    return `${point ?? ""} ${isRoundWinner ? "⭐" : ""}`
  }
  function GenerateTotalPlayerGamePointText(playerIndex){
    if(totalGamePointModel){
      const playerPoint = totalGamePointModel?.at(playerIndex)?.totalPoint
      const isHighestPoint = totalGamePointModel?.at(playerIndex)?.isHighestPoint
      return `${playerPoint ?? ""} ${isHighestPoint ? "👑" : ""}`
    }
    else{
      return ""
    }
  }
  return (
    <>
      <div className="popup-summary">
        <table className="table-summary">
          <thead className="">
            <tr>
              <th colSpan={5}>Game Summary</th>
            </tr>
            <tr>
              <th scope="col" className="table-topleft"></th>
              <th scope="col" className="table-playername">
                {totalGamePointModel?.at(0)?.playerName ?? ""}
              </th>
              <th scope="col" className="table-playername">
                {totalGamePointModel?.at(1)?.playerName ?? ""}
              </th>
              <th scope="col" className="table-playername">
                {totalGamePointModel?.at(2)?.playerName ?? ""}
              </th>
              <th scope="col" className="table-playername">
                {totalGamePointModel?.at(3)?.playerName ?? ""}
              </th>
            </tr>
          </thead>
          <tbody className="table-summary-row">
            <tr>
              <th scope="row">Round 1</th>
              <td>
                {GeneratePlayerPointText(1, totalGamePointModel?.at(0)?.playerId)}
              </td>
              <td>
                {GeneratePlayerPointText(1, totalGamePointModel?.at(1)?.playerId)}

              </td>
              <td>
                {GeneratePlayerPointText(1, totalGamePointModel?.at(2)?.playerId)}

              </td>
              <td>
                {GeneratePlayerPointText(1, totalGamePointModel?.at(3)?.playerId)}
              </td>
            </tr>
            <tr>
              <th scope="row">Round 2</th>
              <td>
                {GeneratePlayerPointText(2, totalGamePointModel?.at(0)?.playerId)}
              </td>
              <td>
                {GeneratePlayerPointText(2, totalGamePointModel?.at(1)?.playerId)}
              </td>
              <td>
                {GeneratePlayerPointText(2, totalGamePointModel?.at(2)?.playerId)}
              </td>
              <td>
                {GeneratePlayerPointText(2, totalGamePointModel?.at(3)?.playerId)}
              </td>
            </tr>
            <tr>
              <th scope="row">Round 3</th>
              <td>
                {GeneratePlayerPointText(3, totalGamePointModel?.at(0)?.playerId)}
              </td>
              <td>
                {GeneratePlayerPointText(3, totalGamePointModel?.at(1)?.playerId)}
              </td>
              <td>
                {GeneratePlayerPointText(3, totalGamePointModel?.at(2)?.playerId)}
              </td>
              <td>
                {GeneratePlayerPointText(3, totalGamePointModel?.at(3)?.playerId)}
              </td>
            </tr>
            <tr>
              <th scope="row">Round 4</th>
              <td>
                {GeneratePlayerPointText(4, totalGamePointModel?.at(0)?.playerId)}
              </td>
              <td>
                {GeneratePlayerPointText(4, totalGamePointModel?.at(1)?.playerId)}
              </td>
              <td>
                {GeneratePlayerPointText(4, totalGamePointModel?.at(2)?.playerId)}
              </td>
              <td>
                {GeneratePlayerPointText(4, totalGamePointModel?.at(3)?.playerId)}
              </td>
            </tr>
            <tr>
              <th scope="row">Total Score</th>
              <td className={`${HighestTotalScoreRedBoldText(0)}`}>
                {GenerateTotalPlayerGamePointText(0)}
              </td>
              <td className={`${HighestTotalScoreRedBoldText(1)}`}>
                {GenerateTotalPlayerGamePointText(1)}
              </td>
              <td className={` ${HighestTotalScoreRedBoldText(2)}`}>
                {GenerateTotalPlayerGamePointText(2)}
              </td>
              <td className={` ${HighestTotalScoreRedBoldText(3)}`}>
                {GenerateTotalPlayerGamePointText(3)}
              </td>
            </tr>
          </tbody>
        </table>
        {isShowButton && (
          <div className="summary-button-container">
            <button
              className="summary-button-back"
              onClick={() => HandleBackToMenu()}
            >
              Back to menu
            </button>
            <button
              className="summary-button-close"
              onClick={() => HandleStayThisLobby()}
            >
              Stay this lobby
            </button>
          </div>
        )}
      </div>
    </>
  );
}
