import React from "react";
import "./Navbar.css"; // Import CSS file for styling
import { UserState } from "../store/UserSlice";

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
                  src="/guestacc.png"
                  alt="User Profile"
                />
                <div className="user-info">
                  <span className="username">Guest Account</span>
                  <span className="userid">Sign In</span>
                </div>
              </div>
          )}
        </div>
      </div>
      <div className="right">
        <div className="setting">
          <a href="#">
            <img
              src="/setting.png"
              alt="User Profile"
            />
          </a>
          <div className="setting-text">
            <span>Setting </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
