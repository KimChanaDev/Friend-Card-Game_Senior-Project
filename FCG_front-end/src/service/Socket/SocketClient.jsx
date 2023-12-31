import { io } from 'socket.io-client';

export default class SocketClient {
    socket;
    Connect(token, gameId, password) {
        this.socket = io.connect(`${process.env.REACT_APP_SERVER_PORT}/FRIENDCARDGAME`, {
            query: {
                token: token,
                gameId: gameId,
                password: password
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
                    alert("Emit failed: " + response.error);
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