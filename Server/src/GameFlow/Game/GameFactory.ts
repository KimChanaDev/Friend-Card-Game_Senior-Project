import { Guid } from 'guid-typescript';

import { GAME_TYPE } from "../../Enum/GameType.js";
import { BadRequestError } from "../../Error/ErrorException.js";
import { GameRoom } from "./GameRoom.js";
import { FriendCardGameRoom } from "./FriendCardGameRoom.js";
import {GUEST_CONFIG} from "../../Enum/GuestConfig.js";

export class GameFactory
{
	public static CreateGame(
		gameType: GAME_TYPE,
		owner: { UID: string; username: string },
		maxPlayers: number,
		roomName: string,
		isPasswordProtected: boolean,
		createdAt: Date,
		id: string,
		password?: string
	): GameRoom {
		if (gameType === GAME_TYPE.FRIENDCARDGAME)
        {
			return new FriendCardGameRoom(
				gameType,
				owner,
				maxPlayers,
				roomName,
				isPasswordProtected,
				createdAt,
				id,
				password
			);
        }
        else
        {
            throw new BadRequestError();
        }

	}

	public static CreateGuestGame(
		gameType: GAME_TYPE,
	): GameRoom {
		if (gameType === GAME_TYPE.FRIENDCARDGAME)
		{
			return new FriendCardGameRoom(
				gameType,
				{ UID: GUEST_CONFIG.UID, username: GUEST_CONFIG.USERNAME },
				4,
				GUEST_CONFIG.ROOM_NAME,
				false,
				new Date(Date.now()),
				Guid.create().toString(),
				undefined
			);
		}
		else
		{
			throw new BadRequestError();
		}
	}
}