import { useState } from 'react'


import PlayerCard from '../component/PlayerCard';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiPanel from '../component/EmojiPanel';
import LobbyInfo from '../component/LobbyInfo';
import Menu from '../component/Menu';
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
        <PlayerCard name={'👑 khonKohok1'} desc={'udi:1234'} />
        <PlayerCard name={'khonKohok2'} desc={'udi:1234'} />
      </section>
      <section className='right'>
        
        <PlayerCard name={'khonKohok3'} desc={'udi:1234'}/>
        <PlayerCard name={'khonKohok4'} desc={'udi:1234'}/>
      </section>
      <section className='mid'>
        <Menu/>
      </section>
      <svg className='slide_bar' xmlns="http://www.w3.org/2000/svg" width="43" height="201" viewBox="0 0 43 201" fill="none">
        <path d="M0 30C0 13.4315 13.4315 0 30 0H43V201H30C13.4315 201 0 187.569 0 171V30Z" fill="#2A324D" />
        <path d="M13 100L47.5 68.8231V131.177L13 100Z" fill="white" />
      </svg>
      {/* <section className='bot'>
      < EmojiPanel />
      </section> */}
    </>
  )
}
export default InLobby
