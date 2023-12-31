import {PlayerDTO} from "../PlayerDTO";
export class PlayerDisconnectedResponse{
    constructor(
        public disconnectPlayer: PlayerDTO,
        public newHostPlayer?: PlayerDTO
    ) {}
}