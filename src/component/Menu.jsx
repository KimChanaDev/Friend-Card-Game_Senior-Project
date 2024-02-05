import './Menu.css'

function Menu() {
 
  return (
    <>
     <div className='menu_border'>
            <p>
                Waiting for Player
            </p>
            <button class="add_bot_button bg-black hover:bg-blue-700 text-white font-bold py-2  border border-blue-700 rounded-2xl">
                Add Bot
            </button>
            <button class="quit_button bg-black hover:bg-blue-700 text-white font-bold py-2  border border-blue-700 rounded-2xl">
                Quit Lobby
            </button>

       </div>
    
    
    </>
    

      
  )
}
export default Menu
