import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useState} from "react";
import ProfilePopUp from "../component/ProfilePopup/ProfilePopUp.jsx";
import {useDispatch, useSelector} from "react-redux";
import AuthenticationPopup from '../component/Authentication/AuthenticationPopup.jsx'
import {SetPage} from "../store/PageStateSlice.jsx"
import PageStateEnum from "../enum/PageStateEnum.jsx";
import PropTypes from "prop-types";
import LobbyList from "../component/LobbyListPopup/LobbyList.jsx";

const defaultTheme = createTheme()

Menu.propTypes = {
    setCookie: PropTypes.func,
    removeCookie: PropTypes.func
}
export default function Menu({setCookie, removeCookie}) {

    const userStore = useSelector(state => state.userStore)
    const [isShowProfilePopUp, setIsShowProfilePopUp] = useState(false)
    const [isShowAuthenticationPopup, setIsShowAuthenticationPopup] = useState(false)
    const [isShowLobbyList, setIsShowLobbyList] = useState(false)

    function SettingClicked(){
        alert("setting clicked")
    }
    function SoloClicked(){
        alert("SOLO clicked")
    }
    function HowToPlayClicked(){
        alert("HOW TO PLAY clicked")
    }
    function OpenAuthenticationPopup(){ setIsShowAuthenticationPopup(true) }
    function CloseAuthenticationPopup(){ setIsShowAuthenticationPopup(false) }
    function OpenProfileDetail() { setIsShowProfilePopUp(true) }
    function CloseProfileDetail() { setIsShowProfilePopUp(false) }
    function OpenLobbyList(){ setIsShowLobbyList(true) }
    function CloseLobbyList(){ setIsShowLobbyList(false) }

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Friend Card Game
                        </Typography>
                        {
                            userStore.isLogIn ?
                                <button onClick={OpenProfileDetail}>username: {userStore.username} | UID: {userStore.userId}</button>
                                : <button onClick={OpenAuthenticationPopup}>Guest xxxx | Sign In</button>
                        }
                        <button onClick={SettingClicked}>{`Setting`}</button>
                        <button onClick={OpenLobbyList} disabled={!userStore.isLogIn} >{`PLAY`}</button>
                        <button onClick={SoloClicked}>{`SOLO`}</button>
                        <button onClick={HowToPlayClicked}>{`HOW TO PLAY`}</button>
                    </Box>
                </Container>
            </ThemeProvider>
            { isShowAuthenticationPopup && <AuthenticationPopup CloseAuthenticationPopup={CloseAuthenticationPopup} setCookie={setCookie}/>}
            { isShowProfilePopUp && <ProfilePopUp CloseProfileDetail={CloseProfileDetail} removeCookie={removeCookie}/> }
            { isShowLobbyList && <LobbyList CloseLobbyList={CloseLobbyList}/>}
        </>
    )
}