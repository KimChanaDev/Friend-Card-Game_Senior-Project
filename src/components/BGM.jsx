import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { ChangeVolume } from '../store/UserSlice.tsx';
import { Slider } from '@mui/material';
import { Volume1, Volume2, VolumeX } from 'react-feather';
import useSound from 'use-sound'

import './MovingText.css'

const BGM = () => {
    const dispatch = useDispatch()
    const BGMState = useSelector(state => state.userStore)

    const loop = true
    const interrupt = true

    const [prevVolume, setPrevVolume] = useState(0.5)
    const [displayName, setDisplayName] = useState("")

    const stopAllSong = () => {
        return new Promise((resolve) => {
            console.log("Stop all song")
            stopMenu1()
            stopMenu2()
            stopMenu3()
            stopInGameIntro()
            stopInGame()
            resolve()
        })
    }

    const playMenuBGM = async (name) => {
        console.log(name)
        setTimeout(() => {
            stopAllSong()
            console.log("Randomly choose song")
            const randomSelector = Math.floor(Math.random() * 3) + 1
            switch (randomSelector){
                case 1:
                    console.log("Playing Honeydew Bark.mp3")
                    setDisplayName("Honeydew Bark.mp3")
                    playMenu1()
                    break;
                case 2:
                    console.log("Playing Honeydew Cabin.mp3")
                    setDisplayName("Honeydew Cabin.mp3")
                    playMenu2()
                    break;
                case 3:
                    console.log("Playing Honeydew Snow.mp3")
                    setDisplayName("Honeydew Snow.mp3")
                    playMenu3()
                    break;
                default:
                    console.log("Unknow song")
                    break;
            }
        }, 1000)
    }

    const [playMenu1, { stop: stopMenu1, duration: duration1 }] = useSound("Honeydew Bark.mp3", { volume: BGMState.volume, interrupt, onend: () => playMenuBGM("1") })
    const [playMenu2, { stop: stopMenu2, duration: duration2 }] = useSound("Honeydew Cabin.mp3", { volume: BGMState.volume, interrupt, onend: () => playMenuBGM("2") })
    const [playMenu3, { stop: stopMenu3, duration: duration3 }] = useSound("Honeydew Snow.mp3", { volume: BGMState.volume, interrupt, onend: () => playMenuBGM("3") })
    const [playInGameIntro, { stop: stopInGameIntro, duration: duration4 }] = useSound("Shuffling.mp3", { volume: BGMState.volume / 4, interrupt, loop })
    const [playInGame, { stop: stopInGame, sound: soundInGame, duration: duration5 }] = useSound("Honeydew Hideaway.mp3", { volume: BGMState.volume, interrupt, loop })

    useEffect(() => {
        const playSongs = async () => {
            if (BGMState.song === "Menu" && duration1 && duration2 && duration3) {
                await playMenuBGM("First")
            } else if (BGMState.song === "InGameIntro" && duration4) {
                await stopAllSong()
                setDisplayName("Shuffling.mp3")
                playInGameIntro()
            } else if (BGMState.song === "InGame" && duration5) {
                await stopAllSong()
                setDisplayName("Honeydew Hideaway.mp3")
                playInGame()
            }
        }
        playSongs()
    }, [BGMState.song, duration1, duration2, duration3, duration4, duration5])

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
            <p className="moving-text">Now playing: <span className="song-title">{displayName}</span></p>
            <Slider
                size="small"
                value={BGMState.volume}
                max={0.5}
                step={0.01}
                onChange={handleChange}
                style={{ width: '5%', marginLeft: '5px' }}
            />
        </div>
    )
}

export default BGM