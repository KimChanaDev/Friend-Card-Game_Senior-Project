import axios from "axios";
import { serverPort } from "../../config/server-config.jsx";

export async function PostSignIn(username, password) {
  console.log("sent to " + serverPort);
  const response = await axios.post(`${serverPort}/userdata/login`, {
    username: username,
    password: password,
  });
  return response.data;
}

export async function PostSignUp(username, password, email, con_password, img) {
  console.log("sent to " + serverPort);
  const response = await axios.post(`${serverPort}/userdata/register`, {
    username: username,
    password: password,
    email: email,
    confirmPassword: con_password,
    imagePath:img,
  });
  return response.data;
}

export async function GetRooms(token) {
  const response = await axios.get(`${serverPort}/games`, {
    headers: {
      authorization: token,
    },
  });
  return response.data;
}

export async function GetRoom(token, roomId) {
  const response = await axios.get(`${serverPort}/games/${roomId}`, {
    headers: {
      authorization: token,
    },
  });
  return response.data;
}

export async function PostCreateRoom(token, lobbyName, password) {
  const body = {
    gameType: "FRIENDCARDGAME",
    maxPlayers: 4,
    password: password ? password : null,
    roomName: lobbyName,
  };
  const response = await axios.post(`${serverPort}/games`, body, {
    headers: {
      authorization: token,
    },
  });
  return response.data;
}

export async function UpdateData(token, newData) {
  console.log("In UpdateData",newData)
  const response = await axios.patch(`${serverPort}/userdata/profile`, newData, {
    headers: {
      authorization: token,
    },
  });
  return response.data;
}

export async function GetProfile(token) {
  const response = await axios.get(`${serverPort}/userdata/profile`, {
    headers: {
      authorization: token,
    },
  });
  return response.data;
}

export async function GetHistory(token) {
  // console.log("Token",token)
  const response = await axios.get(`${serverPort}/userdata/history`, {
    headers: {
      authorization: token,
    },
  });
  console.log(response.data)
  return response.data;
}

export async function ChangePassword(token) {
  const response = await axios.get(`${serverPort}/userdata/resetpassword`,{
    headers: {
      authorization: token,
    },
  });
  console.log(response.data)
  return response.data
}