import React from "react";
import "./Navbar.css"; // Import CSS file for styling
import { UserState } from "../store/UserSlice";
// import BGM from "./BGM";

interface NavbarProps {
  onProfileCilck: () => void;
  userData? : UserState
}

const Navbar: React.FC<NavbarProps> = ({ onProfileCilck ,userData}) => {
  return (
    <div className="navbar">
      <div className="left" onClick={() => onProfileCilck()}>
        <div>
          {userData?.isLogIn ? (
            // Render this when the user is logged in
            <div className="user-profile">
                <img
                  src={userData?.imagePath}
                  alt="User Profile"
                />
                <div className="user-info">
                  <span className="username">{userData?.username}</span>
                  <span className="userid">UID: {userData?.userId}</span>
                </div>
              </div>
          ) : (
            // Render this when the user is not logged in
            <div className="user-profile">
                <img
                  src="https://cdn.discordapp.com/attachments/406860361086795776/1201974284054962286/ac54e98624c7bf02963fbbd60490d0cd.png?ex=65cbc4c8&is=65b94fc8&hm=db2adbaa1e133e8bf1e3e67fb756ae4216dc56ffa027d5723126b8b0a6566436&"
                  alt="User Profile"
                />
                <div className="user-info">
                  <span className="username">Guest Account</span>
                  <span className="userid">Sign In</span>
                </div>
              </div>
          )}
          {/* <span>Guest 123456 </span>
            <span>Sign In {isUserLogin}</span> */}
        </div>
      </div>
      <div className="right">
        <div className="setting">
          <a href="#">
            <img
              src="https://cdn.discordapp.com/attachments/406860361086795776/1181584660208291900/setting.png?ex=65819777&is=656f2277&hm=bb62d731bf9418a4eecbaef13d20758f3b711b39dd518f2978aa27e0d632f28b&"
              alt="User Profile"
            />
          </a>
          <div className="setting-text">
            <span>Setting </span>
          </div>
          {/* <BGM /> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
