import {useEffect, useState, useRef} from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import CardInHand from '../component/CardInHannd';
import PlayerCard2 from '../component/PlayerCard2';
import FriendCard from '../component/FriendCard';
import TrumpCard from '../component/TrumpCard';
import SlideBar from '../component/SlideBar';
// import CardTable from '../component/CardTable';
// import TotalScoreBoard from '../component/TotalScoreBoard';
// import EmojiPanel from '../component/EmojiPanel';
import './IngameInterface.css'
import PropTypes from "prop-types";
import WaitingPlayer from "../component/WaitingPlayer/WaitingPlayer.jsx";
import {useDispatch, useSelector} from "react-redux";
import {SetPlayersInGame, TogglePlayer} from "../store/GameSlice.jsx";
import CardIdFlieEnum from "../enum/CardIdFlieEnum.jsx";

export default function InGameInterface2()
{
    const [msg, setFooEvents] = useState({});
    // const [cardInHand, setCardInHand] = useState([])
    const [currentCard,setCurrentCard] = useState(-1)
    const role = msg['role'] || []
    const cardInfield= msg['cardInfield'] || []
    const friendCard= msg['friendCard'] ,trumpCard= msg['trumpCard'], turn=msg['turn'] || []
    const GameScore= msg['matchScore'] || []


    // console.log(cardInfield)
    const cardinfiled_map = cardInfield.map((e)=>"..\\public\\SVG-cards-1.3\\" + CardIdFlieEnum.cardIds[e+1])
    const friendCard_map = CardIdFlieEnum.cardIds[friendCard+1]
    const trumpCard_map = CardIdFlieEnum.suits[trumpCard]
    // const cardName = 'back.svg'
    // const cardPath = "..\\public\\SVG-cards-1.3\\" + cardName
    const offset = 25


    const userId = useSelector(state => state.userStore.userId)
    const playersBeforeJoinRoom = useSelector(state => state.socketGameListenersStore.playerBeforeJoinRoom)
    const playersInGame = useSelector(state => state.gameStore.playersInGame)
    const playerToggleReady = useSelector(state => state.socketGameListenersStore.playerToggleReady)
    const newPlayerConnected = useSelector(state => state.socketGameListenersStore.newPlayerConnected)
    const playerDisconnected = useSelector(state => state.socketGameListenersStore.playerDisconnected)
    const isGameStarted = useSelector(state => state.socketGameListenersStore.isGameStarted)
    const cardInHand = useSelector(state => state.socketGameListenersStore.cardInHand)

    const dispatch = useDispatch()

    // const numCardInHand = cardInHand?.length ?? 0
    // // const myArray = new Array(n).fill(0);
    // const picStyles = { "width": `${Math.min(100 / (numCardInHand), 100 / 9)}%` }
    // const cardInHandMap = cardInHand?.map((cardId)=> {
    //     return  {
    //         src:"..\\public\\SVG-cards-1.3\\" + CardIdFlieEnum.cardIds[cardId],
    //         id : cardId
    //     }
    // })

    /// init player first time
    useEffect(() => {
        if (playersBeforeJoinRoom){
            dispatch(SetPlayersInGame(playersBeforeJoinRoom))
        }
    }, [playersBeforeJoinRoom]);

    /// update ready status
    useEffect(() => {
        if(playerToggleReady){
            dispatch(TogglePlayer({ player: playerToggleReady }))
        }
    }, [playerToggleReady]);

    /// Add Player In Room When Other Connected
    useEffect(() => {
        if(newPlayerConnected){
            const updatedPlayerInGame = {
                ...playersInGame,
                players:[...playersInGame.players, newPlayerConnected]
            }
            dispatch(SetPlayersInGame(updatedPlayerInGame))
        }
    }, [newPlayerConnected]);

    // update player when player disconnected from quit button
    useEffect(() => {
        if(playerDisconnected){
            const existedPlayer = {
                players: playersInGame.players.filter(player => player.id !== playerDisconnected.id),
                thisPlayer: playersInGame.thisPlayer,
            };
            dispatch(SetPlayersInGame(existedPlayer))
        }
    }, [playerDisconnected]);


    const clickCard = (id)=>{
        alert(id)
        setCurrentCard(id)
        // socket.emit('sent-card',id)
    }

    const componentStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
    };
    function CheckOwnerReadyButton(id){
        return userId === id
    }
    return (
        <div style={componentStyles}>
            <div className="background-image">

            </div>
            {/*waiting player*/}
            { isGameStarted ? <WaitingPlayer isOpen={false}/> : <WaitingPlayer isOpen={true} /> }
            <div className="content">
                <section className='top' >
                    <FriendCard cardName={friendCard_map}/>
                    <TrumpCard  cardName={trumpCard_map}/>
                    {/* <CardTable/> */}
                    <SettingsIcon className='setting' sx={{ fontSize: 50 }} />

                </section>
                <section className='left' >
                    {(
                        playersInGame?.players[1] && <PlayerCard2 name={playersInGame.players[1].username} isLeft={true}
                                                                bidScore={20} isPlay={turn[0]} isTop={true}
                                                                score={GameScore[0]} role = {role[0]}
                                                                 isOwnerReadyButton={CheckOwnerReadyButton(playersInGame?.players[1]?.id)}
                                                                 isHost={playersInGame.players[1].isOwner}
                                                                 isReady={playersInGame.players[1].isReady}
                                                                 isOwnerStartButton={playersInGame.players[1].isOwner && playersInGame.players[1].id === userId}
                        />
                    )}
                    {(
                        playersInGame?.players[3] && <PlayerCard2 name={playersInGame.players[3].username}   isLeft={true}
                                                                bidScore={20}  isPlay={turn[1]}
                                                                score={GameScore[1]} role = {role[1]}
                                                                 isOwnerReadyButton={CheckOwnerReadyButton(playersInGame.players[3].id)}
                                                                 isHost={playersInGame.players[3].isOwner}
                                                                 isReady={playersInGame.players[3].isReady}
                                                                 isOwnerStartButton={playersInGame.players[3].isOwner && playersInGame.players[3].id === userId}
                        />
                    )}
                </section>
                <section className='right'>
                    {(
                        playersInGame?.players[2] && <PlayerCard2 name={playersInGame.players[2].username} isLeft={false}
                                                                isPlay={turn[3]}
                                                                bidScore={20} score={GameScore[3]} role = {role[3]}
                                                                 isOwnerReadyButton={CheckOwnerReadyButton(playersInGame.players[2].id)}
                                                                 isHost={playersInGame.players[2].isOwner}
                                                                 isReady={playersInGame.players[2].isReady}
                                                                 isOwnerStartButton={playersInGame.players[2].isOwner && playersInGame.players[2].id === userId}
                        />
                    )}
                    {(
                        playersInGame?.players[0] && <PlayerCard2 name={playersInGame.players[0].username} isLeft={false}
                                                                bidScore={20}
                                                                isPlay={turn[2]}
                                                                score={GameScore[2]} role = {role[2]}
                                                                 isOwnerReadyButton={CheckOwnerReadyButton(playersInGame.players[0].id)}
                                                                 isHost={playersInGame.players[0].isOwner}
                                                                 isReady={playersInGame.players[0].isReady}
                                                                 isOwnerStartButton={playersInGame.players[0].isOwner && playersInGame.players[0].id === userId}
                        />
                    )}
                </section>

                {/*<figure className='bot' style={{ paddingInlineStart: `${(numCardInHand - 1) * offset}px` }}>*/}
                {/*    {*/}
                {/*        cardInHandMap.map((e, i) => < CardInHand src={e.src} clickFunc={clickCard}*/}
                {/*                                               styles={{ ...picStyles, "right": i * offset }}*/}
                {/*                                               id = {e.id}*/}
                {/*        />)*/}
                {/*    }*/}
                {/*     /!*{cardInHandMap.map((e, i) => <img src={e} onClick={clickCard} style={{ ...picStyles, "right": i * offset }} alt="" />)}*!/*/}
                {/*</figure>*/}

                {
                    isGameStarted && <section className='mid'>
                        {cardinfiled_map.map((e)=><img src={e}  alt="" />)}
                        {/*
                        <img src={cardPath} alt="" />
                        <img src={cardPath} alt="" />
                        <img src={cardPath} alt="" /> */}
                        {/* <TotalScoreBoard/> */}
                    </section>
                }
                < SlideBar />
            </div>
        </div>
    )
}