import { FriendCardGameRoom } from "../../GameFlow/Game/FriendCardGameRoom.js";
import { FriendCardPlayer } from "../../GameFlow/Player/FriendCardPlayer.js";
import { ActionsDTO } from "./ActionsDTO.js";
import { OtherFriendCardGamePlayerDTO } from "./OtherFriendCardGamePlayerDTO.js";
import { ThisFriendCardGamePlayerDTO } from "./ThisFriendCardGamePlayerDTO.js";
import {GAME_STATE} from "../../Enum/GameState.js";

export class FriendCardGameStateForPlayerDTO{
	private constructor(
		private currentPlayerId: string | undefined,
		private thisPlayer: ThisFriendCardGamePlayerDTO,
		private otherPlayer: OtherFriendCardGamePlayerDTO[],
		private playersInOrderIds: string[],
		private thisPlayerActions: ActionsDTO,
		private gameState: GAME_STATE,
		private gameRoundState: GAME_STATE,
		private gameplayState: GAME_STATE,
		private roundNumber: number,
		private trickNumber: number,
		private isFriendAppeared : boolean,
		private auctionWinnerTeamIds?: string[],
		private anotherTeamIds?: string[]
	) {}

	public static CreateFromFriendCardGameAndPlayer(gameRoom: FriendCardGameRoom, player: FriendCardPlayer): FriendCardGameStateForPlayerDTO
    {
		return new FriendCardGameStateForPlayerDTO(
			gameRoom.GetCurrentRoundGame()?.GetCurrentPlayer().id,
			ThisFriendCardGamePlayerDTO.CreateFromFriendCardGamePlayer(player),
			gameRoom.GetAllPlayerAsArray().filter((p: FriendCardPlayer) => !p.GetIsDisconnected() && p.id !== player.id).map((p: FriendCardPlayer) => OtherFriendCardGamePlayerDTO.CreateFromFriendCardGamePlayer(p)),
			gameRoom.GetCurrentRoundGame().GetPlayerInOrder().map(player => player.id),
			gameRoom.GetCurrentRoundGame().GetActionsDTOForPlayer(player),
			gameRoom.GetGameRoomState(),
			gameRoom.GetCurrentRoundGame().GetRoundState(),
			gameRoom.GetCurrentRoundGame().GetGameplayState(),
			gameRoom.GetCurrentRoundNumber(),
			gameRoom.GetCurrentRoundGame().GetCurrentTrickNumber(),
			gameRoom.GetCurrentRoundGame().IsFriendAppeared(),
			gameRoom.GetCurrentRoundGame().IsFriendAppeared() ? gameRoom.GetCurrentRoundGame().GetAuctionWinnerTeamIds() : undefined,
			gameRoom.GetCurrentRoundGame().IsFriendAppeared() ? gameRoom.GetCurrentRoundGame().GetAnotherTeamIds() : undefined
		);
	}
}