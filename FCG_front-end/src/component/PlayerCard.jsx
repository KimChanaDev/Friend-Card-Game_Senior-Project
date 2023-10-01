
import './PlayerCard.css'
function PlayerCard({ name, desc, isInLobby, isLeft }) {
  return (
 
      <section className='profile '>
        {isInLobby && isLeft && <button className='kick_button_left' style={{ zIndex: 9999 }}>❌</button>}
       
        <img src="./khonKoHok.jpg" alt="" style={{ order: isLeft ? 1 : 2, zIndex: isInLobby && 999 }} />
        <div className='player_info' style={{ order: isLeft ? 2 : 1 }}>
          <h3 className='player_name'>{name}  </h3>
          <p className='desc text-sm text-red-600'>{desc}</p>
        </div>
        {!isLeft && <button className='kick_button_right' style={{ zIndex: 9999 }}>❌</button>}
      </section>
      
   

  )
}
export default PlayerCard
