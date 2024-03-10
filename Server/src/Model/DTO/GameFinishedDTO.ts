import {RoundResponseModel} from "./Response/RoundResponse.js";

export type GameFinishedDTO = {
	winnerId: string;
	winnerName: string;
	winnerPoint: number;
	roundsFinishedDetail: RoundResponseModel
};