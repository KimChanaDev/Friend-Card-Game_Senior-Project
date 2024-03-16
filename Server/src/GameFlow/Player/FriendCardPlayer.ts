import { DeckLogic } from "../../GameLogic/Card/DeckLogic.js";
import { Player } from "./Player.js";

export class FriendCardPlayer extends Player
{
	private handCard: DeckLogic = new DeckLogic();
	private gamePoint: Map<number, number> = new Map<number, number>();
	private roundPoint: Map<number, number> = new Map<number, number>();
	private timer: NodeJS.Timeout | null = null;
	private startTime: number | null = null;
	private totalTimeInSec: number | null = null;

	constructor(id: string, username: string, displayName: string, socketId: string, isOwner: boolean, firebaseId: string, profileImagePath: string, botLevel?: number | undefined)
    {
		super(id, username, displayName, socketId, isOwner, firebaseId, profileImagePath, botLevel);
	}
	public BotPlay(totalTimer:number, delayInSec: number, callback: () => void): void {
		this.ClearTimer()
		if (!this.timer) {
			this.totalTimeInSec = totalTimer
			this.startTime = Date.now();
			this.timer = setTimeout(() => {
				console.log("BOT Timer expired!");
				this.timer = null;
			}, this.totalTimeInSec * 1000 );
		}
		setTimeout(() => {
			callback()
		}, delayInSec * 1000 );
	}
	public StartTimer(secTimeInTimer: number, callback: () => void): void {
		this.ClearTimer()
		if (!this.timer) {
			this.totalTimeInSec = secTimeInTimer
			this.startTime = Date.now();
			this.timer = setTimeout(() => {
				console.log("Timer expired!");
				this.timer = null;
				callback()
			}, this.totalTimeInSec * 1000 );
		}
	}
	public ClearTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
			this.startTime = null;
			this.totalTimeInSec = null;
		}
	}
	public GetTimeRemaining(): number | undefined {
		if (this.startTime && this.timer && this.totalTimeInSec) {
			const currentTime = Date.now();
			const elapsedTime = currentTime - this.startTime;
			return Math.max(0, Math.ceil(((this.totalTimeInSec * 1000) - elapsedTime)/1000));
		}
		return undefined;
	}
	public GetTotalGamePoint(): number {
		const valuesArray: number[] = Array.from(this.gamePoint.values());
		return valuesArray.reduce((accumulator, currentValue) => {
			return accumulator + currentValue;
		}, 0);
	}
	public GetGamePoint(roundNumber: number): number {
		return this.gamePoint.get(roundNumber) ?? 0
	}
	public AddGamePoint(roundNumber: number, point: number): void {
		this.gamePoint.set(roundNumber, point)
	}
	public DecreaseGamePoint(roundNumber: number, point: number): void {
		this.gamePoint.set(roundNumber, -point)
	}
	public ClearPlayerPoint(): void {
		this.roundPoint.clear()
		this.gamePoint.clear()
	}
	public SetRoundPoint(round: number, point: number): void { this.roundPoint.set(round, point); }
	public AddRoundPoint(round: number, addPoint: number): void
	{
		let newPoint: number;
		let previousPoint: number | undefined = this.roundPoint.get(round);
		newPoint = previousPoint ? previousPoint+addPoint : addPoint;
		this.roundPoint.delete(round);
		this.roundPoint.set(round, newPoint);
	}
	public GetRoundPoint(round: number): number { return this.roundPoint.get(round) ?? 0; }
	public IsActive(): boolean { return !this.GetIsDisconnected()} // && this.numTurnsToWait <= 0;
	public SetHandCard(handCardSet: DeckLogic): void { this.handCard = handCardSet; }
	public GetHandCard(): DeckLogic { return this.handCard; }
}