import '../ProfilePopup/ProfilePopUp.css'
import {useSelector} from "react-redux";

export default function TrickFinishedAlert(){
    const trickFinishedResult = useSelector(state => state.socketGameListenersStore.trickFinishedResult)
    function getBorderColor(orderStyled){ 
        return orderStyled === 0 ? '1px solid #67a8e4' : orderStyled === 1 ? '1px solid #7F27FF' : orderStyled === 2 ? '1px solid #eb9dee' :orderStyled === 3 ? '1px solid #f3e962' : '1px solid black';    
    }
    function getShadowColor (orderStyled){
        return orderStyled === 0 ? '0px 20px 1rem #67a8e4,inset 0 0 1.5rem #67a8e4' : orderStyled === 1 ? '0px 20px 1rem #7F27FF,inset 0 0 1rem #7F27FF' : orderStyled === 2 ? '0px 20px 1rem #eb9dee,inset 0 0 0.5rem #eb9dee' :orderStyled === 3 ? '0px 20px 1rem 1rem #f3e962,inset 0 0 0.5rem #f3e962' : '0 0 1rem #0000,inset 0 0 0.5rem #0000';
    }
    return (
        <div className="popup">
            <div className="popup-inner" style={{"border": getBorderColor(trickFinishedResult?.orderWinnerPosition) ,
                                                "boxShadow":getShadowColor(trickFinishedResult?.orderWinnerPosition)}} >
                <h2>{`Trick number : ${(trickFinishedResult?.trickNumber ?? 998) + 1}`}</h2>
                <h2>{`Winner name : ${trickFinishedResult?.winnerName}`}</h2>
                <h2>{`Winner Card : ${trickFinishedResult?.winnerCardId}`}</h2>
                <h2 style={{"color":"red"}}>{`Point Received : ${trickFinishedResult?.winnerReceivePoint}`}</h2>
                
            </div>
        </div>
    )
}