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
                <div className="slide_bar">
                    <button onClick={handleEmoji}><ArrowLeftIcon className='left_arrow' sx={{ fontSize: 250 }} /></button>


                </div>
            }
            {isEmojiUp && < EmojiPanel callback={handleEmoji} />}
        </>
    )

}