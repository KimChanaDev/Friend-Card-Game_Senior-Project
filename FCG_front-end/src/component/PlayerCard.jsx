import './PlayerCard.css'

function PlayerCard({name}) {
 
  return (
    <section className='profile'>
        <h3 className='player_name'>{name}</h3>  
        <div >
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
