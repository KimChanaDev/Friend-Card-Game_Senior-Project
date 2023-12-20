import PropTypes from "prop-types";
import './PlayerCard.css'
import {useDispatch} from "react-redux";
import {EmitStartGame, EmitToggleReady} from "../store/SocketGameEmittersSlice.jsx";

PlayerCard2.propTypes = {
  socket: PropTypes.any
}
export default function PlayerCard2({ name, score, isInLobby, isLeft, isBidding, isMax, bidScore, isPass, isPlay, isTop, role
                      , isReady, isOwnerReadyButton, isOwnerStartButton, isHost}) {
  const bidShowPosition = {right:isLeft&&'-2rem',left:!isLeft&&'-2rem'}
  const timerPosition = {bottom:isTop&&'-3rem',top:!isTop&&'-3rem'}
  const dispatch = useDispatch()
  function HandleReady(){ dispatch(EmitToggleReady()) }
  function HandleStartGame(){
    dispatch(EmitStartGame())
  }

  return (
    <>
      <section className='profile '>
        {isInLobby && isLeft && <button className='kick_button_left' style={{ zIndex: 9999 }}>❌</button>}

        <img src="./profile.png" alt="" style={{ order: isLeft ? 1 : 2, zIndex: isInLobby && 999 }} />
        <div className='player_info' style={{ order: isLeft ? 2 : 1 }}>
          <h3 className='player_name'>{name} {role==1?'👑':role==2?'✨':''}   </h3>
          <p className='desc text-sm text-red-600'>{score}</p>
          {/*ready button*/}
          {isHost ? "Host" : <button onClick={HandleReady} disabled={!isOwnerReadyButton}>{isReady ? "Ready" : "Unready"}</button>}
          {/*start button*/}
          {isOwnerStartButton && <button onClick={HandleStartGame}>Start Game</button>}
        </div>
        {!isLeft && isInLobby && <button className='kick_button_right' style={{ zIndex: 9999 }}>❌</button>}
        {isBidding &&
          <div className='bidScore' style={{ ...bidShowPosition,backgroundColor: isMax && '#FFA1A1' }}>
            {bidScore}

          </div>
        }
        {isBidding && isPass &&
               <p className='pass' style={bidShowPosition} >
               pass
              </p>
        }
        {isPlay&& 
          <div className='timer' style={timerPosition}>
              <p style={{order:isTop?2:1}}>Timer</p>
              <p style={{order:isTop?1:2}} className='timer_value'>30</p>
          </div>

        }

      </section>
    </>

  )
}