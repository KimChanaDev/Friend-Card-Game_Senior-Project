import { GAME_STATE } from "../../Enum/GameState.js";
import { BaseResponseDTO } from "./Response/BaseResponseDTO.js";
export type AuctionPointDTO = {
    playerId?: string;
    isPass: boolean;
    nextPlayerId: string;
    HighestAuctionPlayerId: string;
    HighestAuctionPoint: number;
    gameplayState: GAME_STATE
};

export type AuctionPointResponseDTO = BaseResponseDTO & AuctionPointDTO;