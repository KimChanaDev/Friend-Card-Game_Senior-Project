import './FriendCard.css'

function FriendCard({cardName}) {
  const cardPath = "\\SVG-cards-1.3\\" + cardName
  return (
    <section className='friend_card'>
        <div className='card_img'>
          <img src={cardPath} alt="" />
        </div> 
        
        <p>FRIEND</p> 
    </section>
    

      
  )
}
export default FriendCard
