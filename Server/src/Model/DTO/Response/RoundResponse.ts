import {PlayerPointInfo} from "./PlayerPointInfo";

export class RoundResponse {
    constructor(
        public winnerPlayerIds: string[],
        public winnerTotalPointInRound: number,
        public roundNumber: number,
        public playersPoint: PlayerPointInfo[],
    ) {}
}

export class RoundResponseModel {
    constructor(
        public currentRound: RoundModel,
        public summaryRound: SummaryRoundModel[],
        public totalGamePointModel: TotalGamePointModel[]
    ) {}
}
export class TotalGamePointModel {
    constructor(
        public playerId: string,
        public playerName: string,
        public totalPoint: number,
        public isHighestPoint: boolean
    ) {}
}
export class RoundModel{
    constructor(
        public roundNumber: number,
        public playersPoint: PlayerPointModel[],
    ) {}
}
export class PlayerPointModel{
    constructor(
        public playerId: string,
        public isRoundWinner: boolean,
        public cardsPointReceive: number,
        public gamePointReceive: number
    ) {}
}
export class SummaryRoundModel{
    constructor(
        public roundNumber: number,
        public playersRoundPointModel: PlayersRoundPointModel[]
    ) {}
}
export class PlayersRoundPointModel{
    constructor(
        public playerId: string,
        public isRoundWinner: boolean,
        public roundPoint: number
    ) {}
}