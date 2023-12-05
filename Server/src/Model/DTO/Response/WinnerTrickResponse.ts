import {CardId} from "../../../Enum/CardConstant";
import {PlayerPointInfo} from "./PlayerPointInfo";

export class WinnerTrickResponse{
    constructor(
        public winnerId: string,
        public winnerCardId: CardId,
        public winnerReceivePoint: number,
        public trickNumber: number,
        public playersPoint: PlayerPointInfo[]
    ) {}
}

