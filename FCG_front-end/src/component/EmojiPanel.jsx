import './EmojiPanel.css'
import {useDispatch} from "react-redux";
import {EmitSendEmoji} from "../store/SocketGameEmittersSlice.jsx";
import EMOJI from "../enum/EmojiEnum.jsx";

function EmojiPanel({callback}) {
    const dispatch = useDispatch()
    return (
        <ul className='emoji_panel'>
            <li><button className='emoji_button' onClick={() => dispatch(EmitSendEmoji({ emoji: EMOJI.LOVE }))} >❤️</button></li>
            <li><button className='emoji_button' onClick={() => dispatch(EmitSendEmoji({ emoji: EMOJI.FUNNY }))}>🤣</button></li>
            <li><button className='emoji_button' onClick={() => dispatch(EmitSendEmoji({ emoji: EMOJI.VOMIT }))}>🤮</button></li>
            <li><button className='emoji_button' onClick={() => dispatch(EmitSendEmoji({ emoji: EMOJI.CRY }))}>😭</button></li>
            <li onClick={callback}><button className='emoji_button'>❌</button></li>
        </ul>
    )
}
export default EmojiPanel
