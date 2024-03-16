import React, { useState } from "react";
import ModalRWD from "./ModalRWD";
import InputWithIcon from "./InputWithIcon";
import {
  // ButtonContainer,
  InputTitle,
  InputContainer,
} from "./ModalPopup.styled";
import { PageButton, CreateButton } from "../components/Custom-table.styled";
// import { TableData } from "../config/table-data";
import "./joinGameModal.css";
import {useDispatch, useSelector} from "react-redux";

import Vfx from "../components/Vfx";

interface UpdateProfileModalProps {
  onBackdropClick: () => void;
  isModalVisible: boolean;
}
// const element = <img src={LoginIcon} alt="User Profile" width = "24px"/>

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  isModalVisible,
  onBackdropClick,
}) => {
  const { playButton } = Vfx();

const dispatch = useDispatch()
const userStore = useSelector(state => state.userStore)
const [NewDisplayname, setNewDisplayname] = useState("");
  const UpdateRequest = () => {
    console.log(NewDisplayname)
    playButton();
    setNewDisplayname(" ")
  };
  const BackButton = () => {
    playButton();
    onBackdropClick()
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
            <span>Update Data</span>
          </div>
          <div className="JoinPassword">
              <InputContainer>
                <InputTitle>New Username</InputTitle>
                <InputWithIcon
                  type="text"
                  value={userStore.username}
                  onChange={(e) => setNewDisplayname(e.target.value)}
                />
              </InputContainer>
          </div>

          <div className="JoinButton">
            <CreateButton onClick={UpdateRequest}> Join </CreateButton>
            <PageButton onClick={BackButton}> Back </PageButton>
          </div>
        </>
      }
    />
  );
};

export default UpdateProfileModal;
