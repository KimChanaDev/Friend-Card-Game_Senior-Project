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

      <section className='bot'>
          <ol>
            <li><button>55</button></li>
            <li><button>55</button></li>
            <li><button>55</button></li>
            <li><button>55</button></li>
            
          </ol>
          <button class="bg-green-500 confirm_button hover:bg-green-700 text-black font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-800 rounded">
            confirm
          </button>
      </section>

      <section className='mid'>
      <button class="bg-orange-500 pass_button hover:bg-orange-700 text-black font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-800 rounded">
        pass
      </button>
        < EmojiPanel />
      </section>
    </>



  )
}
export default BiddingInterface
