import { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import CardInHand from '../component/CardInHannd';
import PlayerCard from '../component/PlayerCard';
import FriendCard from '../component/FriendCard';
import TrumpCard from '../component/TrumpCard';
import SlideBar from '../component/SlideBar';
// import CardTable from '../component/CardTable';
// import TotalScoreBoard from '../component/TotalScoreBoard';
// import EmojiPanel from '../component/EmojiPanel';
import './IngameInterface.css'
import { useEffect } from 'react';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5000';
import { io } from 'socket.io-client'
const socket = io(URL);
function InGameInterface() 
  {
  const [msg, setFooEvents] = useState({});
  const [cardInhand, setCardInHand] = useState([])
  const [currentCard,setCurrentCard] = useState(-1)
  const role = msg['role'] || []
  const cardInfield= msg['cardInfield'] || []
  const friendCard= msg['friendCard'] ,trumpCard= msg['trumpCard'], turn=msg['turn'] || []
  const GameScore= msg['matchScore'] || []
  const dictCard = {
    1:'2_of_hearts.svg',2:'3_of_hearts.svg',3:'4_of_hearts.svg',4:'5_of_hearts.svg',5:'6_of_hearts.svg',
    6:'7_of_hearts.svg',7:'8_of_hearts.svg',8:'9_of_hearts.svg',9:'10_of_hearts.svg',10:'jack_of_hearts.svg',
    11:'queen_of_hearts.svg',12:'king_of_hearts.svg',13:'ace_of_hearts.svg',

    14:'2_of_diamonds.svg',15:'3_of_diamonds.svg',16:'4_of_diamonds.svg',17:'5_of_diamonds.svg',18:'6_of_diamonds.svg',
    19:'7_of_diamonds.svg',20:'8_of_diamonds.svg',21:'9_of_diamonds.svg',22:'10_of_diamonds.svg',23:'jack_of_diamonds.svg',
    24:'queen_of_diamonds.svg',25:'king_of_diamonds.svg',26:'ace_of_diamonds.svg',

    27:'2_of_clubs.svg',28:'3_of_clubs.svg',29:'4_of_clubs.svg',30:'5_of_clubs.svg',31:'6_of_clubs.svg',
    32:'7_of_clubs.svg',33:'8_of_clubs.svg',34:'9_of_clubs.svg',35:'10_of_clubs.svg',36:'jack_of_clubs.svg',
    37:'queen_of_clubs.svg',38:'king_of_clubs.svg',39:'ace_of_clubs.svg',
    
    40:'2_of_spades.svg',41:'3_of_spades.svg',42:'4_of_spades.svg',43:'5_of_spades.svg',44:'6_of_spades.svg',
    45:'7_of_spades.svg',46:'8_of_spades.svg',47:'9_of_spades.svg',48:'10_of_spades.svg',49:'jack_of_spades.svg',
    50:'queen_of_spades.svg',51:'king_of_spades.svg',52:'ace_of_spades.svg'

  }
  const suites = {'Hearts':'ace_of_hearts.svg','Diamonds':'ace_of_diamonds.svg','Clubs':'ace_of_clubs.svg','Spades':'ace_of_spades.svg'}
  const n = cardInhand.length
  // const myArray = new Array(n).fill(0);
  const picStyles = { "width": `${Math.min(100 / (n), 100 / 9)}%` }
  const cardInhand_map = cardInhand.map((e)=> {
    return  {
      src:"..\\public\\SVG-cards-1.3\\" + dictCard[e+1],
      id : e
    }
  })
  console.log(cardInfield)
  const cardinfiled_map = cardInfield.map((e)=>"..\\public\\SVG-cards-1.3\\" + dictCard[e+1])
  const friendCard_map = dictCard[friendCard+1]
  const trumpCard_map = suites[trumpCard]
  // const cardName = 'back.svg'
  // const cardPath = "..\\public\\SVG-cards-1.3\\" + cardName
  const offset = 25

  
  const [isConnected, setIsConnected] = useState(socket.connetced);
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    function onFooEvent(value) {
      setFooEvents(value);
     
      console.log(value)
      console.log('msg rec')
    }
    function moveEvent(res,id) {
      console.log(currentCard)
      if (res['isLegal']){
        setCardInHand((current) => current.filter((card) => card != res['id']))
      }
    }
    function initCardEvent(res){
      setCardInHand(res['cardInhand'])
    }
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new-message', onFooEvent);
    socket.on('init-card', initCardEvent);
    socket.on('legal-move', moveEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new-message', onFooEvent);
      socket.off('legal-move', moveEvent);
      socket.off('init-card', initCardEvent);
      
    };
  },[socket]);

  const clickCard = (id)=>{
    alert(id)
    setCurrentCard(id)
    socket.emit('sent-card',id)
  }

  return (
    <>
      <div class="background-image">

      </div>
      <div class="content">
        <section className='top' >
          <FriendCard cardName={friendCard_map}/>
          <TrumpCard  cardName={trumpCard_map}/>
          {/* <CardTable/> */}
          <SettingsIcon className='setting' sx={{ fontSize: 50 }} />

        </section>
        <section className='left' >
        <PlayerCard name={'khonKohok1'} isLeft={true}
                      bidScore={20} isPlay={turn[0]} isTop={true}
                      score={GameScore[0]} role = {role[0]}
          />
          <PlayerCard name={'khonKohok2'}   isLeft={true}  
                       bidScore={20}  isPlay={turn[1]}
                       score={GameScore[1]} role = {role[1]}
          />
        </section>
        <section className='right'>
        <PlayerCard name={'khonKohok4'} isLeft={false}
                      isPlay={turn[3]}
                      bidScore={20} score={GameScore[3]} role = {role[3]}
          />
          <PlayerCard name={'khonKohok3'}  isLeft={false} 
                       bidScore={20} 
                       isPlay={turn[2]}
                       score={GameScore[2]} role = {role[2]}
          />
        </section>

        <figure className='bot' style={{ paddingInlineStart: `${(n - 1) * offset}px` }}>
          
              
          {cardInhand_map.map((e, i) => < CardInHand src={e.src} clickFunc={clickCard} 
                                          styles={{ ...picStyles, "right": i * offset }}  
                                          id = {e.id}
                                        />)
          
          }
          {/* {cardInhand_map.map((e, i) => <img src={e} onClick={clickCard} style={{ ...picStyles, "right": i * offset }} alt="" />)} */}
        </figure>

        <section className='mid'>
            {cardinfiled_map.map((e)=><img src={e}  alt="" />)}
{/*             
            <img src={cardPath} alt="" />
            <img src={cardPath} alt="" />
            <img src={cardPath} alt="" /> */}
         
          {/* <TotalScoreBoard/> */}
        </section>
        < SlideBar />
      </div>
    </>
  )
}
export default InGameInterface
