import {GAME_STATE} from "../../Enum/GameState.js";
import {GAME_TYPE} from "../../Enum/GameType.js";
import {PlayerDTO} from "../../Model/DTO/PlayerDTO.js";
import {GamesStore} from "./GameStore.js";
import {Player} from "../Player/Player.js";
import {GetRandomKeyFromMap} from "../../GameLogic/Utils/Tools.js";

export abstract class GameRoom
{
    private gameState: GAME_STATE = GAME_STATE.NOT_STARTED;
	protected abstract winner?: Player;
    protected abstract playersInGame: Map<string, Player>;
	private removeFromGameStoreTimeout?: NodeJS.Timeout;
    
    constructor(
        public readonly gameType: GAME_TYPE,
		public owner: { id: string; username: string },
		public readonly maxPlayers: number,
		public readonly roomName: string,
		public readonly isPasswordProtected: boolean,
		public readonly createdAt: Date,
		public readonly id: string,
		public readonly password?: string)
    {
    }
    public AddPlayer(player: Player): void
    {
		this.playersInGame.set(player.id, player);
		this.StopRemoveFromGameStoreTimeout();
	}
    public RestartGameRoom(): void {
        this.gameState = GAME_STATE.NOT_STARTED
        this.winner = undefined
    }
    public GetPlayerById(id: string): Player | undefined { return this.playersInGame.get(id); }
    public GetAllPlayersDTO(): PlayerDTO[] { return Array.from(this.playersInGame.values()).map((player) => PlayerDTO.CreateFromPlayer(player)); }
    public AreAllPlayersReady(): boolean { return Array.from(this.playersInGame.values()).every((player) => player.GetIsReady()); }
    public NumPlayersInGame(): number { return this.playersInGame.size; }
    public NumConnectedPlayersInGame(): number { return Array.from(this.playersInGame.values()).filter((player) => !player.GetIsDisconnected()).length; }
    public IsRoomFull(): boolean { return this.maxPlayers - this.NumPlayersInGame() <= 0; }
    public SetStartState(): void { this.gameState = GAME_STATE.STARTED; }
    public SetFinishState(): void { this.gameState = GAME_STATE.FINISHED; }
    public GetGameRoomState(): number { return this.gameState }
    public GetWinner(): Player | undefined { return this.winner;}
    public DisconnectPlayer(player: Player): void
    {
        if (this.gameState === GAME_STATE.STARTED){
            player.SetDisconnected(true);
            /// TODO Add bot here
        }
        else {
            this.playersInGame.delete(player.id);
        }
        if (this.NumConnectedPlayersInGame() <= 0) this.StartRemoveFromGameStoreTimeout();
    }
    public SetNewHostOrOwnerRoom(): Player | undefined{
        const randomPlayerIdKey: string | undefined = GetRandomKeyFromMap(this.playersInGame)
        if(randomPlayerIdKey){
            const player: Player | undefined = this.playersInGame.get(randomPlayerIdKey);
            if(player){
                this.owner = {
                    id: player.id,
                    username: player.username
                }
                player.SetIsOwner(true)
                player.SetIsReady(true)
                this.playersInGame.set(randomPlayerIdKey, player);
                return player
            }
        }
    }
    private StartRemoveFromGameStoreTimeout(): void
    {
        this.removeFromGameStoreTimeout = setTimeout(() => {
            GamesStore.getInstance.DeleteGameById(this.id);
        }, 0);
    }
    private StopRemoveFromGameStoreTimeout(): void 
    {
		if (this.removeFromGameStoreTimeout) 
            clearTimeout(this.removeFromGameStoreTimeout);
	}
}