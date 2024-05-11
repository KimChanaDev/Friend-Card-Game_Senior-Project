import './SlideBar.css'
import { useState } from 'react'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import EmojiPanel from '../component/EmojiPanel';

export default function SlideBar() {
    const [isEmojiUp, toggleEmoji] = useState(false);
    function handleEmoji() {
        toggleEmoji(s => !s)
    }
    return (
        <>
            {!isEmojiUp &&
                <div className="slide_bar"onClick={handleEmoji}>
                    <i className='arrow'></i>
                </div>
            }
            {isEmojiUp && < EmojiPanel callback={handleEmoji} />}
        </>
    )

}