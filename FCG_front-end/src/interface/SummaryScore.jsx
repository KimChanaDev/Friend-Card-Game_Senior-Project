import './SummaryScore.css'
function SummaryScore() {
    return (
        <>
            <div class="relative overflow-x-auto summary_table border-double border-4 border-gray-600">
                <table class="w-full text-sm text-left text-dark dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
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
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Round 1
                            </th>
                            <td class="px-6 py-4">
                                0
                            </td>
                            <td class="px-6 py-4">
                                0 ⭐
                            </td>
                            <td class="px-6 py-4">
                                0 ⭐
                            </td>
                            <td class="px-6 py-4">
                                0
                            </td>
                        </tr>
                        <tr class="bg-white  dark:bg-gray-800 border-b dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Round 2
                            </th>
                            <td class="px-6 py-4">
                                0 ⭐
                            </td>
                            <td class="px-6 py-4">
                                0 ⭐
                            </td>
                            <td class="px-6 py-4">
                                0
                            </td>
                            <td class="px-6 py-4">
                                0
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
                                0 ⭐
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
                                10 ⭐
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800">
                            <th scope="row" class="px-6 py-4 font-medium text-green-500 whitespace-nowrap dark:text-white">
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
                            <td class="px-6 py-4 text-red-800 font-bold">
                                10 👑
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button class=" close_button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded">
  close
</button>
            </div>
        
   

        </>
    )
}

export default SummaryScore