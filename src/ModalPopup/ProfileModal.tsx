import React, { useEffect, useState } from "react";
import ModalRWD from "./ModalRWD";
import "./ProfileModal.css";
import { ChangePasswordButton, LogoutButton } from "./ModalPopup.styled";
import { HistoryComponent } from "../components/Custom-table";
import { UserState } from "../store/UserSlice";
import UpdateProfileModal from "./UpdateProfileModal";
import { GetHistory } from "../service/Api/ApiService";
import { HistoryApiResponse, History, MatchDetail } from "../entities/response";
import { useDispatch, useSelector } from "react-redux";

interface ProfileModalProps {
  onBackdropClick: () => void;
  isModalVisible: boolean;
  UserLogout: () => void;
  userData?: UserState;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isModalVisible,
  onBackdropClick,
  UserLogout,
  userData,
}) => {
  const [history, setData] = useState<History>();
  const [isUpdateProfileVisible, setIsUpdateProfileVisible] =
    useState<boolean>(false);
  const [isUpdatePasswordVisible, setIsUpdatePasswordVisible] =
    useState<boolean>(false);

  const PictureClick = () => {
    console.log("isUpdateProfileVisible", isUpdateProfileVisible);
    setIsUpdatePasswordVisible(false);
    setIsUpdateProfileVisible(true);
  };
  const onModalBackdropClick = () => {
    setIsUpdatePasswordVisible(false);
    setIsUpdateProfileVisible(false);
  };
  const userStore = useSelector((state) => state.userStore);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData: HistoryApiResponse = await GetHistory(userStore.token);
        setData(responseData.response.data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };

    fetchData();
  }, [isModalVisible]);

  return (
    <ModalRWD
      onBackdropClick={onBackdropClick}
      isModalVisible={isModalVisible}
      header1=""
      header2=""
      message=""
      content={
        <>
          <div className="Profile">
            <div className="UserInfo">
              <div className="Profile-Img" onClick={PictureClick}>
                <img
                  src={userData?.imagePath}
                  alt="User Profile"
                />
                <div className="Info">
                  <span className="name">
                    {userData?.username}
                  </span>
                  <span className="uid">UID: {userData?.userId}</span>
                </div>
              </div>
              <div className="User-Score">
                <div className="ScoreBoard">
                  <span>
                    <img src="/win.png" alt="Win" />
                    <div>
                      <p className="Win">Win</p>
                      <span>{history?.win}</span>
                    </div>
                  </span>
                  <span>
                    <img src="/match.png" alt="Match" />
                    <div>
                      <p>Match</p>
                      <span>{history?.match}</span>
                    </div>
                  </span>
                </div>
                <div className="User-Button">
                  <ChangePasswordButton onClick={PictureClick}>
                    Update Profile
                  </ChangePasswordButton>
                  <LogoutButton onClick={UserLogout}> Logout </LogoutButton>
                </div>
              </div>
            </div>
            <div className="History">
              <div className="History-title">
                <h2>Latest Match</h2>
              </div>

              <div className="Match">
                <HistoryComponent data={history?.latestMatch} />
              </div>
            </div>
          </div>

          <UpdateProfileModal
            onBackdropClick={onModalBackdropClick}
            isModalVisible={isUpdateProfileVisible}
          />
        </>
      }
    />
  );
};

export default ProfileModal;
