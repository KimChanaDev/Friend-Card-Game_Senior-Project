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
            <div className="relative overflow-x-auto score_table border-double border-4 border-gray-600">
                <table className="w-full text-sm text-left text-dark dark:text-gray-400">
                    <thead className="text-xs  uppercase ">
                        <tr >
                            <th colSpan={5} className='text-center text-white bg-black text-base'>
                                Score Card
                            </th>
                        </tr>

                    </thead>
                    <tbody>
                    <tr className="border-b dark:bg-gray-800 dark:border-gray-700 ">
                           <td className="px-6 py-4">
                               { ThereIsScoreCard("5S") && <img src={GetCardPath("5S")} alt="" /> }
                           </td>
                           <td className="px-6 py-4">
                               { ThereIsScoreCard("TS") && <img src={GetCardPath("TS")} alt="" /> }
                           </td>
                           <td className="px-6 py-4">
                               { ThereIsScoreCard("KS") && <img src={GetCardPath("KS")} alt="" /> }
                           </td>
                       </tr>

                        <tr className="border-b dark:bg-gray-800 dark:border-gray-700 ">
                            <td className="px-6 py-4">
                                { ThereIsScoreCard("5H") && <img src={GetCardPath("5H")} alt="" /> }
                            </td>
                            <td className="px-6 py-4">
                                { ThereIsScoreCard("TH") && <img src={GetCardPath("TH")} alt="" /> }
                            </td>
                            <td className="px-6 py-4">
                                { ThereIsScoreCard("KH") && <img src={GetCardPath("KH")} alt="" /> }
                            </td>
                        </tr>

                        <tr className="border-b dark:bg-gray-800 dark:border-gray-700 ">
                           <td className="px-6 py-4">
                               { ThereIsScoreCard("5D") && <img src={GetCardPath("5D")} alt="" /> }
                           </td>
                           <td className="px-6 py-4">
                               { ThereIsScoreCard("TD") && <img src={GetCardPath("TD")} alt="" /> }
                           </td>
                           <td className="px-6 py-4">
                               { ThereIsScoreCard("KD") && <img src={GetCardPath("KD")} alt="" /> }
                           </td>
                       </tr>

                       <tr className="border-b dark:bg-gray-800 dark:border-gray-700">
                           <td className="px-6 py-4">
                               { ThereIsScoreCard("5C") && <img src={GetCardPath("5C")} alt="" /> }
                           </td>
                           <td className="px-6 py-4">
                               { ThereIsScoreCard("TC") && <img src={GetCardPath("TC")} alt="" /> }
                           </td>
                           <td className="px-6 py-4">
                               { ThereIsScoreCard("KC") && <img src={GetCardPath("KC")} alt="" /> }
                           </td>
                       </tr>
                    </tbody>
                </table>
                <button className=" close_button bg-black  text-white font-bold py-2 px-4 border rounded-3xl"
                        onClick={() => HandleClose()}
                >
                    CLOSE
                </button>
            </div>
        </>
    )
}

export default CardTable