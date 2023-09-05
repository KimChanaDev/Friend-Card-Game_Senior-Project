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
      <section className='mid'>
        <Menu/>
      </section>
      <section className='bot'>
      < EmojiPanel />
      </section>
    </>
  )
}
export default InLobby
