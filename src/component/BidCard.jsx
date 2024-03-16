import './BidCard.css'
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {EmitAuction} from "../store/SocketGameEmittersSlice.jsx";
import Vfx from '../components/Vfx.jsx';

function BidCard() {
    const { playButton } = Vfx();

    const [selectedBid, setSelectedBid] = useState(null);
    const dispatch = useDispatch()
    const highestAuctionPoint = useSelector(state => state.socketGameListenersStore.highestAuctionPoint)

    function HandleBidClick (bidValue) {
        setSelectedBid(bidValue);
    }
    function HandleConfirmClick () {
        playButton();
        dispatch(EmitAuction({
            auctionPass: false,
            auctionPoint: selectedBid
        }))
    }
    function HandlePassClick(){
        playButton();
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
                        className={`${selectedBid === bidValue ? 'selected' :  (bidValue <= highestAuctionPoint ? 'bid_card-disabled' : 'bid_card') }`}
                        onClick={bidValue <= highestAuctionPoint ? null : () => HandleBidClick(bidValue)}
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
