import "./WaitingPlayer.css"
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {DisconnectFromSocket} from "../../store/SocketSlice.jsx";
import {ResetPlayersInGame, SetIsJoinGuestMode} from "../../store/GameSlice.jsx";
import {ResetAllListenerState} from "../../store/SocketGameListenersSlice.jsx";
import {SetPage} from "../../store/PageStateSlice.jsx";
import PAGE_STATE from "../../enum/PageStateEnum.jsx";
import {EmitAddBotPlayer, EmitStartGame, ResetAllEmitterState} from "../../store/SocketGameEmittersSlice.jsx";
import { AddNStartBotButton,QuitBotButton } from "./WaitingPlayer.styled.ts";
import BOT_LEVEL from "../../enum/BotLevelEnum.jsx";
import { useState } from 'react'
import SelectBot from "../SelectBot/SelectBot.jsx";

WaitingPlayer.propTypes = {
    isOpen: PropTypes.bool,
}
export default function WaitingPlayer({isOpen}){
    const isOwnerRoom = useSelector(state => state.gameStore.playersInGame?.thisPlayer?.isOwner) ?? false
    const playersInGame = useSelector(state => state.gameStore.playersInGame)
    const isJoinGuestMode = useSelector(state => state.gameStore.isJoinGuestMode);
    const dispatch = useDispatch()
   
    const [isClickAddbot,setIsClickAddbot] = useState(false)
    
    function AddBot(){
        setIsClickAddbot(true)
        // const inputBotLevel = prompt('Bot Level Here (0 for Easy, 1 for Medium, 2 for Hard)');
        // const inputBotLevelNumber = parseInt(inputBotLevel)
        // if(inputBotLevelNumber !== BOT_LEVEL.EASY_BOT && inputBotLevelNumber !== BOT_LEVEL.MEDIUM_BOT && inputBotLevelNumber !== BOT_LEVEL.HARD_BOT){
        //     return
        // }
        // dispatch(EmitAddBotPlayer({botLevel: inputBotLevelNumber}))
    }

    // function inputBotLevelNumber(inputBotLevelNumber){
    //     inputBotLevelNumber = parseInt(inputBotLevel)
    //     if(inputBotLevelNumber !== BOT_LEVEL.EASY_BOT && inputBotLevelNumber !== BOT_LEVEL.MEDIUM_BOT && inputBotLevelNumber !== BOT_LEVEL.HARD_BOT){
    //         return
    //     }
    //     dispatch(EmitAddBotPlayer({botLevel: inputBotLevelNumber}))
    //     setIsClickAddbot(false)
    // }

    const inputBotLevelNumber = (inputBotLevelNumber)=>{
        inputBotLevelNumber = parseInt(inputBotLevelNumber)
        if(inputBotLevelNumber !== BOT_LEVEL.EASY_BOT && inputBotLevelNumber !== BOT_LEVEL.MEDIUM_BOT && inputBotLevelNumber !== BOT_LEVEL.HARD_BOT){
            return
        }
        dispatch(EmitAddBotPlayer({botLevel: inputBotLevelNumber}))
        setIsClickAddbot(false)
      }

    function StartGame() {
        dispatch(EmitStartGame())
    }

    function QuitLobby(){
        const response = confirm("Quit lobby")
        if(response) {
            dispatch(DisconnectFromSocket())
            dispatch(ResetPlayersInGame())
            if (isJoinGuestMode) dispatch(SetIsJoinGuestMode({isGuest: false}))
            dispatch(ResetAllListenerState())
            dispatch(ResetAllEmitterState())
            dispatch(SetPage({ pageState: PAGE_STATE.MENU }))
        }
    }

    return (
        <>
            {isOpen && !isClickAddbot && (
                <div className='menu_border'>
                    <p>
                        Waiting for Player
                    </p>
                    {/* <br/> */}
                    <div className="waiting-button">
                    {
                        playersInGame?.players?.length !== 4 && isOwnerRoom && <AddNStartBotButton
                            onClick={AddBot}
                        >Add Bot</AddNStartBotButton>
                    }
                    {
                        playersInGame?.players?.length === 4 && isOwnerRoom && <AddNStartBotButton
                            onClick={StartGame}
                            
                        >Start</AddNStartBotButton>
                    }
                    {/* <br/> */}
                    <QuitBotButton
                        onClick={QuitLobby}
                    >Quit Lobby</QuitBotButton>
                    </div>
                </div>
            )}

            {isOpen && isClickAddbot && (
                <SelectBot func={inputBotLevelNumber}/>
            )}


        </>
    )
}