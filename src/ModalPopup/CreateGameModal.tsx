import React, { useState } from "react";
import ModalRWD from "./ModalRWD";
import InputWithIcon from "./InputWithIcon";
import {
  InputTitle,
  InputContainer,
} from "./ModalPopup.styled";
import { PageButton, CreateButton } from "../components/Custom-table.styled";
import "./joinGameModal.css";
import {useDispatch, useSelector} from "react-redux";
import { PostCreateRoom } from "../service/Api/ApiService";
import { ConnectToSocket } from "../store/SocketSlice";
import {
  Auction, CardPlayed, EmojiReceived, GameFinished, PlayerConnected, PlayerDisconnected,
  PlayerInGame, PlayerToggleReady, RoundFinished, SelectMainCard, StartGame, TrickFinished
} from "../store/SocketGameListenersSlice.jsx";
import {Logout} from "../store/UserSlice.tsx";
import {SetPage} from "../store/PageStateSlice.jsx";
import PAGE_STATE from "../enum/PageStateEnum.jsx";
import {useCookies} from "react-cookie";
import COOKIE from "../enum/CookieNameEnum.jsx";

interface CreateGameModalProps {
  onBackdropClick: () => void;
  isModalVisible: boolean;
}

const CreateGameModal: React.FC<CreateGameModalProps> = ({
  isModalVisible,
  onBackdropClick,
}) => {
  const userStore = useSelector(state => state.userStore)
  const dispatch = useDispatch()
  const [lobbyname, setLobbyname] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies([COOKIE.name]);
  const socketConnectionStatus = useSelector(
    (state) => state.socketStore.connectionStatus
  );
  const CreateRequest = async () => {
    try{
      const matchData = await PostCreateRoom(userStore.token, lobbyname, password)
      dispatch(
        ConnectToSocket({
          token: userStore.token,
          gameId: matchData?.id,
          password: password,
        })
      );
      StartGameListener()
    }catch(error: any){
      if (error?.response?.status === 401) {
        alert('Unauthorized! or Overlap logged in! please login again.')
        console.error('Unauthorized! or Overlap logged in!');
        dispatch(Logout())
        removeCookie(COOKIE.name);
        onBackdropClick();
      }else{
        console.error("Create room failed: ", error)
        alert(`Create room failed: ${error}`)
      }
    }
    console.log(lobbyname,password,userStore)
    setPassword("")
    setLobbyname("")
  };
  const BackButton = () => {
    setPassword("")
    setLobbyname("")
    onBackdropClick()
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
  return (
    <ModalRWD
      onBackdropClick={onBackdropClick}
      isModalVisible={isModalVisible}
      header1="Create "
      header2="Lobby"
      message=" "
      content={
        <>
          <div className="JoinPassword">
              <InputContainer>
                <InputTitle>Lobby Name</InputTitle>
                <InputWithIcon
                  type="text"
                  value={lobbyname}
                  onChange={(e) => setLobbyname(e.target.value)}
                />
                <InputTitle>Password</InputTitle>
                <InputWithIcon
                  type="password"
                  placeholder="optional..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputContainer>
          </div>
          <div className="JoinButton">
            <CreateButton onClick={CreateRequest}> Create </CreateButton>
            <PageButton onClick={BackButton}> Back </PageButton>
          </div>
        </>
      }
    />
  );
};

export default CreateGameModal;
