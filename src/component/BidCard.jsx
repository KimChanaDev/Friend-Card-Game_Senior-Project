import './BidCard.css'
import {useState} from "react";
import {useDispatch} from "react-redux";
import {EmitAuction} from "../store/SocketGameEmittersSlice.jsx";

function BidCard() {
    const [selectedBid, setSelectedBid] = useState(null);
    const dispatch = useDispatch()
    function HandleBidClick (bidValue) {
        setSelectedBid(bidValue);
    }
    function HandleConfirmClick () {
        dispatch(EmitAuction({
            auctionPass: false,
            auctionPoint: selectedBid
        }))
    }
    function HandlePassClick(){
        dispatch(EmitAuction({
            auctionPass: true
        }))
    }

    return (
        <>
            <ol className='bid_group'>
                {[55, 60, 65, 70, 75, 80, 85, 90, 95, 100].map((bidValue) => (
                    <li
                        key={bidValue}
                        className={`${selectedBid === bidValue ? 'selected' : 'bid_card'}`}
                    >
                        <button onClick={() => HandleBidClick(bidValue)}>{bidValue}</button>
                    </li>
                ))}

                <button
                    onClick={HandleConfirmClick}
                    className="bg-green-600 confirm_button hover:bg-green-900 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-800 rounded-2xl"
                >
                    Confirm
                </button>

                <button
                    onClick={HandlePassClick}
                    className="bg-red-700 pass_button hover:bg-red-900 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-800 rounded-2xl"
                >
                    Pass
                </button>
            </ol>
        </>
    )
}
export default BidCard
