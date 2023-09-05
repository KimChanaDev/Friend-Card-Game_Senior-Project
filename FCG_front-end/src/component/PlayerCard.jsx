import './PlayerCard.css'

function PlayerCard({name}) {
 
  return (
    <section className='profile'>
        <div className='player_name_panel'>
        <h3 className='player_name'>{name}  </h3>
        <button className='kick_button'>❌</button>
        </div>
       
        <div className='player_info'>
            <img  src="./khonKoHok.jpg" alt="" />
            <section className='individual_score'>
              <h4>score</h4>
              <p>20</p>
            </section>
            
        </div>
       
        
    </section>
    

      
  )
}
export default PlayerCard
