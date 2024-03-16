import { Volume1, Volume2, VolumeX } from 'react-feather';
import { useState, useEffect } from 'react';
import { Slider } from '@mui/material';
import { useSelector } from 'react-redux';
import './MovingText.css'

import useSound from 'use-sound';

const BGM = () => {
    // const [muted, setMuted] = useState(true)
    const BGMState = useSelector(state => state.BGMStore)

    const [volume, setVolume] = useState(0)
    const [loop, setLoop] = useState(true)
    const [interrupt, setInterrupt] = useState(true)
    // url dynamic ไม่ได้ (ไปอ่านใน github->issue เอาเอง (npm use-sound))
    // const [play, { sound }] = useSound(BGMState.song, { volume, interrupt, loop, soundEnabled })
    const [menuSelector, setMenuSelector] = useState(0)

    const [currentTime, setCurrentTime] = useState(0);

    const onend = () => {
        setMenuSelector(Math.floor(Math.random() * 3) + 1)
    }

    const [playMenu1, { stop: stopMenu1 }] = useSound("Main menu (Dunes).mp3", { volume, interrupt, onend })
    const [playMenu2, { stop: stopMenu2 }] = useSound("Honeydew Cabin.mp3", { volume, interrupt, onend })
    const [playMenu3, { stop: stopMenu3 }] = useSound("Honeydew Snow.mp3", { volume, interrupt, onend })

    // console.log(duration1 + " " + duration2 + " " + duration3)

    const [playInGameIntro, { stop: stopInGameIntro }] = useSound("InGameIntro.wav", { volume: volume / 8, interrupt, loop })
    const [playInGame, { stop: stopInGame, sound: soundInGame }] = useSound("InGame.mp3", { volume: volume / 4, interrupt, loop })

    const [prevVolume, setPrevVolume] = useState(0.5)

    const [displayName, setDisplayName] = useState("")

    const stopAllSong = () => {
        stopMenu1();
        stopMenu2();
        stopMenu3();
        stopInGameIntro();
        stopInGame();
    }

    useEffect(() => {
        switch (menuSelector) {
            case 1:
                setDisplayName("Main menu (Dunes).mp3")
                playMenu1()
                // setCurrentTime(duration1)
                break;
            case 2:
                setDisplayName("Honeydew Cabin.mp3")
                playMenu2()
                // setCurrentTime(duration2)
                break;
            case 3:
                setDisplayName("Honeydew Snow.mp3")
                playMenu3()
                // setCurrentTime(duration3)
                break;
            default:
                break;
        }
    }, [menuSelector])

    useEffect(() => {
        stopAllSong();
        if (BGMState.song === "Menu" && playMenu1 && playMenu2 && playMenu3) {
            // setDisplayName("Main Menu (Dunes)")
            // stopInGame();
            // stopInGameIntro();
            // playMenu1()
            onend()
        } else if (BGMState.song === "InGame" && playInGame) {
            setDisplayName("Main Menu (Dunes)")
            // stopMenu();
            // stopInGameIntro();
            playInGame();
            soundInGame.fade(volume / 8, volume / 4, 10000);
        } else if (BGMState.song === "InGameIntro" && playInGameIntro) {
            setDisplayName("Main Menu (Dunes)")
            // stopMenu();
            // stopInGame();
            playInGameIntro();
        }
    }, [BGMState.song, playMenu1, playMenu2, playMenu3, playInGameIntro, playInGame])

    // useEffect(() => {
    //     if (BGMState.song) {
    //         console.log("Current BGM: " + BGMState.song)
    //         play();
    //     }
    // }, [play, sound, BGMState])
    
    const VolumeAdjust = () => {
        if (volume == 0) {
            // setMuted(false);
            // setVolume(0.75);
            setVolume(prevVolume);
        } else {
            // setMuted(true);
            setPrevVolume(volume)
            setVolume(0);
        }
    }

    const handleChange = (event, newValue) => {
        setVolume(newValue);
    }

    return (
        <>
            <div className="volume-and-text">
                {volume === 0 ? (
                    <VolumeX onClick={VolumeAdjust} />
                ) : volume <= 0.25 ? (
                    <Volume1 onClick={VolumeAdjust} />
                ) : (
                    <Volume2 onClick={VolumeAdjust} />
                )}
                <p className="moving-text">Now playing: <span className="song-title">{displayName}</span></p>
            </div>
            
            <Slider
                size="small"
                value={volume}
                max={0.5}
                step={0.01}
                onChange={handleChange}
            />
        </>
    )
}

export default BGM