import { useState } from 'react'


import PlayerCard from '../component/PlayerCard';
import SettingsIcon from '@mui/icons-material/Settings';
import BidCard from '../component/BidCard';
import LobbyInfo from '../component/LobbyInfo';
import SlideBar from '../component/SlideBar';
import './BiddingInterface.css'
function BiddingInterface() {
  const n = 13
  const myArray = new Array(n).fill(0);
  const picStyles = { "width": `${Math.min(100 / (n), 100 / 9)}%` }
  const cardName = '9_of_clubs.svg'
  // const cardName = 'back.svg'
  const cardPath = "..\\public\\SVG-cards-1.3\\" + cardName
  const offset = 25
  // const cardName = 'back.svg'
  return (
    <>
      <div class="background-image"></div>
      <div class="content">
        <section className='top' >
          <LobbyInfo />
          <SettingsIcon className='setting' sx={{ fontSize: 50 }} />
        </section>
        <section className='left' >
          <PlayerCard name={'khonKohok1'} isInLobby={false} isLeft={true} isBidding={true}
                      bidScore={20}
          />
          <PlayerCard name={'khonKohok2'} isInLobby={false}  isLeft={true}  isBidding={true}
                       bidScore={20} isPass={true}
          />
                   
        </section>

        <section className='right'>
         
          <PlayerCard name={'khonKohok3'} isInLobby={false} isLeft={false}  isBidding={true} 
                       bidScore={20}
          />
          <PlayerCard name={'khonKohok4'} isInLobby={false} isLeft={false}  isBidding={true}
                       bidScore={30} isMax={true} 
          />

        </section>

        <figure className='bot' style={{ paddingInlineStart: `${(n - 1) * offset}px` }}>
          {myArray.map((e, i) => <img src={cardPath} style={{ ...picStyles, "right": i * offset }} alt="" />)}
        </figure>


        <section className='mid'>
          <BidCard />
          
         
        </section>
        < SlideBar />
      </div>

    </>
  )
}
export default BiddingInterface
