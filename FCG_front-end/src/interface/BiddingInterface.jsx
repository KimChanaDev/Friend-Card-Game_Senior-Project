import { useState } from 'react'


import PlayerCard from '../component/PlayerCard';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiPanel from '../component/EmojiPanel';
import BidCard from '../component/BidCard';
import LobbyInfo from '../component/LobbyInfo';
import BidShow from '../component/BidShow';
import './BiddingInterface.css'
function BiddingInterface() {
  // const cardName = 'back.svg'
  return (
    <>
      <section className='top' >
        <LobbyInfo/>

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

      <section className='bot'>
          <BidCard/>
          <button class="bg-green-500 confirm_button hover:bg-green-700 text-black font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-800 rounded">
            confirm
          </button>
      </section>

      <section className='mid'>
        <BidShow/>
      <button class="bg-orange-500 pass_button hover:bg-orange-700 text-black font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-800 rounded">
        pass
      </button>
        < EmojiPanel />
      </section>
    </>
  )
}
export default BiddingInterface
