import { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import './IngameInterface.css'
import PlayerCard from '../component/PlayerCard';
import FriendCard from '../component/FriendCard';
import TrumpCard from '../component/TrumpCard';
import CardTable from '../component/CardTable';
import TotalScoreBoard from '../component/TotalScoreBoard';
import EmojiPanel from '../component/EmojiPanel';
function InGameInterface() {
  const n = 9
  const myArray = new Array(n).fill(0);
  const picStyles = {"width":`${Math.min(100/(n),100/9)}%`}
  const cardName = '9_of_clubs.svg'
  // const cardName = 'back.svg'
  const cardPath = "..\\public\\SVG-cards-1.3\\" + cardName
  const offset = 10
  return (
    <>
    <section className='top' >
      <FriendCard/>
      <TrumpCard/>
      <CardTable/>

    </section>
    <section className='left' >
      <PlayerCard name = {'khonKohok1 👑'}/>
      <PlayerCard name = {'khonKohok2'}/>
    </section>

    <section className='right'>
      <SettingsIcon className='setting'  sx={{ fontSize: 50 }}/>
     
     
      <PlayerCard name = {'khonKohok3'}/>
      <PlayerCard name = {'khonKohok4'}/>
    
    </section>

    <figure className='bot' style = {{paddingInlineStart:`${(n-1)*offset}px`}}>
        {myArray.map( (e,i)=><img src= {cardPath} style = {{...picStyles,"right":i*offset}}   alt="" />)}  
    </figure>

    <section className='mid'>
      <div>
         <img src={cardPath} alt="" />
      </div>
        
        {/* <TotalScoreBoard/> */}
        < EmojiPanel/>
    </section>
    </>  
  )
}
export default InGameInterface
