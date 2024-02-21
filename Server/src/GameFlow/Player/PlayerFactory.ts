import { GAME_TYPE } from "../../Enum/GameType.js";
import { BadRequestError } from "../../Error/ErrorException.js";
import { FriendCardPlayer } from "./FriendCardPlayer.js";
import { Player } from "./Player.js";
import {GUEST_CONFIG} from "../../Enum/GuestConfig.js";

export class PlayerFactory
{
	public static CreatePlayerObject(
		gameType: GAME_TYPE,
		id: string,
		username: string,
		socketId: string,
		isOwner: boolean,
		firebaseId: string,
		profileImagePath: string
	): Player
    {
        if (gameType === GAME_TYPE.FRIENDCARDGAME) 
            return new FriendCardPlayer(id, username, socketId, isOwner, firebaseId, profileImagePath);
        throw new BadRequestError();
	}
	public static CreateBotPlayerObject(
		gameType: GAME_TYPE,
		id: string,
		username: string,
		socketId: string,
		isOwner: boolean,
		firebaseId: string,
		profileImagePath: string,
		botLevel: number
	): Player
	{
		if (gameType === GAME_TYPE.FRIENDCARDGAME)
			return new FriendCardPlayer(id, username, socketId, isOwner, firebaseId, profileImagePath, botLevel);
		throw new BadRequestError();
	}
	public static CreateGuestPlayerObject(
		gameType: GAME_TYPE,
	): Player
	{
		if (gameType === GAME_TYPE.FRIENDCARDGAME)
			return new FriendCardPlayer(GUEST_CONFIG.UID, GUEST_CONFIG.USERNAME, GUEST_CONFIG.SOCKET_ID, true, GUEST_CONFIG.FIREBASE_ID, GUEST_CONFIG.IMAGE);
		throw new BadRequestError();
	}
}