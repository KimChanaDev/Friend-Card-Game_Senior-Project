import { Socket } from "socket.io";
import { GameRoom } from "./GameRoom.js";
import { FriendCardPlayer } from "../Player/FriendCardPlayer.js";
import { FriendCardGameRound } from "./FriendCardGameRound.js";
import { GAME_STATE } from "../../Enum/GameState.js";
import {WinnerRoundResponse} from "../../Model/DTO/Response/WinnerRoundResponse.js";
import {CardId, ColorType} from "../../Enum/CardConstant.js";
import {GameFinishedDTO} from "../../Model/DTO/GameFinishedDTO.js";
import {SOCKET_EVENT, SOCKET_GAME_EVENTS} from "../../Enum/SocketEvents.js";
import {WinnerTrickResponse} from "../../Model/DTO/Response/WinnerTrickResponse.js";
import {CardPlayedDTO} from "../../Model/DTO/CardPlayedDTO.js";
import {TrumpAndFriendDTO} from "../../Model/DTO/TrumpAndFriendDTO.js";
import {AuctionPointDTO} from "../../Model/DTO/AuctionPointDTO.js";
import {RandomArrayElement} from "../../GameLogic/Utils/Tools.js";

export class FriendCardGameRoom extends GameRoom
{
    protected winner?: FriendCardPlayer | undefined;
    protected playersInGame: Map<string, FriendCardPlayer> = new Map<string, FriendCardPlayer>();
    private winnerPoint: number = 0;
    private roundsInGame: FriendCardGameRound[] = [];
    private currentRoundNumber: number = 0;
    private readonly totalNumberRound: number = 4;
    public StartGameProcess(socket: Socket): void
    {
        this.InitRoundInGame();
        super.SetStartState();
        this.GetCurrentRoundGame().StartRoundProcess(false, this.GetAllPlayerAsArray(), socket,() => this.AuctionTimeOutCallback(socket));
    }
    private InitRoundInGame(): void
    {
        for (let i = 0; i < this.totalNumberRound; i++) {
            this.roundsInGame.push(new FriendCardGameRound(i, super.id));
        }
        this.currentRoundNumber = 0;
    }
    public RestartFriendCardGameRoom(): void {
        super.RestartGameRoom()
        this.winnerPoint = 0;
        this.roundsInGame = [];
        this.currentRoundNumber = 0;
    }
    public GetWinner(): FriendCardPlayer | undefined { return this.winner }
    public GetWinnerPoint(): number { return this.winnerPoint }
    public GetCurrentRoundGame(): FriendCardGameRound { return this.roundsInGame[this.currentRoundNumber]; }
    public GetCurrentRoundNumber(): number { return this.currentRoundNumber; }
    public IsCurrentRoundGameFinished(): boolean {
        return this.GetCurrentRoundGame().GetRoundState() === GAME_STATE.FINISHED
            && this.GetCurrentRoundGame().GetGameplayState() === GAME_STATE.FINISHED;
    }
    public GetAllPlayerAsArray(): FriendCardPlayer[] { return Array.from(this.playersInGame.values()); }
    public GetAllPlayerIdAsArray(): string[]
    {
        const playerIds: string[] = [];
        this.GetAllPlayerAsArray().forEach(a => playerIds.push(a.UID));
        return playerIds;
    }
    public NextRoundProcess(socket: Socket): void
    {
        this.currentRoundNumber++;
        this.GetCurrentRoundGame().StartRoundProcess(true, this.GetAllPlayerAsArray(), socket,() => this.AuctionTimeOutCallback(socket));
    }
    public CheckGameFinished(): boolean{
        const nextRoundNumberTemp = this.currentRoundNumber + 1
        return nextRoundNumberTemp >= this.totalNumberRound;
    }
    public GetAllRoundResult(): WinnerRoundResponse[]{
        const response: WinnerRoundResponse[] = []
        this.roundsInGame.forEach(round => {
            const roundFinishedInfo = round.GetRoundFinishedInfo()
            if (roundFinishedInfo){
                response.push(roundFinishedInfo)
            }
        })
        return response
    }
    public DisconnectPlayer(player: FriendCardPlayer): void
    {
        super.DisconnectPlayer(player);

		if (this.GetGameRoomState() === GAME_STATE.STARTED)
        {
			if (this.NumConnectedPlayersInGame() === 1)
            {
				this.winner = Array.from(this.playersInGame.values()).find((player) => !player.GetIsDisconnected());
				return this.GetCurrentRoundGame().FinishRound();
			}
            else
            {
                // TODO add bot player
                // if (this.GetCurrentRoundGame().GetCurrentPlayer().id === player.id)  // TODO bot play
                //     console.log('Bot play!');
            }
		}
    }
    public FinishGameProcess(): void
    {
        let winnerPoint: number = -500;
        let winnerPlayer: FriendCardPlayer | undefined;
        this.playersInGame.forEach(player => {
            const totalGamePointByPlayer: number = player.GetTotalGamePoint()
            if(totalGamePointByPlayer > winnerPoint)
            {
                winnerPoint = totalGamePointByPlayer;
                winnerPlayer = player;
            }
        })
        this.winner = winnerPlayer;
        this.winnerPoint = winnerPoint;
        super.SetFinishState();
        // TODO save stat to database
    }
    public AuctionTimeOutCallback(socket: Socket): void{
        console.log("Auto auction")
        let auctionPass: boolean
        let auctionPoint: number | undefined
        if(this.GetCurrentRoundGame().IsFirstAuction()){
            auctionPass = false
            auctionPoint = 55
        }else{
            auctionPass = true
            auctionPoint = 100 // Not important
        }
        const playerId: string = this.GetCurrentRoundGame().GetCurrentPlayer().UID
        this.GetCurrentRoundGame().AuctionProcess(
            auctionPass
            , auctionPoint
            , socket
            , () => this.AuctionTimeOutCallback(socket)
            , () => this.SelectMainCardTimeOutCallback(socket)
        )
        const [nextPlayerId, highestAuctionPlayerId, currentAuctionPoint, gameplayState] = this.GetCurrentRoundGame().GetInfoForAuctionPointResponse();
        const auctionPointDTO: AuctionPointDTO = {
            playerId: playerId,
            isPass: auctionPass,
            auctionPoint: !auctionPass ? auctionPoint : undefined,
            nextPlayerId: nextPlayerId,
            highestAuctionPlayerId: highestAuctionPlayerId ?? "",
            highestAuctionPoint: currentAuctionPoint,
        };
        this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.AUCTION, this.id, auctionPointDTO);
    }
    public SelectMainCardTimeOutCallback(socket: Socket): void{
        console.log("Auto Select Main Card")
        const player: FriendCardPlayer = this.GetCurrentRoundGame().GetCurrentPlayer()
        const card: CardId = player.GetHandCard().RandomCardNotValidInHand()
        const color: ColorType = player.GetHandCard().RandomColor()
        this.GetCurrentRoundGame().SetTrumpAndFriendProcess(color, card, player, socket, () => this.PlayCardTimeOutCallback(socket))
        const trumpAndFriendDTO :TrumpAndFriendDTO = {
            playerId: player.UID,
            trumpColor: color,
            friendCard: card
        };
        this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.SELECT_MAIN_CARD, this.id, trumpAndFriendDTO);
    }
    public PlayCardTimeOutCallback(socket: Socket): void{
        console.log("Auto Play Card")
        const player: FriendCardPlayer = this.GetCurrentRoundGame().GetCurrentPlayer()
        const cardsCanPlay: CardId[] = this.GetCurrentRoundGame().CardsCanPlay(player)
        const randomCard: CardId = RandomArrayElement(cardsCanPlay)
        const playedCard: CardId = this.GetCurrentRoundGame().PlayCardProcess(randomCard, player.UID, socket, () => this.PlayCardTimeOutCallback(socket))
        if(this.IsCurrentRoundGameFinished() && this.CheckGameFinished()){
            this.FinishGameProcess()
            const winner: FriendCardPlayer | undefined = this.GetWinner()
            if(winner){
                const winnerResponse: GameFinishedDTO = {
                    winnerId: winner.UID,
                    winnerName: winner.username,
                    winnerPoint: this.GetWinnerPoint(),
                    roundsFinishedDetail: this.GetAllRoundResult()
                }
                this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.GAME_FINISHED, this.id, winnerResponse);
            }
            else{
            }
        }
        else if (this.IsCurrentRoundGameFinished())
        {
            const roundFinishedResponse: WinnerRoundResponse[] = this.GetAllRoundResult()
            this.NextRoundProcess(socket);
            this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.ROUND_FINISHED, this.id, roundFinishedResponse);
        }
        else if (this.GetCurrentRoundGame().IsEndOfTrick())
        {
            const winnerTrickModel: WinnerTrickResponse | undefined = this.GetCurrentRoundGame().GetLatestWinnerTrickResponse();
            this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.TRICK_FINISHED, this.id, winnerTrickModel);
        }
        const cardPlayedDTO: CardPlayedDTO = {
            playerId: player.UID,
            cardId: playedCard
        };
        this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.CARD_PLAYED, this.id, cardPlayedDTO);
    }
    private EmitToRoomAndSender(socket: Socket, event: SOCKET_EVENT, gameId: string, ...args: any[]): void
    {
        socket.to(gameId).emit(event, ...args);
        socket.emit(event, ...args);
    }
}