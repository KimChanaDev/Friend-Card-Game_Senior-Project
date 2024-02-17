import "./WaitingPlayer.css"
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {DisconnectFromSocket} from "../../store/SocketSlice.jsx";
import {ResetPlayersInGame} from "../../store/GameSlice.jsx";
import {ResetAllListenerState} from "../../store/SocketGameListenersSlice.jsx";
import {SetPage} from "../../store/PageStateSlice.jsx";
import PAGE_STATE from "../../enum/PageStateEnum.jsx";
import {EmitAddBotPlayer, EmitStartGame} from "../../store/SocketGameEmittersSlice.jsx";
import { AddNStartBotButton,QuitBotButton } from "./WaitingPlayer.styled.ts";
import BOT_LEVEL from "../../enum/BotLevelEnum.jsx";

WaitingPlayer.propTypes = {
    isOpen: PropTypes.bool,
}
export default function WaitingPlayer({isOpen}){
    const isOwnerRoom = useSelector(state => state.gameStore.playersInGame?.thisPlayer?.isOwner) ?? false
    const playersInGame = useSelector(state => state.gameStore.playersInGame)
    const dispatch = useDispatch()
    function AddBot(){
        const inputBotLevel = prompt('Bot Level Here (0 for Easy, 1 for Medium, 2 for Hard)');
        const inputBotLevelNumber = parseInt(inputBotLevel)
        if(inputBotLevelNumber !== BOT_LEVEL.EASY_BOT && inputBotLevelNumber !== BOT_LEVEL.MEDIUM_BOT && inputBotLevelNumber !== BOT_LEVEL.HARD_BOT){
            return
        }
        dispatch(EmitAddBotPlayer({botLevel: inputBotLevelNumber}))
    }
    function StartGame() {
        dispatch(EmitStartGame())
    }

    function QuitLobby(){
        const response = confirm("Quit lobby")
        if(response) {
            dispatch(DisconnectFromSocket())
            dispatch(ResetPlayersInGame())
            dispatch(ResetAllListenerState())
            dispatch(SetPage({ pageState: PAGE_STATE.MENU }))
        }
    }

    // const componentStyles = {
    //     position: 'fixed',
    //     top: '50%',
    //     left: '50%',
    //     transform: 'translate(-50%, -50%)',
    //     width: '300px', // Set the desired width
    //     height: '200px', // Set the desired height
    //     backgroundColor: '#f0f0f0', // Optional: add styling for background color or other styles
    //     border: '1px solid #ccc', // Optional: add styling for borders
    //     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: add a box shadow
    //     zIndex: 10000, // Optional: set a z-index to control stacking order
    // };
    return (
        <>
            {isOpen && (
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
        </>
    )
}