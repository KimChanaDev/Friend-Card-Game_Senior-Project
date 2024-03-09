/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import './PlayerCard.css'
import {useDispatch, useSelector} from "react-redux";
import PLAYER_ROLE from "../enum/PlayerRoleEnum.jsx";
import {useEffect, useState} from "react";
import {
  DecreasePlayerTimeout,
  EmitGetScoreCard,
  EmitGetTimeout,
  EmitKickPlayer,
  EmitToggleReady, SetPlayerTimeout
} from "../store/SocketGameEmittersSlice.jsx";
import {ClearEmojiDetail} from "../store/SocketGameListenersSlice.jsx";
import EMOJI from "../enum/EmojiEnum.jsx";
import GAME_DELAY_ENUM from "../enum/GameDelayEnum.jsx";
import GAME_STATE from "../enum/GameStateEnum.jsx";
import BOT_LEVEL from "../enum/BotLevelEnum.jsx";

PlayerCard2.propTypes = {
  socket: PropTypes.any
}
export default function  PlayerCard2({ name, score, isInLobby, isLeft, isBidding, isMax, bidScore, isPass, isPlay, isTop, role, isReady, isOwnerReadyButton, userId,imgUrl, isBot, botLevel, disableTimer,orderStyled}) {
  const bidShowPosition = {right:isLeft&&'-2rem',left:!isLeft&&'-2rem'}
  const timerPosition = {bottom:isTop&&'-1rem',top:!isTop&&'-1rem'}
  const isOwnerRoom = useSelector(state => state.gameStore.playersInGame?.thisPlayer?.isOwner) ?? false
  const ownerId = useSelector(state => state.gameStore.playersInGame?.thisPlayer?.id) ?? ""
  const isGameStarted = useSelector(state => state.socketGameListenersStore.isGameStarted)
  const dispatch = useDispatch()
  const currentTurnPlayerId = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.currentPlayerId) ?? ""
  const playersPoint = useSelector(state => state.socketGameListenersStore.trickFinishedResult?.playersPoint) ?? []
  const isFriendAppeared = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.isFriendAppeared) ?? false
  const auctionWinnerTeamIds = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.auctionWinnerTeamIds) ?? []
  const anotherTeamIds = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.anotherTeamIds) ?? []
  const emojiDetail = useSelector(state => state.socketGameListenersStore.emojiDetail)
  const playerTimeoutInStore = useSelector(state => state.socketGameEmittersStore.currentPlayerTimeout)
  const gameRoundState = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.gameRoundState) ?? GAME_STATE.NOT_STARTED
  const gameplayState = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.gameplayState) ?? GAME_STATE.NOT_STARTED
  const winnerAuctionId = useSelector(state => state.socketGameListenersStore.winnerAuctionId)
  const winnerAuctionPoint = useSelector(state => state.socketGameListenersStore.winnerAuctionPoint)
  const [isShowEmojiReceived, setIsShowEmojiReceived] = useState(false)
  const [timerId, setTimerId] = useState(null)

  /// Show Emoji
  useEffect(() => {
    if (emojiDetail && emojiDetail.some(player => player.playerId === userId) && isShowEmojiReceived === false ) {
      setIsShowEmojiReceived(true);
      setTimeout(() => {
        setIsShowEmojiReceived(false);
        dispatch(ClearEmojiDetail({userId: userId}))
      }, 2000); // 2 sec
    }
  }, [emojiDetail]);

  // update timer
  useEffect(() => {
    if(playerTimeoutInStore && playerTimeoutInStore > 0){
      if (timerId) {
        clearTimeout(timerId);
      }
      const newTimerId = (setTimeout(function tick(){
            const decreaseTimeout = playerTimeoutInStore -1
            if(decreaseTimeout !== 0 && decreaseTimeout % 5 === 0){
              dispatch(EmitGetTimeout({}))
            }
            else{
              dispatch(SetPlayerTimeout({time: decreaseTimeout}))
            }
          }, 1000) // 1 sec
      )
      setTimerId(newTimerId);
    }
  }, [playerTimeoutInStore]);

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
    const playerEmoji = emojiDetail.find(player => player.playerId === userId)
    if(playerEmoji){
      switch (playerEmoji.emoji) {
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
  function HandleKickPlayer(){
    const response = confirm(`Kick player ${userId}?`)
    if(response){
      dispatch(EmitKickPlayer({ userId: userId}))
    }
  }
  function GenerateTimer(timeout) {
    const isBiddingState = gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.NOT_STARTED
    const isSelectMainCardState = gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.STARTED && winnerAuctionId === null
    const isPlayCardState = gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.STARTED && winnerAuctionId !== null
    if(isBiddingState){
      return (timeout >= GAME_DELAY_ENUM.AUCTION_IN_SEC) ?  GAME_DELAY_ENUM.AUCTION_IN_SEC : timeout
    }
    else if (isSelectMainCardState) {
      return  (timeout >= GAME_DELAY_ENUM.SELECT_MAIN_CARD_IN_SEC) ?  GAME_DELAY_ENUM.SELECT_MAIN_CARD_IN_SEC : timeout
    }
    else if (isPlayCardState) {
      return  (timeout >= GAME_DELAY_ENUM.PLAY_CARD_IN_SEC) ?  GAME_DELAY_ENUM.PLAY_CARD_IN_SEC : timeout
    }
  }
  function GenerateProfileImage() {
    let imagePath = imgUrl
    if(isBot && botLevel === BOT_LEVEL.EASY_BOT) imagePath = "./bot-profile-easy.png"
    else if (isBot && botLevel === BOT_LEVEL.MEDIUM_BOT) imagePath = "./bot-profile-medium.png"
    else if (isBot && botLevel === BOT_LEVEL.HARD_BOT) imagePath = "./bot-profile-hard.png"
    return <img src={imagePath} alt="" style={{ order: isLeft ? 1 : 2, zIndex: isInLobby && 999 }} />
  }
  const getBorderColor = () => {
    return orderStyled === 0 ? '2px solid #265073' : orderStyled === 1 ? '2px solid #7F27FF' : orderStyled === 2 ? '2px solid #944E63' :orderStyled === 3 ? '2px solid #D04848' : '2px solid black';
  };
  return (
    <>
      <section className='profile ' onClick={() => PlayCardClicked()} style={{ border: getBorderColor() }}>
        {/*kick button*/}
        {userId !== ownerId && isInLobby && isLeft && isOwnerRoom && <button onClick={() => HandleKickPlayer()} className='kick_button_left' style={{ zIndex: 9999 }}>❌</button>}
        { GenerateProfileImage() }

        <div className='player_info' style={{ order: isLeft ? 2 : 1 }}>
          {/*Name*/}
          <h3 className='player_name'>{role === PLAYER_ROLE.HOST ? '👑': ''} {isFriendAppeared ? GenerateTeamIcon() : ""} {isBot ? "BOT" : name}</h3>
          {/*UID*/}
          { /*!isGameStarted && */!isBot && !isGameStarted && <p className=''>{`UID ${userId.substring(userId.length - 8)}`}</p> }
          {/*score*/}
          { isGameStarted && <p className=''>{`Score : ${FindScore()} ${winnerAuctionId === userId ? `【WinBid: ${winnerAuctionPoint}】` : ""}`}</p> }
          {/*ready button*/}
          { isInLobby && role !== PLAYER_ROLE.HOST && <button className="ready_button" onClick={HandleReady} disabled={!isOwnerReadyButton}>{isReady ? "Ready" : "Unready"}</button> }
        </div>

        {/*kick button*/}
        {userId !== ownerId && isInLobby && !isLeft && isOwnerRoom && <button onClick={() => HandleKickPlayer()} className='kick_button_right' style={{ zIndex: 9999 }}>❌</button>}

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

        {/*Timer*/}
        {userId === currentTurnPlayerId && !disableTimer &&
          <div className='timer' style={timerPosition}>
              {/* <p style={{order:isTop?2:1}}>TIMER</p> */}
              <p style={{order:isTop?1:2}} className='timer_value'>{playerTimeoutInStore ? GenerateTimer(playerTimeoutInStore) : "Timeout"}</p>
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