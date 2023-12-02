import InGameInterface from "./interface/inGameInterface"
// import BiddingInterface from "./interface/BiddingInterface"
// import InLobby from "./interface/InLobby"
// import SummaryScore from "./interface/SummaryScore"
// import SelectCard from "./interface/SelectCard"

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3001';
import { io } from 'socket.io-client'
const socket = io(URL);
// import CardTable from "./component/CardTable"
import { useState } from 'react';
import { useEffect } from 'react';
function App() {  
  console.log('haha')
  const [isConnected, setIsConnected] = useState(socket.connetced);
  const [msg, setFooEvents] = useState({});
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    function onFooEvent(value) {
      setFooEvents(value);
      console.log(msg)
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new-message', onFooEvent);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new-message', onFooEvent);
    };
  });
  return (
    <>
        {/* <BiddingInterface/> */}
        <InGameInterface cardInhand={msg['cardInhand']} cardInfield={msg['cardInfield']} 
          friendCard={msg['friendCard']} trumpCard={msg['trumpCard']} turn={msg['turn']}
        GameScore={msg['matchScore']} />
        {/* <InLobby/> */}
        {/* <SummaryScore/> */}
        {/* <SelectCard/> */}
        {/* <CardTable/>  */}
    </>
  )
}
export default App
