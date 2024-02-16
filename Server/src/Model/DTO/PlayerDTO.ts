import { Player } from "../../GameFlow/Player/Player.js";

export class PlayerDTO {
	constructor(
		private id: string,
		private username: string,
		private isReady: boolean,
		private isOwner: boolean,
		private imagePath: string,
		private isBot: boolean
	) {}

	public static CreateFromPlayer(player: Player): PlayerDTO {
		return new PlayerDTO(player.UID, player.username, player.GetIsReady(), player.isOwner, player.profileImagePath, player.GetIsDisconnected());
	}
}