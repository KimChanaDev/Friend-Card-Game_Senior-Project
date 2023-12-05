import {PlayerPointInfo} from "./PlayerPointInfo";

export class WinnerRoundResponse{
    constructor(
        public winnerPlayerIds: string[],
        public winnerTotalPointInRound: number,
        public roundNumber: number,
        public playersPoint: PlayerPointInfo[]
    ) {}
}