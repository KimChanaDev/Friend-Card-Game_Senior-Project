import { GameRoom } from "./GameRoom.js";
import { FriendCardPlayer } from "../Player/FriendCardPlayer.js";
import { FriendCardGameRound } from "./FriendCardGameRound.js";
import { GAME_STATE } from "../../Enum/GameState.js";
import {WinnerRoundResponse} from "../../Model/DTO/Response/WinnerRoundResponse.js";
import {PlayerPointInfo} from "../../Model/DTO/Response/PlayerPointInfo.js";

export class FriendCardGameRoom extends GameRoom
{
    protected winner?: FriendCardPlayer | undefined;
    protected playersInGame: Map<string, FriendCardPlayer> = new Map<string, FriendCardPlayer>();
    private winnerPoint: number = 0;
    private roundsInGame: FriendCardGameRound[] = [];
    private currentRoundNumber: number = 0;
    private readonly totalNumberRound: number = 4;
    public StartGameProcess(): void
    {
        this.InitRoundInGame();
        super.SetStartState();
        this.GetCurrentRoundGame().StartRoundProcess(this.GetAllPlayerAsArray());
    }
    private InitRoundInGame(): void
    {
        for (let i = 0; i < this.totalNumberRound; i++) {
            this.roundsInGame.push(new FriendCardGameRound(i));
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
        this.GetAllPlayerAsArray().forEach(a => playerIds.push(a.id));
        return playerIds;
    }
    public NextRoundProcess(): void
    {
        this.currentRoundNumber++;
        this.GetCurrentRoundGame().StartRoundProcess(this.GetAllPlayerAsArray());
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
}