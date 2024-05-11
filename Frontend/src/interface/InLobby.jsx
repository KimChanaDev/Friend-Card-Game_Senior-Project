import { useState } from 'react'


import PlayerCard from '../component/PlayerCard';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiPanel from '../component/EmojiPanel';
import LobbyInfo from '../component/LobbyInfo';
import Menu from '../component/Menu';
import SlideBar from '../component/SlideBar';
import './InLobby.css'

function InLobby() {
  
  // const cardName = 'back.svg'
  return (
    <>
      <section className='top' >
        <LobbyInfo/>
        <SettingsIcon className='setting' sx={{ fontSize: 50 }} />
      </section>
      <section className='left' >
        <PlayerCard name={'👑 khonKohok1'} desc={'uid:1234'} isLeft={true} isInLobby={true}/>
        <PlayerCard name={'khonKohok2'} desc={'uid:1234'} isLeft={true} isInLobby={true}/>
      </section>
      <section className='right'>
        <PlayerCard name={'khonKohok3'} desc={'uid:1234'} isInLobby={true}/>
        <PlayerCard name={'khonKohok4'} desc={'uid:1234'} isInLobby={true}/>
      </section>
      <section className='mid'>
        <Menu/>
      </section>
      <SlideBar/>
     
    </>
  )
}

export default InLobby
