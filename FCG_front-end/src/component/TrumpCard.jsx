import './TrumpCard.css'

function TrumpCard() {
  const cardName = '9_of_clubs.svg'
  const cardPath = "\\SVG-cards-1.3\\" + cardName
  return (
    <section className='trump_card'>
        <p>TRUMP CARD</p>
        <img src={cardPath} alt="" />
    </section>
    

      
  )
}
export default TrumpCard