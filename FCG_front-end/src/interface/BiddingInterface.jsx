import { useState } from 'react'

import './BiddingInterface.css'
import PlayerCard from '../component/PlayerCard';

import EmojiPanel from '../component/EmojiPanel';
function BiddingInterface() {

 
  // const cardName = 'back.svg'
  return (
    <>
    <section className='top' >
      

    </section>
    <section className='left' >
      <PlayerCard name = {'khonKohok1'}/>
      <PlayerCard name = {'khonKohok2'}/>
    </section>

    <section className='right'>
      <PlayerCard name = {'khonKohok3'}/>
      <PlayerCard name = {'khonKohok4'}/>
    
    </section>

    <figure >
       
    </figure>

    <section className='mid'>
        {/* <TotalScoreBoard/> */}
        < EmojiPanel/>
    </section>
    </>
    

      
  )
}
export default BiddingInterface
