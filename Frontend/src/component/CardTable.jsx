import './CardTable.css'
import {useSelector} from "react-redux";
import CARD_ID_FILE from "../enum/CardIdFileEnum.jsx";
function CardTable({setIsShowScoreCard}) {
    const scoreCardIds = useSelector(state => state.socketGameEmittersStore.scoreCardIds) ?? []

    function GetCardPath(cardId){
        return "..\\SVG-cards-1.3\\" + CARD_ID_FILE.cardIds[cardId]
    }
    function ThereIsScoreCard(cardId) {
        return scoreCardIds?.some(id => id === cardId)
    }
    function HandleClose(){
        setIsShowScoreCard(false)
    }
    return (
        <>
            <div className="popup-scorecard">
                <table className="table-scorecard">
                    <thead>
                        <tr >
                            <th colSpan={5} className=''>
                                Score Card
                            </th>
                        </tr>

                    </thead>
                    <tbody>
                    <tr className="scorecard-container">
                           <td>
                               <img src={GetCardPath("5S")} alt="" className={ThereIsScoreCard("5S")?'':'img-disable'}/>
                               {/* <img src={GetCardPath("5H")} alt="" className='img-disable'/> */}
                           </td>
                           <td>
                               {/* { ThereIsScoreCard("TS") && <img src={GetCardPath("TS")} alt="" /> } */}
                               <img src={GetCardPath("TS")} alt="" className={ThereIsScoreCard("TS")?'':'img-disable'}/>
                           </td>
                           <td>
                               {/* { ThereIsScoreCard("KS") && <img src={GetCardPath("KS")} alt="" /> } */}
                               <img src={GetCardPath("KS")} alt="" className={ThereIsScoreCard("KS")?'':'img-disable'}/>
                           </td>
                       </tr>

                       <tr className="scorecard-container">
                            <td>
                                {/* { ThereIsScoreCard("5H") && <img src={GetCardPath("5H")} alt="" /> } */}
                                <img src={GetCardPath("5H")} alt="" className={ThereIsScoreCard("5H")?'':'img-disable'}/>
                            </td>
                            <td>
                                {/* { ThereIsScoreCard("TH") && <img src={GetCardPath("TH")} alt="" /> } */}
                                <img src={GetCardPath("TH")} alt="" className={ThereIsScoreCard("TH")?'':'img-disable'}/>
                            </td>
                            <td>
                                {/* { ThereIsScoreCard("KH") && <img src={GetCardPath("KH")} alt="" /> } */}
                                <img src={GetCardPath("KH")} alt="" className={ThereIsScoreCard("KH")?'':'img-disable'}/>
                            </td>
                        </tr>

                        <tr className="scorecard-container">
                           <td>
                               {/* { ThereIsScoreCard("5D") && <img src={GetCardPath("5D")} alt="" /> } */}
                               <img src={GetCardPath("5D")} alt="" className={ThereIsScoreCard("5D")?'':'img-disable'}/>
                           </td>
                           <td>
                               {/* { ThereIsScoreCard("TD") && <img src={GetCardPath("TD")} alt="" /> } */}
                               <img src={GetCardPath("TD")} alt="" className={ThereIsScoreCard("TD")?'':'img-disable'}/>
                           </td>
                           <td>
                               {/* { ThereIsScoreCard("KD") && <img src={GetCardPath("KD")} alt="" /> } */}
                               <img src={GetCardPath("KD")} alt="" className={ThereIsScoreCard("KD")?'':'img-disable'}/>
                           </td>
                       </tr>

                       <tr className="scorecard-container">
                           <td>
                               {/* { ThereIsScoreCard("5C") && <img src={GetCardPath("5C")} alt="" /> } */}
                               <img src={GetCardPath("5C")} alt="" className={ThereIsScoreCard("5C")?'':'img-disable'}/>
                           </td>
                           <td>
                               {/* { ThereIsScoreCard("TC") && <img src={GetCardPath("TC")} alt="" /> } */}
                               <img src={GetCardPath("TC")} alt="" className={ThereIsScoreCard("TC")?'':'img-disable'}/>
                           </td>
                           <td>
                               {/* { ThereIsScoreCard("KC") && <img src={GetCardPath("KC")} alt="" /> } */}
                               <img src={GetCardPath("KC")} alt="" className={ThereIsScoreCard("KC")?'':'img-disable'}/>
                           </td>
                       </tr>
                    </tbody>
                </table>
                <div className='scorecard-button-container'>
                <button className="scorecard-button-close"
                        onClick={() => HandleClose()}
                >
                    CLOSE
                </button>
                </div>
                
            </div>
        </>
    )
}

export default CardTable