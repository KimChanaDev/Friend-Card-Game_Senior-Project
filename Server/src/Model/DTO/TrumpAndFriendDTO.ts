import { CardId, ColorType } from "../../Enum/CardConstant.js";
import { BaseResponseDTO } from "./Response/BaseResponseDTO.js";
export type TrumpAndFriendDTO = {
    playerId?: string;
    trumpColor: ColorType;
    friendCard: CardId;
    winnerAuctionPoint: number
};

export type TrumpAndFriendResponseDTO = BaseResponseDTO & TrumpAndFriendDTO