import React, { useEffect,useState } from "react";
import ModalRWD from "./ModalRWD";
import InputWithIcon from "./InputWithIcon";
import {
  ButtonContainer,
  InputTitle,
  InputContainer,
} from "./ModalPopup.styled";
import { PageButton, CreateButton } from "../components/Custom-table.styled";
import { TableData } from "../config/table-data";
import "./joinGameModal.css";
import { useDispatch, useSelector } from "react-redux";
import { ConnectToSocket } from "../store/SocketSlice";
import {
  Auction, CardPlayed, EmojiReceived, GameFinished, PlayerConnected, PlayerDisconnected,
  PlayerInGame, PlayerToggleReady, RoundFinished, SelectMainCard, StartGame, TrickFinished
} from "../store/SocketGameListenersSlice.jsx";
import PAGE_STATE from "../enum/PageStateEnum.jsx";
import {SetPage} from "../store/PageStateSlice.jsx";
import SOCKET_STATUS from "../enum/SocketStatusEnum.jsx";
import {SetJoinRoomDetail} from "../store/GameSlice.jsx";

interface LoginArgs {
  password: string;
  login: string;
}

export type LoginFunction = (args: LoginArgs) => Promise<void>;

interface JoinGameModalProps {
  onBackdropClick: () => void;
  isModalVisible: boolean;
  matchData?: TableData;
}
// const element = <img src={LoginIcon} alt="User Profile" width = "24px"/>

const JoinGameModal: React.FC<JoinGameModalProps> = ({
  isModalVisible,
  onBackdropClick,
  matchData,
}) => {
  const dispatch = useDispatch();
  const userStore = useSelector((state) => state.userStore);
  const socketConnectionStatus = useSelector(
    (state) => state.socketStore.connectionStatus
  );
  const [password, setPassword] = useState("");
  
  const JoinRequest = () => {
    // console.log("Token : ", userStore.token);
    // console.log("gameID : ", matchData?.id);
    // console.log("Password : ", password);
    dispatch(
      ConnectToSocket({
        token: userStore.token,
        gameId: matchData?.id,
        password: password,
      })
    );
    setPassword("");
    StartGameListener()
  };
  const BackButton = () => {
    setPassword("");
    onBackdropClick();
  };
  useEffect(() => {
    if (socketConnectionStatus === SOCKET_STATUS.CONNECTED) {
      dispatch(SetPage({ pageState: PAGE_STATE.LOADING }));
    }
  }, [socketConnectionStatus]);

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
      header1=""
      header2=""
      message=""
      content={
        <>
          <div className="JoinText">
            <span>Join Lobby</span>
            <p>{matchData?.id} ?</p>
          </div>
          <div className="JoinPassword">
            {matchData?.isPasswordProtected && (
              <InputContainer>
                <InputTitle>Password</InputTitle>
                <InputWithIcon
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputContainer>
            )}
          </div>

          <div className="JoinButton">
            <CreateButton onClick={JoinRequest}> Join </CreateButton>
            <PageButton onClick={BackButton}> Back </PageButton>
          </div>
        </>
      }
    />
  );
};

export default JoinGameModal;
