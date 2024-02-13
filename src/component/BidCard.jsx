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
                        onClick={() => HandleBidClick(bidValue)}
                    >
                        {bidValue}
                    </li>
                ))}

                <button
                    onClick={HandleConfirmClick}
                    className="bid_confirm"
                >
                    Confirm
                </button>

                <button
                    onClick={HandlePassClick}
                    className="bid_pass"
                >
                    Pass
                </button>
            </ol>
        </>
    )
}
export default BidCard
