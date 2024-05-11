import {BOT_CONFIG} from "../../Enum/BotConfig";

export abstract class Player
{
	private isReady: boolean = false;
	private isDisconnected: boolean = false;
	protected constructor(
		public readonly UID: string,
		public readonly username: string,
		public readonly displayName: string,
		public readonly socketId: string,
		public isOwner: boolean,
		public readonly firebaseId: string,
		public readonly profileImagePath: string,
		private botLevel?: number | undefined
	)
	{
		if(isOwner) this.isReady = true;
		if(botLevel !== undefined){
			this.isDisconnected = true;
			this.isReady = true;
		}
	}

	public ToggleIsReady(): void { this.isReady = !this.isReady; }
	public SetIsReady(bool : boolean): void { this.isReady = bool }
	public SetIsOwner(bool : boolean): void { this.isOwner = bool }
	public GetIsReady(): boolean { return this.isReady; }
	public SetDisconnected(bool : boolean): void { this.isDisconnected = bool }
	public GetIsDisconnected(): boolean { return this.isDisconnected; }
	public GetBotLevel(): number | undefined { return this.botLevel }
	public SetBotLevel(level: number): void { this.botLevel = level }
}
