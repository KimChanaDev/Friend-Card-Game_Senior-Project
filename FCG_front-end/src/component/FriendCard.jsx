import './FriendCard.css'

function FriendCard() {
  const cardName = '9_of_clubs.svg'
  const cardPath = "\\SVG-cards-1.3\\" + cardName
  return (
    <section className='friend_card'>
        <p>FRIEND CARD</p>
        <img src={cardPath} alt="" />
        
       
        
    </section>
    

      
  )
}
export default FriendCard
