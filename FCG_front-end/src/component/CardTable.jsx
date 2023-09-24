import './CardTable.css'

function CardTable() {
    return (
        <table className='played_card text-xs text-center'>
            <tr>
                <td>♣️ </td>
                <td>5</td>
                <td>10</td>
                <td>K</td>

              
            </tr>
            <tr>
                <td>♠️</td>
                <td>5</td>
                <td>10</td>
                <td></td>
             
            </tr>
            <tr>
                <td className='text-red-600'>♦️</td>
                <td>5</td>
                <td></td>
                <td></td>
             
            </tr>
            <tr>
                <td className='text-red-600'>♥️</td>
                <td>5</td>
                <td>10</td>
                <td>K</td>
             
            </tr>
        </table>



    )
}
export default CardTable
