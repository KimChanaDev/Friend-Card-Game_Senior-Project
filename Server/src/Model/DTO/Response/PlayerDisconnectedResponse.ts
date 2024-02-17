import {PlayerDTO} from "../PlayerDTO.js";
export class PlayerDisconnectedResponse{
    constructor(
        public disconnectPlayer: PlayerDTO,
        public newHostPlayer?: PlayerDTO,
    ) {}
}