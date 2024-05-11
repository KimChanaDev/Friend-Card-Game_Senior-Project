import axios from "axios";
import {serverPort} from "../../config/server-config.jsx";

export async function PostSignIn (username, password){
    console.log('sent to ' + serverPort)
    const response = await axios.post(`${serverPort}/users/login`, {
        username: username,
        password: password
    });
    return response.data
}

export async function PostSignUp (username, password){
    console.log('sent to ' + serverPort)
    const response = await axios.post(`${serverPort}/users/register`, {
        username: username,
        password: password
    });
    return response.data
}

export async function GetRooms (token){
    const response = await axios.get(`${serverPort}/games`,{
        headers: {
            authorization: token
        }
    })
    return response.data
}

export async function GetRoom (token, roomId){
    const response = await axios.get(`${serverPort}/games/${roomId}`,{
        headers: {
            authorization: token
        }
    })
    return response.data
}

export async function PostCreateRoom (token, lobbyName, password){
    const body = {
        gameType: "FRIENDCARDGAME",
        maxPlayers: 4,
        password: password ? password : null,
        roomName: lobbyName
    }
    const response = await axios.post(`${serverPort}/games`, body, {
        headers: {
            authorization: token
        }
    })
    return response.data
}
