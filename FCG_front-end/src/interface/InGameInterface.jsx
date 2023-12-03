import { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings';

import PlayerCard from '../component/PlayerCard';
import FriendCard from '../component/FriendCard';
import TrumpCard from '../component/TrumpCard';
import SlideBar from '../component/SlideBar';
// import CardTable from '../component/CardTable';
// import TotalScoreBoard from '../component/TotalScoreBoard';
// import EmojiPanel from '../component/EmojiPanel';
import './IngameInterface.css'


function InGameInterface({cardInhand = [],cardInfield = [],GameScore = [],friendCard,
                          trumpCard,turn = []
                        }) 
  {
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
  const cardInhand_map = cardInhand.map((e)=>"..\\public\\SVG-cards-1.3\\" + dictCard[e+1])
  console.log(cardInfield)
  const cardinfiled_map = cardInfield.map((e)=>"..\\public\\SVG-cards-1.3\\" + dictCard[e+1])
  const friendCard_map = dictCard[friendCard+1]
  const trumpCard_map = suites[trumpCard]
  // const cardName = 'back.svg'
  // const cardPath = "..\\public\\SVG-cards-1.3\\" + cardName
  const offset = 25
  const dummy  = []
  for(let i=1;i<53;i++)
    dummy.push(dictCard[i])
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
                      score={GameScore[0]}
          />
          <PlayerCard name={'khonKohok2'}   isLeft={true}  
                       bidScore={20}  isPlay={turn[1]}
                       score={GameScore[1]}
          />
        </section>
        <section className='right'>
        <PlayerCard name={'khonKohok4'} isLeft={false}
                      isPlay={turn[3]}
                      bidScore={20} score={GameScore[3]}
          />
          <PlayerCard name={'khonKohok3'}  isLeft={false} 
                       bidScore={20} 
                       isPlay={turn[2]}
                       score={GameScore[2]}
          />
        </section>

        <figure className='bot' style={{ paddingInlineStart: `${(n - 1) * offset}px` }}>
          
              
          
          {cardInhand_map.map((e, i) => <img src={e} style={{ ...picStyles, "right": i * offset }} alt="" />)}
        </figure>

        <section className='mid'>
            {cardinfiled_map.map((e)=><img src={e} alt="" />)}
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
