import {useEffect, useState} from "react";
import GameMenu from "../components/GameMenu";
import Navbar from "../components/Navbar";
// import BaseModalWrapper from '../ModalPopup/BaseModalWrapper'
// import ModalRWD from '../ModalPopup/ModalRWD';
import "./Mainmanu.css";
import LoginModal, { LoginFunction } from "../ModalPopup/LoginModal";
import SignUpModal, { SignUpFunction } from "../ModalPopup/SignUPmodal";
import LobbyModal from "../ModalPopup/LobbyListmodal";
import ProfileModal from "../ModalPopup/ProfileModal";
import { LoginApiResponse, Userdata } from "../entities/response";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Login, Logout, LoginPayload } from "../store/UserSlice.tsx";
import COOKIE from "../enum/CookieNameEnum.jsx";
import { PostSignIn,PostSignUp } from "../service/Api/ApiService.jsx";
import {ConnectToSocket} from "../store/SocketSlice.jsx";
import SOCKET_STATUS from "../enum/SocketStatusEnum.jsx";
import {SetPage} from "../store/PageStateSlice.jsx";
import PAGE_STATE from "../enum/PageStateEnum.jsx";
import {
  Auction, CardPlayed, EmojiReceived, GameFinished,
  PlayerConnected,
  PlayerDisconnected,
  PlayerInGame,
  PlayerToggleReady, RoundFinished, SelectMainCard,
  StartGame, TrickFinished
} from "../store/SocketGameListenersSlice.jsx";
import { ChangeBGM } from "../store/BGMSlice.jsx";
import Vfx from "../components/Vfx.jsx";

Mainmanu.propTypes = {
  setCookie: PropTypes.func,
  removeCookie: PropTypes.func,
};

