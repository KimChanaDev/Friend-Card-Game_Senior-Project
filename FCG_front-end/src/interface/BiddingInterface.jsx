import { useState } from 'react'

import './BiddingInterface.css'
import PlayerCard from '../component/PlayerCard';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiPanel from '../component/EmojiPanel';
function BiddingInterface() {


  // const cardName = 'back.svg'
  return (
    <>
      <section className='top' >
        <div>
          <section>
            <h1>
              Match ID :
            </h1>
            <p>12345</p>
          </section>
          <section>
            <h1>Y/M/D</h1>
            <p>12/12/2023</p>
          </section>


        </div>


      </section>
      <section className='left' >
        <PlayerCard name={'khonKohok1'} />
        <PlayerCard name={'khonKohok2'} />
      </section>

      <section className='right'>
        <SettingsIcon className='setting' sx={{ fontSize: 50 }} />
        <PlayerCard name={'khonKohok3'} />
        <PlayerCard name={'khonKohok4'} />

      </section>

      <figure >

      </figure>

      <section className='mid'>
        {/* <TotalScoreBoard/> */}
        < EmojiPanel />
      </section>
    </>



  )
}
export default BiddingInterface
