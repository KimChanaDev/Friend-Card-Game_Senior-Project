import './BidCard.css'

function BidCard() {
    return (
        <ol className='bid_group'>
            <li className='bid_card'><button>55</button></li>
            <li className='bid_card'> <button>60</button></li>
            <li className='bid_card'><button>65</button></li>
            <li className='bid_card'> <button>70</button></li>
            <li className='bid_card'> <button>75</button></li>
            <li className='bid_card'> <button>80</button></li>
            <li className='bid_card'> <button>85</button></li>
            <li className='bid_card'> <button>90</button></li>
            <li className='bid_card'> <button>95</button></li>
            <li className='bid_card'> <button>100</button></li>
            <button class="bg-green-600 confirm_button hover:bg-green-900 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-800 rounded-2xl">
            confirm
            </button>
            <button class="bg-red-700 pass_button hover:bg-red-900 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-800 rounded-2xl">
            pass
          </button>
        </ol>
    )
}
export default BidCard
