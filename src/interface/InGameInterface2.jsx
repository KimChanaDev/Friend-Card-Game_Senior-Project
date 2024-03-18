import './SummaryScore.css'
import './InGameInterface.css'
// import './test.css'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import SettingsIcon from '@mui/icons-material/Settings';
import CardInHand from '../component/CardInHand.jsx';
import PlayerCard2 from '../component/PlayerCard2';
import FriendCard from '../component/FriendCard';
import TrumpCard from '../component/TrumpCard';
import SlideBar from '../component/SlideBar';
import WaitingPlayer from "../component/WaitingPlayer/WaitingPlayer.jsx";
import BidCard from "../component/BidCard.jsx";
import WaitingSelectMainCard from "../component/WaitingSelectMainCard/WaitingSelectMainCard.jsx";
import TrickFinishedAlert from "../component/TrickFinishedAlert/TrickFinishedAlert.jsx";
import LobbyInfo from "../component/LobbyInfo.jsx";
import FriendAppearedAlert from "../component/FriendAppearedAlert/FriendAppearedAlert.jsx";
import RoundFinishedAlert from "../component/RoundFinishedAlert/RoundFinishedAlert.jsx";
import CardTable from "../component/CardTable.jsx";
import SelectCard from "./SelectCard.jsx";
import SummaryScore from "./SummaryScore.jsx";
import CARD_ID_FILE from "../enum/CardIdFileEnum.jsx";
import GAME_STATE from "../enum/GameStateEnum.jsx";
import PLAYER_ROLE from "../enum/PlayerRoleEnum.jsx";
import {ClearSelectMainCardStatus, EmitCardPlayed} from "../store/SocketGameEmittersSlice.jsx";
import {ClearCardInField, ClearStateForNextRound} from "../store/SocketGameListenersSlice.jsx";
import GAME_DELAY_ENUM from "../enum/GameDelayEnum.jsx";
import GUEST_CONFIG from "../enum/GuestConfigEnum.jsx";
// import { ChangeBGM } from '../store/BGMSlice.jsx';
import { ChangeBGM } from '../store/UserSlice.tsx';
import Vfx from '../components/Vfx.jsx';

