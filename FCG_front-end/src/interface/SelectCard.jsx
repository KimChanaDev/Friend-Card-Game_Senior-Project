import './SelectCard.css'
function SelectCard() {
    return (
        <>
            <div class="relative overflow-x-auto select_table border-double border-4 border-gray-600">
                <table class="w-full text-sm text-left dark:text-gray-400">
                    <thead class="text-xs text-white uppercase ">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Suite
                            </th>
                            <th colSpan={12} scope="col" class="px-6 py-3 text-center text-white">
                                Select Friend Card Number
                            </th>
                            <th colSpan={3} scope="col" class="px-6 py-3 text-center text-white">
                                Select TRUMP Card Number
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr class=" border-b border-black">
                            <th scope="row" class=" text-4xl px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                ♣️
                            </th>
                            <td class="px-6 py-4 text-gray-500">
                                2
                            </td>
                            <td class="px-6 py-4  text-gray-500">
                                3
                            </td>
                            <td class="px-6 py-4 text-gray-500">
                                4
                            </td>
                            <td class="px-6 py-4 text-gray-500">
                                5
                            </td>
                            <td class="px-6 py-4 text-gray-500">
                                6
                            </td>
                            <td class="px-6 py-4 text-gray-500">
                                7
                            </td>
                            <td class="px-6 py-4 text-gray-500">
                                8
                            </td>
                            <td class="px-6 py-4 text-gray-500">
                                9
                            </td>
                            <td class="px-6 py-4 text-gray-500">
                                J
                            </td>
                            <td class="px-6 py-4 text-gray-500">
                                Q
                            </td>
                            <td class="px-6 py-4 text-gray-500">
                                K
                            </td>
                            <td class="px-6 py-4 text-gray-500">
                                A
                            </td>
                            <td colSpan={3} class="px-6 py-4  text-4xl text-center  border-l-2 border-black ">
                                <button>♣️</button>
                            </td>
                        </tr>
                        <tr class=" border-b  border-black">
                            <th scope="row" class="text-4xl px-6 py-4 font-medium text-red-600 whitespace-nowrap dark:text-white">
                                ♥️
                            </th>
                            <td class="px-6 py-4">
                                <button>2</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>3</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>4</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>5</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>6</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>7</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>8</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>9</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>J</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>Q</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>K</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>A</button>
                            </td>
                            <td colSpan={3} class="px-6 py-4  text-4xl text-center text-red-600  border-l-2 border-black ">
                                <button>♥️</button>
                            </td>
                        </tr>
                        <tr class=" border-b border-black">
                            <th scope="row" class="text-4xl px-6 py-4 font-medium text-red-600 whitespace-nowrap dark:text-white">
                                ♦️
                            </th>
                            <td class="px-6 py-4">
                                <button>2</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>3</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>4</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>5</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>6</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>7</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>8</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>9</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>J</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>Q</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>K</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>A</button>
                            </td>
                            <td colSpan={3} class="px-6 py-4  text-4xl text-center text-red-600  border-l-2 border-black">
                                <button>♦️</button>
                            </td>
                        </tr>
                        <tr class=" border-b border-black">
                            <th scope="row" class="text-4xl px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                ♠️
                            </th>
                            <td class="px-6 py-4">
                                <button>2</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>3</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>4</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>5</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>6</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>7</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>8</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>9</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>J</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>Q</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>K</button>
                            </td>
                            <td class="px-6 py-4">
                                <button>A</button>
                            </td>
                            <td colSpan={3} class="px-6 py-4  text-4xl text-center border-l-2 border-black  ">
                                <button>♠️</button>
                            </td>
                        </tr>

                    </tbody>
                </table>
                
                <button class=" confirm_button bg-black  text-white font-bold py-2 px-4 border  rounded-2xl">
                    confirm
                </button>
            </div>



        </>
    )
}

export default SelectCard