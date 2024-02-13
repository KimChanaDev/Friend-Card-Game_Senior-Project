import './SelectCard.css'
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {EmitSelectMainCard} from "../store/SocketGameEmittersSlice.jsx";
import SOCKET_STATUS from "../enum/SocketStatusEnum.jsx";
function SelectCard() {
    const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'J', 'Q', 'K', 'A'];
    const [friendCardSelected, setFriendCardSelected] = useState("")
    const [trumpSelected, setTrumpSelected] = useState("")
    const selectMainCardStatus = useSelector(state => state.socketGameEmittersStore.selectMainCardStatus)
    const dispatch = useDispatch()

    function RenderCardValueRowNumbers(suit, className){
        return cardValues.map((value, index) => (
            <td key={index} className={`${className} ${value === friendCardSelected.charAt(0) && suit === friendCardSelected.charAt(1) ? "selected" : ""} `}>
                <button onClick={() => HandleCardValueClicked(suit, value)}>{value}</button>
            </td>
        ))
    }
    function HandleCardValueClicked(suit, value){
        setFriendCardSelected(value+suit)
    }
    function HandleSuitClicked(suit){
        setTrumpSelected(suit)
    }
    function HandleConfirm(){
        dispatch(EmitSelectMainCard({
            trumpSuit: trumpSelected,
            friendCard: friendCardSelected
        }))
    }

    return (
        <>
            {
                selectMainCardStatus !== SOCKET_STATUS.SUCCESS &&
                <div className="popup_selectcard">
                    {/*  relative overflow-x-auto select_table border-double border-4 border-gray-600*/}
                    <div className="selectcard">
                        <table className="table-selectcard">
                            <thead>
                            <tr>
                                <th colSpan={1} scope="col" className='suite-header'>
                                    Suite
                                </th>
                                <th colSpan={12} scope="col" className='number-header'>
                                    Select Friend Card Number
                                </th>
                                <th colSpan={1} scope="col" className='trump-header'>
                                    Select TRUMP Card Number
                                </th>

                            </tr>
                            </thead>
                            <tbody>
                            <tr className=" border-b border-black">
                                <th scope="row" className="suit-symbol">
                                    ♣️
                                </th>
                                {RenderCardValueRowNumbers("C","px-6 py-4")}
                                <td colSpan={3} className={`${trumpSelected === "C" && "selected"}`}>
                                    <button onClick={() => HandleSuitClicked("C")}>♣️</button>
                                </td>
                            </tr>

                            <tr className=" border-b  border-black">
                                <th scope="row" className="suit-symbol">
                                    ♥️
                                </th>
                                {RenderCardValueRowNumbers("H", "px-6 py-4")}
                                <td colSpan={3} className={`${trumpSelected === "H" && "selected"}`}>
                                    <button onClick={() => HandleSuitClicked("H")}>♥️</button>
                                </td>
                            </tr>

                            <tr className=" border-b border-black">
                                <th scope="row" className="suit-symbol">
                                    ♦️
                                </th>
                                {RenderCardValueRowNumbers("D", "px-6 py-4")}
                                <td colSpan={3} className={`${trumpSelected === "D" && "selected"}`}>
                                    <button onClick={() => HandleSuitClicked("D")}>♦️</button>
                                </td>
                            </tr>

                            <tr className=" border-b border-black">
                                <th scope="row" className="suit-symbol">
                                    ♠️
                                </th>
                                {RenderCardValueRowNumbers("S", "px-6 py-4")}
                                <td colSpan={3} className={`${trumpSelected === "S" && "selected"}`}>
                                    <button onClick={() => HandleSuitClicked("S")}>♠️</button>
                                </td>
                            </tr>

                            </tbody>
                        </table>

                        <button className="confirm_button"
                                onClick={() => HandleConfirm()}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            }
        </>
    )
}

export default SelectCard