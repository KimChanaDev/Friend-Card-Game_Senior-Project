import { Socket } from "socket.io";
import { CardId } from "../Enum/CardConstant.js";
import { GAME_STATE } from "../Enum/GameState.js";
import { FriendCardGameRoomLogic } from "../GameLogic/Game/FriendCardGameRoomLogic.js";
import { FriendCardPlayerLogic } from "../GameLogic/Player/FriendCardPlayerLogic.js";
import { SocketBadConnectionError, SocketGameAlreadyStartedError, SocketGameNotExistError, SocketRoomFullError, SocketSessionExpiredError, SocketUnauthorizedError, SocketWrongRoomPasswordError } from "../Error/SocketErrorException.js";
import { SocketHandler } from "./SocketHandler.js";
import { GameRoomLogic } from "../GameLogic/Game/GameRoomLogic.js";
import { IJwtValidation } from "../GameLogic/Utils/Authorization/JWT.js";
import { JwtValidationError } from "../Enum/JwtValidationError.js";
import { PlayerLogic } from "../GameLogic/Player/PlayerLogic.js";

export abstract class HandlerValidation extends SocketHandler
{
    public static CanPlayerPlayCard(gameRoom: FriendCardGameRoomLogic, player: FriendCardPlayerLogic, cardId: CardId): void
    {
        if (!gameRoom.GetCurrentRoundGame().CanPlayerPlayCard(player, cardId))
            throw new Error("Cannot play that card");
    }
    public static GameAndRoundStarted(gameRoom: FriendCardGameRoomLogic): void
    {
        if(gameRoom.GetGameRoomState() !== GAME_STATE.STARTED || gameRoom.GetCurrentRoundGame().GetRoundState() !== GAME_STATE.STARTED)
            throw new Error("Game not started");
    }
    public static IsWinnerAuction(gameRoom: FriendCardGameRoomLogic, player: FriendCardPlayerLogic): void
    {
        if(gameRoom.GetCurrentRoundGame().GetHighestAuctionPlayer().id !== player.id)
            throw new Error("You are not the winning auction");
    }
    public static IsOwnerRoom(gameRoom: FriendCardGameRoomLogic, player: FriendCardPlayerLogic): void
    {
        if(player.id === gameRoom.owner.id)
            throw new Error("You are not Owner");
    }
    public static HandshakeHasGameIdAndMiddlewareHasJWT(socket: Socket): void
    {
        if(!socket.handshake.query.gameId || !socket.middlewareData.jwt)
            throw new SocketBadConnectionError();
    }
    public static SocketHandlerNotHasUser(userId: string): void
    {
        if(SocketHandler.connectedUsers.has(userId))
            throw new SocketBadConnectionError();
    }
    public static HasGameRoom(gameRoom: GameRoomLogic | undefined): void
    {
        if(!gameRoom)
            throw new SocketGameNotExistError();
    }
    public static HasUserDocument(userDocument: any): void
    {
        if(!userDocument)
            throw new SocketBadConnectionError();
    }
    public static GameRoomNotStarted(gameRoom: GameRoomLogic): void
    {
        if (gameRoom.GetGameRoomState() !== GAME_STATE.NOT_STARTED)
            throw new SocketGameAlreadyStartedError();
    }
    public static CorrectGameRoomPasswordIfExist(socket: Socket, gameRoom: GameRoomLogic): void
    {
        if (gameRoom.isPasswordProtected)
        {
            const password: string | undefined = socket.handshake.query.password as string;
            if (!password || gameRoom.password !== password)
                throw new SocketWrongRoomPasswordError();
        }
    }
    public static GameRoomFull(gameRoom: GameRoomLogic): void
    {
        if (gameRoom.IsRoomFull())
			throw new SocketRoomFullError();
    }
    public static HandshakeHasToken(socket: Socket): void
    {
        if (!socket.handshake.query.token)
			throw new SocketUnauthorizedError();
    }
    public static ValidateJWTSuccess(socket: Socket, validateResult: IJwtValidation): void
    {
        if (!validateResult.success && validateResult.error === JwtValidationError.EXPIRED)
        {
            throw new SocketSessionExpiredError();
        }
        else if (!validateResult.success)
        {
            throw new SocketUnauthorizedError();
        }
    }
    public static HasPlayerInGameRoom(player: PlayerLogic | undefined): void
    {
        if(!player) 
            throw new Error();
    }
}