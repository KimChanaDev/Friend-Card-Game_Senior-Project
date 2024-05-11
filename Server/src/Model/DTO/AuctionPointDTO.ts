import { GAME_STATE } from "../../Enum/GameState.js";
import { BaseResponseDTO } from "./Response/BaseResponseDTO.js";
export type AuctionPointDTO = {
    playerId?: string;
    isPass: boolean;
    auctionPoint?: number;
    nextPlayerId: string;
    highestAuctionPlayerId: string;
    highestAuctionPoint: number;
};

export type AuctionPointResponseDTO = BaseResponseDTO & AuctionPointDTO;