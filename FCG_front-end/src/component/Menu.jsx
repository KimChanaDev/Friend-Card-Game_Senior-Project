import './Menu.css'

function Menu() {
 
  return (
    <>
     <div className='menu_border'>
            <p>
                Waiting for Player
            </p>
            <button class="add_bot_button bg-blue-500 hover:bg-blue-700 text-black font-bold py-2  border border-blue-700 rounded">
                Add Bot
            </button>
            <button class="quit_button bg-blue-500 hover:bg-blue-700 text-black font-bold py-2  border border-blue-700 rounded">
                Quit Lobby
            </button>

         </div>
    
    
    </>
    

      
  )
}
export default Menu