export default function InGameInterface2()
{
    const { playFlipCard, playTrick, playFriend } = Vfx();

    const isJoinGuestMode = useSelector(state => state.gameStore.isJoinGuestMode);
    const userIdCookie = useSelector(state => state.userStore.userId)
    const userId = isJoinGuestMode ? GUEST_CONFIG.UID : userIdCookie
    const playersInGame = useSelector(state => state.gameStore.playersInGame)
    const isGameStarted = useSelector(state => state.socketGameListenersStore.isGameStarted)
    const cardInHand = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.thisPlayer?.cardIds) ?? []
    const gameRoundState = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.gameRoundState) ?? GAME_STATE.NOT_STARTED
    const gameplayState = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.gameplayState) ?? GAME_STATE.NOT_STARTED
    const isPlayerTurn = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.thisPlayerActions?.isPlayerTurn) ?? false
    const playersAuctionDetail = useSelector(state => state.socketGameListenersStore.playersAuctionDetail)
    const highestAuctionPlayerId = useSelector(state => state.socketGameListenersStore.highestAuctionPlayerId)
    const winnerAuctionId = useSelector(state => state.socketGameListenersStore.winnerAuctionId)
    const friendCard = useSelector(state => state.socketGameListenersStore.friendCard)
    const trumpSuit = useSelector(state => state.socketGameListenersStore.trumpSuit)
    const cardsPlayerCanPlay = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.thisPlayerActions?.cardsPlayerCanPlay) ?? []
    const cardsInField = useSelector(state => state.socketGameListenersStore.cardsInField)
    const isFriendAppeared = useSelector(state => state.socketGameEmittersStore.gameStateFromServer?.isFriendAppeared) ?? false
    const roundFinishedResult = useSelector(state => state.socketGameListenersStore.roundFinishedResult)
    const gameFinishedResult = useSelector(state => state.socketGameListenersStore.gameFinishedResult)
    const scoreCardIds = useSelector(state => state.socketGameEmittersStore.scoreCardIds)

    const dispatch = useDispatch()

    const offset = 20
    const numCardInHand = cardInHand.length ?? 0
    const picStyles = { "width": `${Math.min(100 / (numCardInHand), 100 / 9)}%` }
    const cardInHandMap = [...cardInHand].sort(SortCardCustomComparator).map((cardId)=> {
        return  {
            src:"..\\SVG-cards-1.3\\" + CARD_ID_FILE.cardIds[cardId],
            id : cardId
        }
    })
    const cardInFiledMap = cardsInField.map((cardId)=> {
        // console.log("card",cardId)
        // console.log(cardsInField)
        // console.log(cardsInField.playerId)
        return  {
            src:"..\\SVG-cards-1.3\\" + CARD_ID_FILE.cardIds[cardId.cardId],
            id : cardId,
            order : cardId.playerOrder
        }
    })
    function SortCardCustomComparator(a, b){
        const rankA = a.charAt(0);
        const suitA = a.charAt(1);
        const rankB = b.charAt(0);
        const suitB = b.charAt(1);

        const suitOrder = { 'H': 0, 'C': 1, 'D': 2, 'S': 3 };
        if (suitOrder[suitA] !== suitOrder[suitB]) {
            return suitOrder[suitA] - suitOrder[suitB];
        }
        const rankOrder = '23456789TJQKA';
        const rankIndexA = rankOrder.indexOf(rankA);
        const rankIndexB = rankOrder.indexOf(rankB);
        if (rankIndexA !== rankIndexB) {
            return rankIndexA - rankIndexB;
        }
        return a.localeCompare(b);
    }
    const isAfterMainCardSelected = gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.STARTED && winnerAuctionId !== null
    const [isWaitingDelayLastCard, setIsWaitingDelayLastCard] = useState(false)
    const isBidding = gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.NOT_STARTED && !isWaitingDelayLastCard
    const isSelectingCard = gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.STARTED && winnerAuctionId === null
    const trickFinishedResult = useSelector(state => state.socketGameListenersStore.trickFinishedResult)
    const [isShowTrickFinishedAlert, setIsShowTrickFinishedAlert] = useState(false)
    const [isShowFriendAppearedAlert, setIsShowFriendAppearedAlert] = useState(false)
    const [isFriendAppearFirstTime, setIsFriendAppearFirstTime] = useState(true)
    const [isShowSummaryScore, setIsShowSummaryScore] = useState(false)
    const [isShowRoundFinishedAlert, setIsShowRoundFinishedAlert] = useState(false)
    const [isShowScoreCard, setIsShowScoreCard] = useState(false)
    const [isShowGameFinishedPopup, setIsShowGameFinishedPopup] = useState(false)

    const [disableTimer, setDisableTimer] = useState(false)

    // useEffect(() => {
    //     if (isAfterMainCardSelected) { 
    //         dispatch(ChangeBGM("InGame"))
    //     }
    // }, [isAfterMainCardSelected])

    useEffect(() => {
        dispatch(ChangeBGM("InGameIntro"))
        // dispatch(ChangeBGM("InGame"))
    }, [])

    /// open scorecard
    useEffect(() => {
        if(scoreCardIds){
            setIsShowScoreCard(true)
        }
    }, [scoreCardIds]);

    useEffect(() => {
        if (cardsInField && cardsInField?.length !== 0) {
            playFlipCard()
            // stopTimeout()
        }
    }, [cardsInField])

    /// Show Summary Score, RoundFinishedAlert when Finished Round
    useEffect(() => {
        if(roundFinishedResult){
            setDisableTimer(true)
            setIsWaitingDelayLastCard(true)
            setTimeout(() => {
                setIsShowRoundFinishedAlert(true);
                const firstTimeout = setTimeout(() => {
                    playTrick();
                    setIsShowRoundFinishedAlert(false);
                    setIsShowSummaryScore(true)
                }, GAME_DELAY_ENUM.ROUND_FINISHED_IN_SEC * 1000)
                const secondTimeout  = setTimeout(() => {
                    playTrick();
                    setIsShowSummaryScore(false);
                    setDisableTimer(false)
                    dispatch(ClearStateForNextRound())
                    dispatch(ClearSelectMainCardStatus())
                    setIsWaitingDelayLastCard(false)
                }, (GAME_DELAY_ENUM.ROUND_FINISHED_IN_SEC + GAME_DELAY_ENUM.SUMMARY_SCORE_IN_SEC) * 1000);
                setIsFriendAppearFirstTime(true);
                return () => {
                    clearTimeout(firstTimeout);
                    clearTimeout(secondTimeout);
                }
            }, GAME_DELAY_ENUM.AFTER_LAST_CARD * 1000);
        }
    }, [roundFinishedResult]);

    /// Game Finished popup
    useEffect(() => {
        if (gameFinishedResult){
            setDisableTimer(true)
            setIsWaitingDelayLastCard(true)
            setTimeout(() => {
                setIsShowRoundFinishedAlert(true);
                playTrick();
                const firstTimeout = setTimeout(() => {
                    setIsShowRoundFinishedAlert(false);
                    setIsWaitingDelayLastCard(false);
                    setDisableTimer(false)
                    setIsShowGameFinishedPopup(true);
                }, GAME_DELAY_ENUM.ROUND_FINISHED_IN_SEC * 1000)
                return () => {
                    clearTimeout(firstTimeout);
                }
            }, GAME_DELAY_ENUM.AFTER_LAST_CARD * 1000);
        }
    }, [gameFinishedResult]);

    /// show friend appeared alert
    useEffect(() => {
        if(isFriendAppeared && isFriendAppearFirstTime ){
            playFriend();
            setIsFriendAppearFirstTime(false);
            setIsShowFriendAppearedAlert(true);
            const timeoutId = setTimeout(() => {
                setIsShowFriendAppearedAlert(false);
            }, GAME_DELAY_ENUM.FRIEND_APPEAR_IN_SEC * 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [isFriendAppeared]);

    /// show trick finish alert on time limit
    useEffect(() => {
        // console.log('test')
        if(trickFinishedResult){
            setDisableTimer(true)
            setIsWaitingDelayLastCard(true)
            setTimeout(() => {
                playTrick();
                setIsWaitingDelayLastCard(false)
                setIsShowTrickFinishedAlert(true);
                const timeoutId = setTimeout(() => {
                    setDisableTimer(false)
                    setIsShowTrickFinishedAlert(false);
                    dispatch(ClearCardInField())
                }, GAME_DELAY_ENUM.TRICK_FINISHED_IN_SEC * 1000);
                return () => clearTimeout(timeoutId);
            }, GAME_DELAY_ENUM.AFTER_LAST_CARD * 1000);
        }
    }, [trickFinishedResult]);

    const HandlePlayCard = (id)=>{
        playFlipCard();
        dispatch(EmitCardPlayed({cardId: id}))
    }

    // const componentStyles = {
    //     position: 'fixed',
    //     top: 0,
    //     left: 0,
    //     width: '100%',
    //     zIndex: 1000,
    // };
    function FindPlayerBidScore(thisPlayerId){
        return playersAuctionDetail.filter(a => a.playerId === thisPlayerId)?.at(0)?.auctionPoint ?? null
    }
    function FindPlayerAuctionPass(thisPlayerId){
        return playersAuctionDetail.filter(a => a.playerId === thisPlayerId)?.at(0)?.isPass ?? false
    }
    function getBorderColor(orderStyled){
        // console.log("Oreder ",orderStyled)
        return orderStyled === 0 ? '1px solid #67a8e4' : orderStyled === 1 ? '1px solid #7F27FF' : orderStyled === 2 ? '1px solid #eb9dee' :orderStyled === 3 ? '1px solid #f3e962' : '1px solid black';    
    }
    function getShadowColor (orderStyled){
        return orderStyled === 0 ? '0px 0px 1rem #67a8e4,inset 0 0 1.5rem #67a8e4' : orderStyled === 1 ? '0px 0px 1rem #7F27FF,inset 0 0 1rem #7F27FF' : orderStyled === 2 ? '0px 0px 1rem #eb9dee,inset 0 0 0.5rem #eb9dee' :orderStyled === 3 ? '0px 0px 1rem #f3e962,inset 0 0 0.5rem #f3e962' : '0 0 1rem #0000,inset 0 0 0.5rem #0000';
    }
    return (
        
        <div className='background-image' >

            { isGameStarted ? <WaitingPlayer isOpen={false}/> : <WaitingPlayer isOpen={true} /> }
            

            <div className="content">
            
            {/* <section className='mid'>
                        <BidCard />
                    </section> */}

                <section className='top' >
                    
                    <LobbyInfo />
                    <FriendCard cardName={CARD_ID_FILE.cardIds[friendCard]}/>
                    <TrumpCard  cardName={CARD_ID_FILE.suitsOnly[trumpSuit]}/>
                    <SettingsIcon className='setting' sx={{ fontSize: 50 }} />

                    {
                        isSelectingCard && userId === highestAuctionPlayerId
                        && <SelectCard />
                    }
                    {
                        isSelectingCard && userId !== highestAuctionPlayerId
                        && <WaitingSelectMainCard />
                    }
                    { isShowTrickFinishedAlert && <TrickFinishedAlert /> }
                    { isShowFriendAppearedAlert && <FriendAppearedAlert /> }
                    { isShowRoundFinishedAlert && <RoundFinishedAlert /> }
                    { isShowSummaryScore &&
                        <div className="popup">
                                <SummaryScore isShowButton={false}/>
                        </div>
                    }
                    { isShowScoreCard &&
                        <div className="popup">
                            {/* <div className="popup-inner"> */}
                                <CardTable setIsShowScoreCard={setIsShowScoreCard}/>
                            {/* </div> */}
                        </div>
                    }
                    { isShowGameFinishedPopup &&
                        <div className="popup">
                                <SummaryScore isShowButton={true} setIsShowGameFinishedPopup={setIsShowGameFinishedPopup} />
                        </div>
                    }

                </section>
                <section className='left' >
                    {(
                        playersInGame?.players[2] && <PlayerCard2 name={playersInGame.players[2].username} isLeft={true}
                                                                  isBidding={isBidding}
                                                                  isInLobby={!isGameStarted}
                                                                  bidScore={FindPlayerBidScore(playersInGame.players[2].id)}
                                                                  isPass={FindPlayerAuctionPass(playersInGame.players[2].id)}
                                                                  isTop={true}
                                                                  role = {playersInGame.players[2].isOwner ? PLAYER_ROLE.HOST : PLAYER_ROLE.NORMAL}
                                                                  isOwnerReadyButton={playersInGame?.players[2]?.id === userId}
                                                                  isReady={playersInGame.players[2].isReady}
                                                                  userId={playersInGame.players[2].id}
                                                                  imgUrl={playersInGame.players[2].imagePath}
                                                                  isBot={playersInGame.players[2].isBot}
                                                                  botLevel={playersInGame.players[2].botLevel}
                                                                  disableTimer={disableTimer}
                                                                  orderStyled={2}
                        />
                    )}
                    {(
                        playersInGame?.players[1] && <PlayerCard2 name={playersInGame.players[1].username} isLeft={true}
                                                                  isBidding={isBidding}
                                                                  isInLobby={!isGameStarted}
                                                                  bidScore={FindPlayerBidScore(playersInGame.players[1].id)}
                                                                  isPass={FindPlayerAuctionPass(playersInGame.players[1].id)}
                                                                  role = {playersInGame.players[1].isOwner ? PLAYER_ROLE.HOST : PLAYER_ROLE.NORMAL}
                                                                  isOwnerReadyButton={playersInGame?.players[1]?.id === userId}
                                                                  isReady={playersInGame.players[1].isReady}
                                                                  userId={playersInGame.players[1].id}
                                                                  imgUrl={playersInGame.players[1].imagePath}
                                                                  isBot={playersInGame.players[1].isBot}
                                                                  botLevel={playersInGame.players[1].botLevel}
                                                                  disableTimer={disableTimer}
                                                                  orderStyled={1}
                        />
                    )}
                </section>
                <section className='right'>
                    {(
                        playersInGame?.players[3] && <PlayerCard2 name={playersInGame.players[3].username} isLeft={false}
                                                                  isBidding={isBidding}
                                                                  isInLobby={!isGameStarted}
                                                                  bidScore={FindPlayerBidScore(playersInGame.players[3].id)}
                                                                  isPass={FindPlayerAuctionPass(playersInGame.players[3].id)}
                                                                  isTop={true}
                                                                  role = {playersInGame.players[3].isOwner ? PLAYER_ROLE.HOST : PLAYER_ROLE.NORMAL}
                                                                  isOwnerReadyButton={playersInGame?.players[3]?.id === userId}
                                                                  isReady={playersInGame.players[3].isReady}
                                                                  userId={playersInGame.players[3].id}
                                                                  imgUrl={playersInGame.players[3].imagePath}
                                                                  isBot={playersInGame.players[3].isBot}
                                                                  botLevel={playersInGame.players[3].botLevel}
                                                                  disableTimer={disableTimer}
                                                                  orderStyled={3}
                        />
                    )}
                    {(
                        playersInGame?.players[0] && <PlayerCard2 name={playersInGame.players[0].username} isLeft={false}
                                                                  isBidding={isBidding}
                                                                  isInLobby={!isGameStarted}
                                                                  bidScore={FindPlayerBidScore(playersInGame.players[0].id)}
                                                                  isPass={FindPlayerAuctionPass(playersInGame.players[0].id)}
                                                                  role = {playersInGame.players[0].isOwner ? PLAYER_ROLE.HOST : PLAYER_ROLE.NORMAL}
                                                                  isOwnerReadyButton={playersInGame?.players[0]?.id === userId}
                                                                  isReady={playersInGame.players[0].isReady}
                                                                  userId={playersInGame.players[0].id}
                                                                  imgUrl={playersInGame.players[0].imagePath}
                                                                  isBot={playersInGame.players[0].isBot}
                                                                  botLevel={playersInGame.players[0].botLevel}
                                                                  disableTimer={disableTimer}
                                                                  orderStyled={0}
                        />
                    )}
                </section>

                {
                    gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.NOT_STARTED && isPlayerTurn && !isWaitingDelayLastCard
                    && <section className='mid'>
                        <BidCard />
                    </section>
                }

                <figure className='bot' style={{ paddingInlineStart: `${(numCardInHand - 1) * offset}px` }}>
                    {
                        (isSelectingCard || isAfterMainCardSelected || isBidding) &&
                        cardInHandMap.map((e, i) => < CardInHand key={i} src={e.src} clickFunc={HandlePlayCard}//"zIndex"
                                                               styles={{ 
                                                                   ...picStyles,
                                                                   "right": i * offset,
                                                                   "filter":cardsPlayerCanPlay.some(cardId => cardId === e.id) && !isWaitingDelayLastCard ? "opacity(100%)" : "opacity(40%)",
                                                                   "zIndex":cardsPlayerCanPlay.some(cardId => cardId === e.id) && !isWaitingDelayLastCard ? "50000" : "40000",
                                                                   "pointerEvents": cardsPlayerCanPlay.some(cardId => cardId === e.id) && !isWaitingDelayLastCard ? "auto" : "none",
                                                                    }}
                                                                   
                                                               id = {e.id}
                        />)
                    }
                </figure>
                {
                    (isAfterMainCardSelected || isWaitingDelayLastCard) && <section className='mid'> 
                            {cardInFiledMap.map((e, i)=>
                            <img key={i} src={e.src} alt=""  className='cardOnTable' style={{
                                border: getBorderColor(e.id.order),
                                boxShadow: getShadowColor(e.id.order),
                                // zIndex: 10000,
                            }}/>
                            ) }
                             {/* {cardInFiledMap.map((e, i)=>
                            <div className='shadowtest' key={i}>
                                <img  src={e.src} alt=""  className='cardOnTable' style={{ border: getBorderColor(e.id.order) }} />
                                <div className='borderShadow'></div>
                            </div>
                            ) } */}
                    </section>
                }
                < SlideBar />
            </div>
        </div>
    )
}

//getBorderColor
//border: getBorderColor(e.order) , boxShadow:getShadowColor(e.order)