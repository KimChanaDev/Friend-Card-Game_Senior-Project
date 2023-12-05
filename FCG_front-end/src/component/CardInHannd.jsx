
function CardInHand({ src,styles,id,clickFunc}) {
  
  return (
    <img onClick={()=>{
        clickFunc(id)
    }} src={src} style={styles}  alt="" />
  )
}
export default CardInHand
