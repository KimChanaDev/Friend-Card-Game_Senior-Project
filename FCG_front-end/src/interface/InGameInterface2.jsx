import './SummaryScore.css'
import './IngameInterface.css'
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

export default function InGameInterface2()
{
    const [msg, setFooEvents] = useState({});
    const GameScore= msg['matchScore'] || []

    const userId = useSelector(state => state.userStore.userId)
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

    const offset = 25
    const numCardInHand = cardInHand.length ?? 0
    const picStyles = { "width": `${Math.min(100 / (numCardInHand), 100 / 9)}%` }
    const cardInHandMap = cardInHand.map((cardId)=> {
        return  {
            src:"..\\SVG-cards-1.3\\" + CARD_ID_FILE.cardIds[cardId],
            id : cardId
        }
    })
    const cardInFiledMap = cardsInField.map((cardId)=> {
        return  {
            src:"..\\SVG-cards-1.3\\" + CARD_ID_FILE.cardIds[cardId],
            id : cardId
        }
    })
    const isAfterMainCardSelected = gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.STARTED && winnerAuctionId !== null
    const trickFinishedResult = useSelector(state => state.socketGameListenersStore.trickFinishedResult)
    const [isShowTrickFinishedAlert, setIsShowTrickFinishedAlert] = useState(false)
    const [isShowFriendAppearedAlert, setIsShowFriendAppearedAlert] = useState(false)
    const [isFriendAppearFirstTime, setIsFriendAppearFirstTime] = useState(true)
    const [isShowSummaryScore, setIsShowSummaryScore] = useState(false)
    const [isShowRoundFinishedAlert, setIsShowRoundFinishedAlert] = useState(false)
    const [isShowScoreCard, setIsShowScoreCard] = useState(false)
    const [isShowGameFinishedPopup, setIsShowGameFinishedPopup] = useState(false)

    /// open scorecard
    useEffect(() => {
        if(scoreCardIds){
            setIsShowScoreCard(true)
        }
    }, [scoreCardIds]);

    /// Show Summary Score, RoundFinishedAlert when Finished Round
    useEffect(() => {
        if(roundFinishedResult){
            setIsShowRoundFinishedAlert(true);
            /// round finished shown 5 sec
            const firstTimeout = setTimeout(() => {
                setIsShowRoundFinishedAlert(false);
                setIsShowSummaryScore(true)
            }, 5000)
            /// summary shown 5 sec
            const secondTimeout  = setTimeout(() => {
                setIsShowSummaryScore(false);
                dispatch(ClearStateForNextRound())
                dispatch(ClearSelectMainCardStatus())
            }, 10000);
            return () => {
                clearTimeout(firstTimeout);
                clearTimeout(secondTimeout);
            }
        }
    }, [roundFinishedResult]);

    /// Game Finished popup
    useEffect(() => {
        if (gameFinishedResult){
            setIsShowGameFinishedPopup(true);
        }
    }, [gameFinishedResult]);

    /// show friend appeared alert
    useEffect(() => {
        if(isFriendAppeared && isFriendAppearFirstTime ){
            setIsFriendAppearFirstTime(false);
            setIsShowFriendAppearedAlert(true);
            const timeoutId = setTimeout(() => {
                setIsShowFriendAppearedAlert(false);
            }, 3000); // 3 sec
            return () => clearTimeout(timeoutId);
        }
    }, [isFriendAppeared]);

    /// show trick finish alert on time limit
    useEffect(() => {
        if(trickFinishedResult){
            setIsShowTrickFinishedAlert(true);
            const timeoutId = setTimeout(() => {
                setIsShowTrickFinishedAlert(false);
                dispatch(ClearCardInField())
            }, 3000); // 3 sec
            return () => clearTimeout(timeoutId);
        }
    }, [trickFinishedResult]);

    const HandlePlayCard = (id)=>{
        dispatch(EmitCardPlayed({cardId: id}))
    }

    const componentStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
    };
    function FindPlayerBidScore(thisPlayerId){
        return playersAuctionDetail.filter(a => a.playerId === thisPlayerId)?.at(0)?.auctionPoint ?? null
    }
    function FindPlayerAuctionPass(thisPlayerId){
        return playersAuctionDetail.filter(a => a.playerId === thisPlayerId)?.at(0)?.isPass ?? false
    }
    return (
        <div style={componentStyles}>
            <div className="background-image">

            </div>

            { isGameStarted ? <WaitingPlayer isOpen={false}/> : <WaitingPlayer isOpen={true} /> }

            <div className="content">
                <section className='top' >'
                    <LobbyInfo />
                    <FriendCard cardName={CARD_ID_FILE.cardIds[friendCard]}/>
                    <TrumpCard  cardName={CARD_ID_FILE.suits[trumpSuit]}/>
                    {/*<CardTable/>*/}
                    <SettingsIcon className='setting' sx={{ fontSize: 50 }} />

                    {
                        gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.STARTED && userId === highestAuctionPlayerId
                        && <SelectCard />
                    }
                    {
                        gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.STARTED && userId !== highestAuctionPlayerId && winnerAuctionId === null
                        && <WaitingSelectMainCard />
                    }
                    { isShowTrickFinishedAlert && <TrickFinishedAlert /> }
                    { isShowFriendAppearedAlert && <FriendAppearedAlert /> }
                    { isShowRoundFinishedAlert && <RoundFinishedAlert /> }
                    { isShowSummaryScore &&
                        <div className="popup">
                            <div className="popup-inner">
                                <SummaryScore isShowButton={false}/>
                            </div>
                        </div>
                    }
                    { isShowScoreCard &&
                        <div className="popup">
                            <div className="popup-inner">
                                <CardTable setIsShowScoreCard={setIsShowScoreCard}/>
                            </div>
                        </div>
                    }
                    { isShowGameFinishedPopup &&
                        <div className="popup">
                            <div className="popup-inner">
                                <SummaryScore isShowButton={true} setIsShowGameFinishedPopup={setIsShowGameFinishedPopup} />
                            </div>
                        </div>
                    }

                </section>
                <section className='left' >
                    {(
                        playersInGame?.players[1] && <PlayerCard2 name={playersInGame.players[1].username} isLeft={true}
                                                                  isBidding={gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.NOT_STARTED}
                                                                  isInLobby={!isGameStarted}
                                                                  bidScore={FindPlayerBidScore(playersInGame.players[1].id)}
                                                                  isPass={FindPlayerAuctionPass(playersInGame.players[1].id)}
                                                                  // isPlay={turn[0]}
                                                                  isTop={true}
                                                                  score={GameScore[0]}
                                                                  role = {playersInGame.players[1].isOwner ? PLAYER_ROLE.HOST : PLAYER_ROLE.NORMAL}
                                                                  isOwnerReadyButton={playersInGame?.players[1]?.id === userId}
                                                                  isReady={playersInGame.players[1].isReady}
                                                                  userId={playersInGame.players[1].id}
                        />
                    )}
                    {(
                        playersInGame?.players[3] && <PlayerCard2 name={playersInGame.players[3].username} isLeft={true}
                                                                  isBidding={gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.NOT_STARTED}
                                                                  isInLobby={!isGameStarted}
                                                                  bidScore={FindPlayerBidScore(playersInGame.players[3].id)}
                                                                  isPass={FindPlayerAuctionPass(playersInGame.players[3].id)}
                                                                  // isPlay={turn[1]}
                                                                  score={GameScore[1]}
                                                                  role = {playersInGame.players[3].isOwner ? PLAYER_ROLE.HOST : PLAYER_ROLE.NORMAL}
                                                                  isOwnerReadyButton={playersInGame?.players[3]?.id === userId}
                                                                  isReady={playersInGame.players[3].isReady}
                                                                  userId={playersInGame.players[3].id}
                        />
                    )}
                </section>
                <section className='right'>
                    {(
                        playersInGame?.players[2] && <PlayerCard2 name={playersInGame.players[2].username} isLeft={false}
                                                                  isBidding={gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.NOT_STARTED}
                                                                  isInLobby={!isGameStarted}
                                                                  bidScore={FindPlayerBidScore(playersInGame.players[2].id)}
                                                                  isPass={FindPlayerAuctionPass(playersInGame.players[2].id)}
                                                                  // isPlay={turn[3]}
                                                                  score={GameScore[3]}
                                                                  role = {playersInGame.players[2].isOwner ? PLAYER_ROLE.HOST : PLAYER_ROLE.NORMAL}
                                                                  isOwnerReadyButton={playersInGame?.players[2]?.id === userId}
                                                                  isReady={playersInGame.players[2].isReady}
                                                                  userId={playersInGame.players[2].id}
                        />
                    )}
                    {(
                        playersInGame?.players[0] && <PlayerCard2 name={playersInGame.players[0].username} isLeft={false}
                                                                  isBidding={gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.NOT_STARTED}
                                                                  isInLobby={!isGameStarted}
                                                                  bidScore={FindPlayerBidScore(playersInGame.players[0].id)}
                                                                  isPass={FindPlayerAuctionPass(playersInGame.players[0].id)}
                                                                  // isPlay={turn[2]}
                                                                  score={GameScore[2]}
                                                                  role = {playersInGame.players[0].isOwner ? PLAYER_ROLE.HOST : PLAYER_ROLE.NORMAL}
                                                                  isOwnerReadyButton={playersInGame?.players[0]?.id === userId}
                                                                  isReady={playersInGame.players[0].isReady}
                                                                  userId={playersInGame.players[0].id}
                        />
                    )}
                </section>

                {
                    gameRoundState === GAME_STATE.STARTED && gameplayState === GAME_STATE.NOT_STARTED && isPlayerTurn
                    && <section className='mid'>
                        <BidCard />
                    </section>
                }


                <figure className='bot' style={{ paddingInlineStart: `${(numCardInHand - 1) * offset}px` }}>
                    {
                        cardInHandMap.map((e, i) => < CardInHand key={i} src={e.src} clickFunc={HandlePlayCard}
                                                               styles={{
                                                                   ...picStyles,
                                                                   "right": i * offset,
                                                                   "border":cardsPlayerCanPlay.some(cardId => cardId === e.id) ? "3px solid green": "0px solid green"}}
                                                               id = {e.id}
                        />)
                    }
                </figure>

                {
                    isAfterMainCardSelected && <section className='mid'>
                        {cardInFiledMap.map((e, i)=><img key={i} src={e.src} alt="" />)}
                    </section>
                }
                < SlideBar />
            </div>
        </div>
    )
}