function Mainmanu({ setCookie, removeCookie }) {
  const { playButton, playInterface } = Vfx();

  // console.log(playButton)

  const handleButtonClick = (buttonIndex: number) => {
    switch (buttonIndex) {
      case 1:
        console.log(`Button 1 clicked`);
        toggleLobbyList();
        break;
      case 2:
        console.log(`Button 2 clicked`);
        playWithBot()
        console.log(userStore);
        break;
      case 3:
        console.log(`Button 3 clicked`);
        dispatch(Logout());
        break;
      default:
        console.log(`Error`);
    }
    playButton()
  };

  // const [isModalVisible,setIsModalVisible] = useState<boolean>(false)
  const [isLoginVisible, setIsLoginVisible] = useState<boolean>(false);
  const [isSignUpVisible, setIsSignUpVisible] = useState<boolean>(false);
  const [isLobbyListVisible, setIsLobbyListVisible] = useState<boolean>(false);
  const [isProfileVisible, setIsProfileVisible] = useState<boolean>(false);
  // const [userData,setUserData] = useState<Userdata>()
  // const toggleModal = () =>{
  //   setIsModalVisible(wasModalVisible => !wasModalVisible)
  // }
  const onBackdropClick = () => {
    // setIsModalVisible(false)
    setIsSignUpVisible(false);
    setIsLoginVisible(false);
    setIsLobbyListVisible(false);
    setIsProfileVisible(false);
  };
  const switmodal = () => {
    setIsLoginVisible((wasModalVisible) => !wasModalVisible);
    setIsSignUpVisible((wasModalVisible) => !wasModalVisible);
  };
  const toggleSignIn = () => {
    setIsLoginVisible((wasModalVisible) => !wasModalVisible);
  };
  const toggleLobbyList = () => {
    setIsLobbyListVisible((wasModalVisible) => !wasModalVisible);
  };
  const toggleUserProfile = () => {
    setIsProfileVisible((wasModalVisible) => !wasModalVisible);
  };

  useEffect(() => {
    if (isLoginVisible || isSignUpVisible || isLobbyListVisible || isProfileVisible) {
      playInterface();
    }
  }, [isLoginVisible, isSignUpVisible, isLobbyListVisible, isProfileVisible])

  const playWithBot = () => {
    // const dispatch = useDispatch()
    dispatch(ConnectToSocket({token: undefined, gameId: undefined, password: undefined, isGuest: true}))
    StartGameListener()
  }
  function StartGameListener() {
    dispatch(PlayerToggleReady());
    dispatch(StartGame());
    dispatch(PlayerConnected());
    dispatch(PlayerInGame());
    dispatch(PlayerDisconnected());
    dispatch(Auction());
    dispatch(SelectMainCard());
    dispatch(CardPlayed());
    dispatch(TrickFinished());
    dispatch(RoundFinished());
    dispatch(GameFinished());
    dispatch(EmojiReceived());
  }
  const socketConnectionStatus = useSelector((state) => state.socketStore.connectionStatus);
  useEffect(() => {
    if (socketConnectionStatus === SOCKET_STATUS.CONNECTED) {
      dispatch(SetPage({ pageState: PAGE_STATE.LOADING }));
    }
  }, [socketConnectionStatus]);

  // User status
  const userStore = useSelector((state) => state.userStore);
  const dispatch = useDispatch();
  function SaveUserData(user?: Userdata) {
    const userInfo: LoginPayload = {
      userId: user?.UID,
      username: user?.displayName,
      token: user?.jwt,
      imagePath: user?.imagePath,
    };
    console.log("Info", userInfo);
    dispatch(Login(userInfo));
    setCookie(COOKIE.name, userInfo, { path: "/" ,maxAge:86400});
  }
  const onLoginRequest: LoginFunction = async ({ password, login }) => {
    try {
      playButton();
      onBackdropClick();

      const responseData: LoginApiResponse = await PostSignIn(login,password);
      console.log(responseData);
      SaveUserData(responseData.response.data);
    } catch (error) {
      onBackdropClick();
      console.error("Login failed:", error);
      alert("Login failed:");
    }
    // console.log("Login Status => ",isUserLogin)
  };
  const onSignUpRequest: SignUpFunction = async ({
    password,
    username,
    email,
    con_password,
    image,
  }) => {
    try {
      playButton();
      onBackdropClick();
      const responseData: LoginApiResponse = await PostSignUp(username,password,email,con_password,image);

      // setUserData(responseData.response.data)
      SaveUserData(responseData.response.data);
    } catch (error) {
      onBackdropClick();
      console.error("register failed:", error);
      alert("register failed:");
    }
  };
  const userLogout = () => {
    console.log("Logout");
    playButton();
    dispatch(Logout());
    removeCookie(COOKIE.name);
    onBackdropClick();
  };

  useEffect(() => {
    dispatch(ChangeBGM("Menu"))
  }, [])

  return (
    <div className="Mainmanu">
      <div className="Nav">
        {userStore.isLogIn ? (
          /* // Render this when the user is logged in */
          <Navbar onProfileCilck={toggleUserProfile} userData={userStore} />
        ) : (
          /* // Render this when the user is not logged in */
          <Navbar onProfileCilck={toggleSignIn} userData={userStore} />
          /* )} */
        )}
      </div>
      <div className="GameMenu">
        <GameMenu
          onButtonClick={handleButtonClick}
          isUserLogin={userStore.isLogIn}
        />
      </div>
      <div>
        <ProfileModal
          onBackdropClick={onBackdropClick}
          isModalVisible={isProfileVisible}
          UserLogout={userLogout}
          userData={userStore}
        />
        <SignUpModal
          onBackdropClick={onBackdropClick}
          onSignUpRequested={onSignUpRequest}
          isModalVisible={isSignUpVisible}
          switchToSignInModal={switmodal}
        />
        <LoginModal
          onBackdropClick={onBackdropClick}
          onLoginRequested={onLoginRequest}
          isModalVisible={isLoginVisible}
          switchToSignUpModal={switmodal}
        />
        <LobbyModal
          onBackdropClick={onBackdropClick}
          isModalVisible={isLobbyListVisible}
          userData={userStore}
        />
      </div>
    </div>
  );
}

export default Mainmanu;
