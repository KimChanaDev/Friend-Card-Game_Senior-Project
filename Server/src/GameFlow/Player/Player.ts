export abstract class Player
{
	private isReady: boolean = false;
	private isDisconnected: boolean = false;
	protected constructor(
		public UID: string,
		public username: string,
		public socketId: string,
		public isOwner: boolean,
		public firebaseId: string
	)
	{
		if(isOwner) this.isReady = true;
	}
	
	public ToggleIsReady(): void { this.isReady = !this.isReady; }
	public SetIsReady(bool : boolean): void { this.isReady = bool }
	public SetIsOwner(bool : boolean): void { this.isOwner = bool }
	public GetIsReady(): boolean { return this.isReady; }
	public SetDisconnected(bool : boolean): void { this.isDisconnected = bool }
	public GetIsDisconnected(): boolean { return this.isDisconnected; }
}
