import './EmojiPanel.css'

function EmojiPanel({callback}) {

  return (
    <ul className='emoji_panel'>
        <li> <button className='emoji_button'>❤️</button></li>
        <li> <button className='emoji_button'>🤣</button></li>
        <li><button className='emoji_button'>🤮</button></li>
        <li><button className='emoji_button'>😭</button></li>
        <li onClick={callback}><button className='emoji_button'>❌</button></li>

    </ul>
  )
}
export default EmojiPanel
