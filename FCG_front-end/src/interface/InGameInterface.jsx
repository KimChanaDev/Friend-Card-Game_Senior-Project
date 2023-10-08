import { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings';

import PlayerCard from '../component/PlayerCard';
import FriendCard from '../component/FriendCard';
import TrumpCard from '../component/TrumpCard';
import SlideBar from '../component/SlideBar';
import CardTable from '../component/CardTable';
import TotalScoreBoard from '../component/TotalScoreBoard';
import EmojiPanel from '../component/EmojiPanel';
import './IngameInterface.css'


function InGameInterface() {
  const n = 13
  const myArray = new Array(n).fill(0);
  const picStyles = { "width": `${Math.min(100 / (n), 100 / 9)}%` }
  const cardName = '9_of_clubs.svg'
  // const cardName = 'back.svg'
  const cardPath = "..\\public\\SVG-cards-1.3\\" + cardName
  const offset = 25
  return (
    <>
      <div class="background-image">

      </div>
      <div class="content">
        <section className='top' >
          <FriendCard />
          <TrumpCard />
          {/* <CardTable/> */}
          <SettingsIcon className='setting' sx={{ fontSize: 50 }} />

        </section>
        <section className='left' >
        <PlayerCard name={'khonKohok1'} isLeft={true}
                      bidScore={20} isPlay={true} isTop={true}
          />
          <PlayerCard name={'khonKohok2'}   isLeft={true}  
                       bidScore={20} isPass={true} isPlay={true}
          />
        </section>

        <section className='right'>
        <PlayerCard name={'khonKohok1'} isLeft={false} 
                      bidScore={20}
          />
          <PlayerCard name={'khonKohok2'}  isLeft={false} 
                       bidScore={20} isPass={true}
          />
        </section>

        <figure className='bot' style={{ paddingInlineStart: `${(n - 1) * offset}px` }}>
          {myArray.map((e, i) => <img src={cardPath} style={{ ...picStyles, "right": i * offset }} alt="" />)}
        </figure>

        <section className='mid'>
         
            <img src={cardPath} alt="" />
            <img src={cardPath} alt="" />
            <img src={cardPath} alt="" />
            <img src={cardPath} alt="" />
         
          {/* <TotalScoreBoard/> */}
        </section>
        < SlideBar />
      </div>
    </>
  )
}
export default InGameInterface
