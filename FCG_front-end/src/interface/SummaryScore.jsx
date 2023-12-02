import './SummaryScore.css'
function SummaryScore() {
    return (
        <>
            <div class="relative overflow-x-auto summary_table border-double border-4 border-gray-600">
                <table class="w-full text-sm text-left text-dark dark:text-gray-400">
                    <thead class="text-xs  uppercase ">
                        <tr >
                            <th colSpan={5} className='text-center text-white bg-black text-base'>
                                Game Summary
                            </th>
                        </tr>
                        <tr className='text-black'>
                            <th scope="col" class="px-6 py-3">
                                
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Player1
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Player2
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Player3
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Player4
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium  whitespace-nowrap dark:text-white">
                                Round 1
                            </th>
                            <td class="px-6 py-4">
                                0
                            </td>
                            <td class="px-6 py-4">
                                0 ⭐
                            </td>
                            <td class="px-6 py-4">
                                0 ✨
                            </td>
                            <td class="px-6 py-4">
                                0
                            </td>
                        </tr>
                        <tr class=" dark:bg-gray-800 border-b dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium  whitespace-nowrap dark:text-white">
                            Round 2
                            </th>
                            <td class="px-6 py-4">
                                0 ⭐
                            </td>
                            <td class="px-6 py-4">
                                0 ✨
                            </td>
                            <td class="px-6 py-4">
                                0
                            </td>
                            <td class="px-6 py-4">
                                0
                            </td>
                        </tr>
                        <tr class=" dark:bg-gray-800 border-b dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium  whitespace-nowrap dark:text-white">
                            Round 3
                            </th>
                            <td class="px-6 py-4">
                                0
                            </td>
                            <td class="px-6 py-4">
                                0
                            </td>
                            <td class="px-6 py-4">
                                0 ⭐
                            </td>
                            <td class="px-6 py-4">
                                0 ✨
                            </td>
                        </tr>
                        <tr class="dark:bg-gray-800 border-b dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium  whitespace-nowrap dark:text-white">
                            Round 4
                            </th>
                            <td class="px-6 py-4">
                                0
                            </td>
                            <td class="px-6 py-4">
                                0 ⭐
                            </td>
                            <td class="px-6 py-4">
                                0
                            </td>
                            <td class="px-6 py-4">
                                10 ✨
                            </td>
                        </tr>
                        <tr class=" dark:bg-gray-800">
                            <th scope="row" class="px-6 py-4 font-medium  whitespace-nowrap dark:text-white">
                                Total Score
                            </th>
                            <td class="px-6 py-4">
                                0
                            </td>
                            <td class="px-6 py-4">
                                0 
                            </td>
                            <td class="px-6 py-4">
                                0 
                            </td>
                            <td class="px-6 py-4 text-red-600 font-bold">
                                10 👑
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

export default SummaryScore