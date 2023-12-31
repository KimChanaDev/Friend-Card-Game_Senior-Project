import PropTypes from "prop-types";
import './PlayerCard.css'
import {useDispatch, useSelector} from "react-redux";
import {EmitGetScoreCard, EmitStartGame, EmitToggleReady} from "../store/SocketGameEmittersSlice.jsx";
import PLAYER_ROLE from "../enum/PlayerRoleEnum.jsx";
import {useEffect, useState} from "react";
import GAME_STATE from "../enum/GameStateEnum.jsx";
import {ClearCardInField, ClearEmojiDetail} from "../store/SocketGameListenersSlice.jsx";
import EMOJI from "../enum/EmojiEnum.jsx";

PlayerCard2.propTypes = {
  socket: PropTypes.any
}
export default function PlayerCard2({ name, score, isInLobby, isLeft, isBidding, isMax, bidScore, isPass, isPlay, isTop, role
                      , isReady, isOwnerReadyButton, userId}) {
  const bidShowPosition = {right:isLeft&&'-2rem',left:!isLeft&&'-2rem'}
  const timerPosition = {bottom:isTop&&'-3rem',top:!isTop&&'-3rem'}
  const isOwnerRoom = useSelector(state => state.gameStore.playersInGame?.thisPlayer?.isOwner) ?? false
  const isGameStarted = useSelector(state => state.socketGameListenersStore.isGameStarted)
  const dispatch = useDispatch()
  const currentTurnPlayerId = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.currentPlayerId) ?? ""
  const playersPoint = useSelector(state => state.socketGameListenersStore.trickFinishedResult?.playersPoint) ?? []
  const isFriendAppeared = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.isFriendAppeared) ?? false
  const auctionWinnerTeamIds = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.auctionWinnerTeamIds) ?? []
  const anotherTeamIds = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.anotherTeamIds) ?? []
  const emojiDetail = useSelector(state => state.socketGameListenersStore.emojiDetail)
  const [isShowEmojiReceived, setIsShowEmojiReceived] = useState(false)

  /// Show Emoji
  useEffect(() => {
    if (emojiDetail && emojiDetail.playerId === userId) {
      setIsShowEmojiReceived(true);
      const timeoutId = setTimeout(() => {
        setIsShowEmojiReceived(false);
        dispatch(ClearEmojiDetail())
      }, 2000); // 2 sec
      return () => clearTimeout(timeoutId);
    }
  }, [emojiDetail]);

  function HandleReady(){ dispatch(EmitToggleReady()) }
  function FindScore(){
    return playersPoint.filter(player => player.playerId === userId)?.at(0)?.cardsPointReceive ?? 0
  }
  function GenerateTeamIcon(){
    let result = ""
    if (auctionWinnerTeamIds.some(id => id === userId)){
      result = "🌠"
    }
    else if (anotherTeamIds.some(id => id === userId)){
      result = "☪️"
    }
    return result
  }
  function PlayCardClicked(){
    if(isGameStarted){
      dispatch(EmitGetScoreCard({playerId: userId}))
    }
  }
  function GenerateEmoji(){
    if(emojiDetail){
      switch (emojiDetail.emoji) {
        case EMOJI.LOVE:
          return "❤️"
        case EMOJI.FUNNY:
          return "🤣"
        case EMOJI.VOMIT:
          return "🤮"
        case EMOJI.CRY:
          return "😭"
        default:
          return ""
      }
    }
  }

  return (
    <>
      <section className='profile ' onClick={() => PlayCardClicked()}>
        {/*kick button*/}
        {isInLobby && isLeft && isOwnerRoom && <button className='kick_button_left' style={{ zIndex: 9999 }}>❌</button>}

        <img src="./profile.png" alt="" style={{ order: isLeft ? 1 : 2, zIndex: isInLobby && 999 }} />

        <div className='player_info' style={{ order: isLeft ? 2 : 1 }}>
          {/*Name*/}
          <h3 className='player_name'>{role === PLAYER_ROLE.HOST ? '👑': ''} {isFriendAppeared ? GenerateTeamIcon() : ""} {name}</h3>
          {/*UID*/}
          { /*!isGameStarted && */ <p className='desc text-sm text-red-600'>{`UID ${userId.substring(userId.length - 8)}`}</p> }
          {/*score*/}
          { isGameStarted && <p className='desc text-sm text-red-600'>{`Score : ${FindScore()}`}</p> }
          {/*ready button*/}
          { isInLobby && role !== PLAYER_ROLE.HOST && <button onClick={HandleReady} disabled={!isOwnerReadyButton}>{isReady ? "Ready" : "Unready"}</button> }
        </div>

        {/*kick button*/}
        {isInLobby && !isLeft && isOwnerRoom && <button className='kick_button_right' style={{ zIndex: 9999 }}>❌</button>}

        {isBidding &&
          <div className='bidScore' style={{ ...bidShowPosition,backgroundColor: isMax && '#FFA1A1' }}>
            {bidScore}
          </div>
        }

        {isBidding && isPass &&
               <p className='pass' style={bidShowPosition} >
               PASS
              </p>
        }

        {userId === currentTurnPlayerId &&
          <div className='timer' style={timerPosition}>
              <p style={{order:isTop?2:1}}>TIMER</p>
              <p style={{order:isTop?1:2}} className='timer_value'>30</p>
          </div>
        }

        {
          isShowEmojiReceived &&
            <div className='bidScore' style={{ ...bidShowPosition,backgroundColor: isMax && '#FFA1A1' }}>
              {GenerateEmoji()}
            </div>
        }

      </section>
    </>

  )
}