import {BaseResponseDTO} from "./BaseResponseDTO.js";

export type TimerResponseDTO = BaseResponseDTO & {
    playerId: string;
    timer: number;
};