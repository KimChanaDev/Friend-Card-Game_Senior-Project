import {WinnerRoundResponse} from "./Response/WinnerRoundResponse";

export type GameFinishedDTO = {
	winnerId: string;
	winnerName: string;
	winnerPoint: number;
	roundsFinishedDetail: WinnerRoundResponse[]
};