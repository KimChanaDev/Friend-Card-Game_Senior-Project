import './CardTable.css'
function CardTable() {
    const cardName = '9_of_clubs.svg'
    const cardPath = "..\\public\\SVG-cards-1.3\\" + cardName
    return (
        <>
            <div class="relative overflow-x-auto score_table border-double border-4 border-gray-600">
                <table class="w-full text-sm text-left text-dark dark:text-gray-400">
                    <thead class="text-xs  uppercase ">
                        <tr >
                            <th colSpan={5} className='text-center text-white bg-black text-base'>
                                Score Card
                            </th>
                        </tr>

                    </thead>
                    <tbody>
                    <tr class="border-b dark:bg-gray-800 dark:border-gray-700 ">
                           
                           <td class="px-6 py-4">
                               <img src={cardPath} alt="" />
                           </td>
                           <td class="px-6 py-4">
                               <img src={cardPath} alt="" />
                           </td>
                           <td class="px-6 py-4">
                               <img src={cardPath} alt="" />
                           </td>
                           
                       </tr>
                        <tr class="border-b dark:bg-gray-800 dark:border-gray-700 ">
                           
                            <td class="px-6 py-4">
                                <img src={cardPath} alt="" />
                            </td>
                            <td class="px-6 py-4">
                                <img src={cardPath} alt="" />
                            </td>
                            <td class="px-6 py-4">
                                <img src={cardPath} alt="" />
                            </td>
                            
                        </tr>
                        <tr class="border-b dark:bg-gray-800 dark:border-gray-700 ">
                           
                           <td class="px-6 py-4">
                               <img src={cardPath} alt="" />
                           </td>
                           <td class="px-6 py-4">
                               <img src={cardPath} alt="" />
                           </td>
                           <td class="px-6 py-4">
                               <img src={cardPath} alt="" />
                           </td>
                           
                       </tr>
                       <tr class="border-b dark:bg-gray-800 dark:border-gray-700">
                           
                           <td class="px-6 py-4">
                               <img src={cardPath} alt="" />
                           </td>
                           <td class="px-6 py-4">
                               <img src={cardPath} alt="" />
                           </td>
                           <td class="px-6 py-4">
                               <img src={cardPath} alt="" />
                           </td>
                           
                       </tr>
                        
                    </tbody>
                </table>
                <button class=" close_button bg-black  text-white font-bold py-2 px-4 border rounded-3xl">
                    close
                </button>
            </div>
        </>
    )
}

export default CardTable