import { io } from 'socket.io-client';
import {serverPort} from "../../config/server-config.jsx";

export default class SocketClient {
    socket;
    Connect(token, gameId, password, isGuest=false, gameType="FRIENDCARDGAME") {
        this.socket = io.connect(`${serverPort}/FRIENDCARDGAME`, {
            query: {
                token: token,
                gameId: gameId,
                password: password,
                isGuest: isGuest,
                gameType: gameType
            },
            // transports: ['websocket']
        });
        return new Promise((resolve, reject) => {
            this.socket.on('connect', () => {
                // alert("Connected")
                return resolve()
            });
            this.socket.on('connect_error', (error) => {
                alert("Connect Error: " + error)
                return reject(error)
            });
        });
    }

    Disconnect() {
        return new Promise((resolve) => {
            this.socket.disconnect(() => {
                this.socket = null;
                resolve();
            });
        });
    }

    Emit(event, ...data) {
        return new Promise((resolve, reject) => {
            if (!this.socket) return reject('No socket connection.');
            const EmitCallback = (response) => {
                if (response.error) {
                    if(response.error === "Not all players ready") alert("Not all players are ready");
                    else if(response.error === "The first player cannot pass") alert("The first player cannot pass");
                    else if(response.error === "Friend or Trump are not valid") alert("Friend or Trump are not valid");

                    console.error(response.error);
                    reject(response.error);
                } else {
                    resolve(response);
                }
            };
            if (data) {
                this.socket.emit(event, ...data, EmitCallback);
            } else {
                this.socket.emit(event, EmitCallback);
            }
        });
    }

    On(event, fun) {
        return new Promise((resolve, reject) => {
            if (!this.socket) return reject('No socket connection.');

            this.socket.on(event, fun);
            resolve();
        });
    }
}