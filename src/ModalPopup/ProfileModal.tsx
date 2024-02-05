import React, { useEffect, useState } from "react";
import ModalRWD from "./ModalRWD";
import "./ProfileModal.css";
import { ChangePasswordButton, LogoutButton } from "./ModalPopup.styled";
import { HistoryComponent } from "../components/Custom-table";
import { UserState } from "../store/UserSlice";
import UpdateProfileModal from "./UpdateProfileModal";

interface HistoryData {
  id: string;
  score: number;
  place: number;
}

interface ProfileModalProps {
  onBackdropClick: () => void;
  isModalVisible: boolean;
  UserLogout: () => void;
  userData?: UserState
}


const ProfileModal: React.FC<ProfileModalProps> = ({
  isModalVisible,
  onBackdropClick,
  UserLogout,
  userData,
}) => {
  const [data, setData] = useState<HistoryData[]>([]);
  const [isUpdateProfileVisible, setIsUpdateProfileVisible] = useState<boolean>(false);
const [isUpdatePasswordVisible, setIsUpdatePasswordVisible] = useState<boolean>(false);

const PictureClick = () => {
  console.log("isUpdateProfileVisible",isUpdateProfileVisible);
  setIsUpdatePasswordVisible(false)
  setIsUpdateProfileVisible(true)
};
const UsernameClick = () => {
  alert("Change Name");
  setIsUpdatePasswordVisible(false)
  setIsUpdateProfileVisible(true)
};
const ChangePassword = () => {
  alert("Change Password");
  setIsUpdateProfileVisible(false)
  setIsUpdatePasswordVisible(true)
};
const onModalBackdropClick = () => {
  setIsUpdatePasswordVisible(false)
  setIsUpdateProfileVisible(false)
};
  useEffect(() => {
    // เรียก API และดึงข้อมูล
    // ตัวอย่างเช่น
    // fetch('https://api.example.com/data')
    //   .then(response => response.json())
    //   .then(data => setData(data))
    //   .catch(error => console.error('Error fetching data:', error));

    // ในที่นี้ให้ใช้ข้อมูลที่กำหนดไว้
    const dummyData: HistoryData[] = [
      { id: "00000001", score: 10, place: 1 },
      { id: "00000002", score: 15, place: 2 },
      { id: "00000003", score: 20, place: 1 },
      { id: "00000004", score: 25, place: 3 },
      { id: "00000005", score: 30, place: 4 },
      { id: "00000006", score: 30, place: 4 },
      { id: "00000007", score: 3000, place: 1 },
    ];
    setData(dummyData);
  }, []); // สังเกตุว่าใส่ [] เพื่อให้ useEffect ทำงานเพียงครั้งเดียวเมื่อ Component ถูก render
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
              <div className="Profile-Img">
                <img
                  src={userData?.imagePath}
                  alt="User Profile"
                  onClick={() => PictureClick()}
                />
                <div className="Info">
                  <span className="name" onClick={() => UsernameClick()}>{userData?.username}</span>
                  <span className="uid">UID: {userData?.userId}</span>
                </div>
              </div>
              <div className="User-Score">
                <div className="ScoreBoard">
                  <span>
                    <img
                      src="https://cdn.discordapp.com/attachments/406860361086795776/1201933444335018134/697f9062398a775a1b22a0bc75e8c8fd.png?ex=65cb9ebf&is=65b929bf&hm=044264e317a334a28a2a170f3ed1a7cc5ea0eb7ba83d4817f12aff0105bce25a&"
                      alt="Win"
                    />
                    <div>
                      <p className="Win">Win</p>
                      <span>7</span>
                    </div>
                  </span>
                  <span>
                    <img
                      src="https://cdn.discordapp.com/attachments/406860361086795776/1201933556100628502/9b43ea44ea8333d66574c9c8ce2d1ba9.png?ex=65cb9eda&is=65b929da&hm=8617a3cbc0d74c0210199276fe5973b07e7ddd2b079d5cbe925c53eef402cb17&"
                      alt="Match"
                    />
                    <div>
                      <p>Match</p>
                      <span>7</span>
                    </div>
                  </span>
                </div>
                <div className="User-Button">
                  <ChangePasswordButton onClick={ChangePassword}>
                    Change Password
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
                <HistoryComponent data={data} />
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
