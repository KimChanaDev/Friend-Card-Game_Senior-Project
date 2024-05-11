import { FriendCardGameRoom } from "../../GameFlow/Game/FriendCardGameRoom.js";
import { FriendCardPlayer } from "../../GameFlow/Player/FriendCardPlayer.js";
import { ActionsDTO } from "./ActionsDTO.js";
import { OtherFriendCardGamePlayerDTO } from "./OtherFriendCardGamePlayerDTO.js";
import { ThisFriendCardGamePlayerDTO } from "./ThisFriendCardGamePlayerDTO.js";
import {GAME_STATE} from "../../Enum/GameState.js";
import {BaseResponseDTO} from "./Response/BaseResponseDTO";
import {CardId} from "../../Enum/CardConstant";

export class FriendCardGameStateForPlayerDTO{

	private constructor(
		private currentPlayerId: string | undefined,
		private currentPlayerTimeout: number | undefined,
		private thisPlayer: ThisFriendCardGamePlayerDTO,
		private otherPlayer: OtherFriendCardGamePlayerDTO[],
		private playersInOrderIds: string[],
		private thisPlayerActions: ActionsDTO,
		private gameState: GAME_STATE,
		private gameRoundState: GAME_STATE,
		private gameplayState: GAME_STATE,
		private roundNumber: number,
		private trickNumber: number,
		private cardsInField: CardId[],
		private isFriendAppeared : boolean,
		private auctionWinnerTeamIds?: string[],
		private anotherTeamIds?: string[],
		private success: boolean = true
	) {}

	public static CreateFromFriendCardGameAndPlayer(gameRoom: FriendCardGameRoom, player: FriendCardPlayer): FriendCardGameStateForPlayerDTO
    {
		return new FriendCardGameStateForPlayerDTO(
			gameRoom.GetCurrentRoundGame()?.GetCurrentPlayer().UID,
			gameRoom.GetCurrentRoundGame()?.GetCurrentPlayer().GetTimeRemaining(),
			ThisFriendCardGamePlayerDTO.CreateFromFriendCardGamePlayer(player),
			gameRoom.GetAllPlayerAsArray().filter((p: FriendCardPlayer) => !p.GetIsDisconnected() && p.UID !== player.UID).map((p: FriendCardPlayer) => OtherFriendCardGamePlayerDTO.CreateFromFriendCardGamePlayer(p)),
			gameRoom.GetCurrentRoundGame().GetPlayerInOrder().map(player => player.UID),
			gameRoom.GetCurrentRoundGame().GetActionsDTOForPlayer(player),
			gameRoom.GetGameRoomState(),
			gameRoom.GetCurrentRoundGame().GetRoundState(),
			gameRoom.GetCurrentRoundGame().GetGameplayState(),
			gameRoom.GetCurrentRoundNumber(),
			gameRoom.GetCurrentRoundGame().GetCurrentTrickNumber(),
			gameRoom.GetCurrentRoundGame().GetCardsInField(),
			gameRoom.GetCurrentRoundGame().IsFriendAppeared(),
			gameRoom.GetCurrentRoundGame().IsFriendAppeared() ? gameRoom.GetCurrentRoundGame().GetAuctionWinnerTeamIds() : undefined,
			gameRoom.GetCurrentRoundGame().IsFriendAppeared() ? gameRoom.GetCurrentRoundGame().GetAnotherTeamIds() : undefined
		);
	}
}