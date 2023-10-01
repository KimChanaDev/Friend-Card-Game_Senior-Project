import './PlayerCard.css'
function PlayerCard({ name, desc ,isInLobby}) {
  return (
    <section className='profile '>
        <img src="./khonKoHok.jpg" alt="" />
      <div className='player_info'>
        <h3 className='player_name'>{name}  </h3>
        {isInLobby && <button className='kick_button'>❌</button>}      
        <p className='desc text-sm text-red-600'>{desc}</p>
      </div>
    </section>
  )
}
export default PlayerCard
