import { io } from "./node_modules/socket.io-client/dist/socket.io.esm.min.js";

function getQueryParameters() {
    const queryParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(queryParams.entries());
}
const queryParameters = getQueryParameters();

const socket = io("http://localhost:3000/FRIENDCARDGAME", {
    query: { 
        token: queryParameters.token,
        gameId: queryParameters.gameId
    },
    autoConnect: false,
});
function logReceive(event, result){
    console.log("Event: " + event); 
    console.log("Received: "); 
    console.log(result); 
}
socket.on("player_connected", result => { logReceive("player_connected", result); })
socket.on("players_in_game", result => { logReceive("players_in_game", result); })
socket.on("player_toggle_ready", result => { logReceive("player_toggle_ready", result); })
socket.on("start_game", result => { logReceive("start_game", result); })
socket.on("auction", result => { logReceive("auction", result); })
socket.on("select_main_card", result => { logReceive("select_main_card", result); })
socket.on("card_played", result => { logReceive("card_played", result); })

socket.on("trick_finished", result => { logReceive("trick_finished", result); })
socket.on("round_finished", result => { logReceive("round_finished", result); })

function logCallBack(result) {
    console.log(`callback:`);
    console.log(result);
}
function connect() { socket.connect(); }
function toggleReady() { socket.emit("player_toggle_ready"); }
function startGame() { socket.emit("start_game", (result) => { logCallBack(result); }); }
function auction() { 
    const pass = document.getElementById("pass");
    const auctionPoint = document.getElementById("auctionPoint");
    console.log(`pass: ${pass.checked} | point: ${auctionPoint.value}`);
    socket.emit("auction", pass.checked, auctionPoint.value, (result) => { logCallBack(result); });
}
function selectMainCard() {
    const trump = document.getElementById("trump");
    const friendCard = document.getElementById("friendCard");
    console.log(`trump: ${trump.value} | friendCard: ${friendCard.value}`);
    socket.emit("select_main_card", trump.value, friendCard.value, (result) => { logCallBack(result); });
}
function cardPlayed() { 
    const cardPlay = document.getElementById("cardPlayed");
    console.log(`CardPlayed: ${cardPlay.value}`);
    socket.emit("card_played", cardPlay.value, (result) => { logCallBack(result); });
}
function getGameState() { socket.emit("get_game_state", (result) => { logCallBack(result); });}

const A = document.getElementById("A");
const B = document.getElementById("B");
const C = document.getElementById("C");
const D = document.getElementById("D");
const E = document.getElementById("E");
const F = document.getElementById("F");
const G = document.getElementById("G");

A.addEventListener("click", connect());
B.addEventListener("click", toggleReady);
C.addEventListener("click", startGame);
D.addEventListener("click", auction);
E.addEventListener("click", selectMainCard);
F.addEventListener("click", cardPlayed);
G.addEventListener("click", getGameState);
