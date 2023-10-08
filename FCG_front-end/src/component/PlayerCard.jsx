
import './PlayerCard.css'
function PlayerCard({ name, desc, isInLobby, isLeft, isBidding, isMax, bidScore,isPass }) {
  const bidShowPosition = {right:isLeft&&'-2rem',left:!isLeft&&'-2rem'}
  return (
    <>
      <section className='profile '>
        {isInLobby && isLeft && <button className='kick_button_left' style={{ zIndex: 9999 }}>❌</button>}

        <img src="./profile.png" alt="" style={{ order: isLeft ? 1 : 2, zIndex: isInLobby && 999 }} />
        <div className='player_info' style={{ order: isLeft ? 2 : 1 }}>
          <h3 className='player_name'>{name}  </h3>
          <p className='desc text-sm text-red-600'>{desc}</p>
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
      
      </section>

    </>




  )
}
export default PlayerCard
