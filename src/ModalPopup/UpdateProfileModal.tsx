import React, { useState } from "react";
import ModalRWD from "./ModalRWD";
import InputWithIcon from "./InputWithIcon";
import { InputTitle, InputContainer } from "./ModalPopup.styled";
import { PageButton, CreateButton } from "../components/Custom-table.styled";
import "./joinGameModal.css";
import { useDispatch, useSelector } from "react-redux";
import firebaseApp from "../config/firebase-config";
import {
  getStorage,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { UpdateData } from "../service/Api/ApiService";
// import { GetUserProfile } from "../interface/Mainmanu";
import { Login } from "../store/UserSlice.tsx";
import { GetProfile } from "../service/Api/ApiService";
import { LoginApiResponse } from "../entities/response";
import Vfx from "../components/Vfx";

interface UpdateProfileModalProps {
  onBackdropClick: () => void;
  isModalVisible: boolean;
}
const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  isModalVisible,
  onBackdropClick,
}) => {
  const { playButton } = Vfx()

  const dispatch = useDispatch();
  const userStore = useSelector((state) => state.userStore);
  const [NewDisplayname, setNewDisplayname] = useState<string | null>(null);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imgaeDemo, setImageDemo] = useState<string | ArrayBuffer | null>(userStore.imagePath)
  const BackButton = () => {
    setImageDemo(userStore.imagePath);
    playButton();
    onBackdropClick();
  };
  const FCG_Firestore = getStorage(firebaseApp);
  const uploadFile = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (imageUpload === null) {
        reject(new Error("Please select an image"));
        return;
      }

      const imageRef = storageRef(
        FCG_Firestore,
        `user/${userStore.userId}/Profile_${userStore.userId}`
      );

      uploadBytes(imageRef, imageUpload)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              console.log(url);
              resolve(url); // ส่งค่า URL กลับด้วย resolve
            })
            .catch((error) => {
              reject(error); // ส่ง error กลับถ้าเกิดข้อผิดพลาดในการดึง URL
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const ConfirmUpdate = async () => {
    const newData: { imagePath?: string; displayName?: string } = {};
    if (imageUpload === null && NewDisplayname === "") {
      onBackdropClick();
      return;
    }

    if (NewDisplayname !== "" && NewDisplayname !== null) {
      newData.displayName = NewDisplayname;
    }

    try {
      if (imageUpload !== null) {
        const url = await uploadFile();
        newData.imagePath = url;
      }
      await UpdateData(userStore.token, newData);
      const responseData: LoginApiResponse = await GetProfile(userStore.token);
      dispatch(
        Login({
          userId: responseData.response.data.UID,
          username: responseData.response.data.displayName,
          token: userStore.token,
          imagePath: responseData.response.data.imagePath,
        })
      );
      onBackdropClick();
      return;
    } catch (error) {
      console.log("Error to update profile");
    }
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length === 1) {
      const file = files[0];
      setImageUpload(file);
      const reader = new FileReader();
        reader.onloadend = () => {
            console.log(reader.result);
            setImageDemo(reader.result)
            // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
        };
        reader.readAsDataURL(file);
    }
    
  };

  return (
    <ModalRWD
      onBackdropClick={onBackdropClick}
      isModalVisible={isModalVisible}
      header1="Update "
      header2="Profile"
      message=" "
      content={
        <>
          <div className="JoinText">{/* <span>Update Data</span> */}</div>
          <div className="JoinPassword">
            <InputContainer>
            <label className="profile-upload">
                <input type="file" onChange={handleImageChange} accept="image/*" />
                <img
                  src={imgaeDemo}
                  alt="User Profile"
                />
                {/* <i className="fa fa-cloud-upload"></i> Profile Upload */}
                
              </label>
              <br />
              <InputTitle>New DisplayName</InputTitle>
              <InputWithIcon
                type="text"
                onChange={(e) => setNewDisplayname(e.target.value)}
              />
            </InputContainer>
          </div>

          <div className="JoinButton">
            <CreateButton onClick={ConfirmUpdate}> Confirm </CreateButton>
            <PageButton onClick={BackButton}> Back </PageButton>
          </div>
        </>
      }
    />
  );
};

export default UpdateProfileModal;
