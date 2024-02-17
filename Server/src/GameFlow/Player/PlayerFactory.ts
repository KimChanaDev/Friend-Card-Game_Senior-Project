import { GAME_TYPE } from "../../Enum/GameType.js";
import { BadRequestError } from "../../Error/ErrorException.js";
import { FriendCardPlayer } from "./FriendCardPlayer.js";
import { Player } from "./Player.js";

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
}