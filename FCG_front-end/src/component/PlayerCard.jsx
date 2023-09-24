import './PlayerCard.css'
import CardTable from './CardTable'
function PlayerCard({name}) {
 
  return (
    <section className='profile'>
        <div className='player_name_panel'>
        <h3 className='player_name'>{name}  </h3>
        {/* <button className='kick_button'>❌</button> */}
        <p className='score text-sm text-red-600'>30</p>
        </div>
       
        <div className='player_info'>
            <img  src="./khonKoHok.jpg" alt="" />
            <section className='individual_score'>
              {/* <h4>score</h4>
              <p>20</p> */}
              <CardTable/>
            </section>
            
        </div>
       
        
    </section>
    

      
  )
}
export default PlayerCard
