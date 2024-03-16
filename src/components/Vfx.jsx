import { useState, useEffect } from 'react';

import useSound from 'use-sound';

const Vfx = () => {
    const [volume, setVolume] = useState(0.5)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [interrupt, setInterrupt] = useState(true)

    const [playButton] = useSound("Button.mp3", { volume, interrupt, soundEnabled })
    const [playFlipCard] = useSound("Flipcard.mp3", { volume, interrupt, soundEnabled })
    const [playEmoji] = useSound("Emoji_pop.mp3", { volume, interrupt, soundEnabled })
    const [playTrick] = useSound("End_trick.mp3", { volume, interrupt, soundEnabled })
    const [playFriend] = useSound("Friend_appear.mp3", { volume, interrupt, soundEnabled })
    const [playInterface] = useSound("Interface.mp3", { volume, interrupt, soundEnabled })

    const exportsFuction = {
        playButton,
        playFlipCard,
        playEmoji,
        playTrick,
        playFriend,
        playInterface
    }

    return exportsFuction
}

export default Vfx