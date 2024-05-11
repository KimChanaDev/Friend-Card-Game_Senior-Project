import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect, useCallback } from "react"
import { ChangeVolume } from '../store/UserSlice.tsx';
import { Slider } from '@mui/material';
import { Volume1, Volume2, VolumeX } from 'react-feather';
import useSound from 'use-sound'

import './BGM.css'
import './MovingText.css'

const BGM = () => {
    const dispatch = useDispatch()
    const BGMState = useSelector(state => state.userStore)

    const loop = true
    const interrupt = true
    const soundEnabled = true
    const menuSongs = ["Ox Quiz.mp3", "Honeydew Cabin.mp3", "Honeydew Snow.mp3"]

    const [prevVolume, setPrevVolume] = useState(0.5)
    const [displayName, setDisplayName] = useState("")
    const [startMenuBGM, setStartMenuBGM] = useState(false)

    const [playMenu1, { stop: stopMenu1, duration: duration1 }] = useSound(menuSongs[0], { volume: BGMState.volume, interrupt, soundEnabled, onend: () => { setTimeout(() => { setDisplayName(menuSongs[1]) }, 1000) } })
    const [playMenu2, { stop: stopMenu2, duration: duration2 }] = useSound(menuSongs[1], { volume: BGMState.volume, interrupt, soundEnabled, onend: () => { setTimeout(() => { setDisplayName(menuSongs[2]) }, 1000) } })
    const [playMenu3, { stop: stopMenu3, duration: duration3 }] = useSound(menuSongs[2], { volume: BGMState.volume, interrupt, soundEnabled, onend: () => { setTimeout(() => { setDisplayName(menuSongs[0]) }, 1000) } })
    const [playInGameIntro, { stop: stopInGameIntro, duration: duration4 }] = useSound("Shuffling.mp3", { volume: BGMState.volume / 4, interrupt, loop })
    const [playInGame, { stop: stopInGame, sound: soundInGame, duration: duration5 }] = useSound("Monochromatic Life.mp3", { volume: BGMState.volume / 4, interrupt, loop })

    const stopAllSong = () => {
        stopMenu1()
        stopMenu2()
        stopMenu3()
        stopInGameIntro()
        stopInGame()
    }

    useEffect(() => {
        const playSongs = () => {
            if (BGMState.song === "Menu" && duration1 && duration2 && duration3) {
                setStartMenuBGM(true)
            } else if (BGMState.song === "InGameIntro" && duration4) {
                stopAllSong()
                setStartMenuBGM(false)
                setDisplayName("Shuffling.mp3")
                playInGameIntro()
            } else if (BGMState.song === "InGame" && duration5) {
                stopAllSong()
                setStartMenuBGM(false)
                setDisplayName("Honeydew Hideaway.mp3")
                playInGame()
            }
        }
        playSongs()
    }, [BGMState.song, duration1, duration2, duration3, duration4, duration5])

    useEffect(() => {
        if (startMenuBGM) {
            stopAllSong()
            setDisplayName(menuSongs[0])
        }
    }, [startMenuBGM])

    useEffect(() => {
        // console.log("Current displayName: " + displayName)
        switch (displayName) {
            case menuSongs[0]:
                playMenu1()
                break;
            case menuSongs[1]:
                playMenu2()
                break;
            case menuSongs[2]:
                playMenu3()
                break;
        }
    }, [displayName])

    const VolumeAdjust = () => {
        if (BGMState.volume == 0) {
            dispatch(ChangeVolume(prevVolume))
        } else {
            setPrevVolume(BGMState.volume)
            dispatch(ChangeVolume(0))
        }
    }

    const handleChange = (event, newValue) => {
        dispatch(ChangeVolume(newValue))
    }

    return (
        <div className="volume-and-text">
            {BGMState.volume === 0 ? (
                <VolumeX onClick={VolumeAdjust} />
            ) : BGMState.volume <= 0.25 ? (
                <Volume1 onClick={VolumeAdjust} />
            ) : (
                <Volume2 onClick={VolumeAdjust} />
            )}
            <Slider
                size="small"
                value={BGMState.volume}
                max={0.5}
                step={0.01}
                onChange={handleChange}
                style={{ width: '5%', marginLeft: '10px' }}
                className="slider-volume"
            />
            <p className="moving-text">Now playing: <span className="song-title">{displayName}</span></p>
        </div>
    )
}

export default BGM