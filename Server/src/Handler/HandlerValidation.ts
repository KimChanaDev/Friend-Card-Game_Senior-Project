import { Socket } from "socket.io";
import {CardId, ColorType} from "../Enum/CardConstant.js";
import { GAME_STATE } from "../Enum/GameState.js";
import { FriendCardGameRoom } from "../GameFlow/Game/FriendCardGameRoom.js";
import { FriendCardPlayer } from "../GameFlow/Player/FriendCardPlayer.js";
import { SocketBadConnectionError, SocketGameAlreadyStartedError, SocketGameNotExistError, SocketRoomFullError, SocketSessionExpiredError, SocketUnauthorizedError, SocketWrongRoomPasswordError } from "../Error/SocketErrorException.js";
import { GameRoom } from "../GameFlow/Game/GameRoom.js";
import { IJwtValidation } from "../GameLogic/Utils/Authorization/JWT.js";
import { JwtValidationError } from "../Enum/JwtValidationError.js";
import { Player } from "../GameFlow/Player/Player.js";

export abstract class HandlerValidation
{
    public static IsPlayerTurn(gameRoom: FriendCardGameRoom, player: FriendCardPlayer): void
    {
        if(!gameRoom.GetCurrentRoundGame().IsPlayerTurn(player.id))
            throw new Error("Not your turn");
    }
    public static HasCardOnHand(gameRoom: FriendCardGameRoom, player: FriendCardPlayer, cardId: CardId): void
    {
        if (!gameRoom.GetCurrentRoundGame().CanPlayerPlaySpecificCard(player, cardId))
            throw new Error("Cannot play that card");
    }
    public static GameAndRoundStarted(gameRoom: FriendCardGameRoom): void
    {
        if(gameRoom.GetGameRoomState() !== GAME_STATE.STARTED || gameRoom.GetCurrentRoundGame().GetRoundState() !== GAME_STATE.STARTED)
            throw new Error("Game not started");
    }
    public static IsFriendCardAndTrumpCardValid(gameRoom: FriendCardGameRoom, Friend: CardId, Trump: ColorType): void
    {
        if( !gameRoom.GetCurrentRoundGame().deck.IsCardValidForDeck(Friend) || !gameRoom.GetCurrentRoundGame().deck.IsColorValidForDeck(Trump) )
            throw new Error("Friend or Trump are not valid");
    }
    public static GameAndRoundAndGameplayStarted(gameRoom: FriendCardGameRoom): void
    {
        if( gameRoom.GetGameRoomState() !== GAME_STATE.STARTED
            || gameRoom.GetCurrentRoundGame().GetRoundState() !== GAME_STATE.STARTED
            || gameRoom.GetCurrentRoundGame().GetGameplayState() !== GAME_STATE.STARTED )
            throw new Error("Gameplay not started");
    }
    public static IsGameRoomNotStartedState(gameRoom: FriendCardGameRoom): void
    {
        if(gameRoom.GetGameRoomState() === GAME_STATE.STARTED)
            throw new Error("Game room is started state");
    }
    public static IsGameRoomStartedState(gameRoom: FriendCardGameRoom): void
    {
        if(gameRoom.GetGameRoomState() !== GAME_STATE.STARTED)
            throw new Error("Game room is not started start");
    }
    public static IsGamePlayNotStarted(gameRoom: FriendCardGameRoom): void
    {
        if( gameRoom.GetCurrentRoundGame().GetGameplayState() === GAME_STATE.STARTED )
            throw new Error("Gameplay is started");
    }

    public static IsWinnerAuction(gameRoom: FriendCardGameRoom, player: FriendCardPlayer): void
    {
        if(gameRoom.GetCurrentRoundGame().GetHighestAuctionPlayer()?.id !== player.id)
            throw new Error("You are not the winning auction");
    }
    public static IsOwnerRoom(gameRoom: FriendCardGameRoom, player: FriendCardPlayer): void
    {
        if(player.id !== gameRoom.owner.id)
            throw new Error("You are not Owner");
    }
    public static HandshakeHasGameIdAndMiddlewareHasJWT(socket: Socket): void
    {
        if(!socket.handshake.query.gameId || !socket.middlewareData.jwt)
            throw new SocketBadConnectionError();
    }
    public static SocketHandlerNotHasUser(connectedUsers: Set<string>,userId: string): void
    {
        if(connectedUsers.has(userId))
            throw new SocketBadConnectionError();
    }
    public static HasGameRoom(gameRoom: GameRoom | undefined): void
    {
        if(!gameRoom)
            throw new SocketGameNotExistError();
    }
    public static HasUserDocument(userDocument: any): void
    {
        if(!userDocument)
            throw new SocketBadConnectionError();
    }
    public static GameRoomNotStarted(gameRoom: GameRoom): void
    {
        if (gameRoom.GetGameRoomState() !== GAME_STATE.NOT_STARTED)
            throw new SocketGameAlreadyStartedError();
    }
    public static CorrectGameRoomPasswordIfExist(socket: Socket, gameRoom: GameRoom): void
    {
        if (gameRoom.isPasswordProtected)
        {
            const password: string | undefined = socket.handshake.query.password as string;
            if (!password || gameRoom.password !== password)
                throw new SocketWrongRoomPasswordError();
        }
    }
    public static GameRoomFull(gameRoom: GameRoom): void
    {
        if (gameRoom.IsRoomFull())
			throw new SocketRoomFullError();
    }
    public static HandshakeHasToken(socket: Socket): void
    {
        if (!socket.handshake.query.token)
			throw new SocketUnauthorizedError();
    }
    public static ValidateJWTSuccess(validateResult: IJwtValidation): void
    {
        if (!validateResult.success && validateResult.error === JwtValidationError.EXPIRED)
            throw new SocketSessionExpiredError();
        else if (!validateResult.success)
            throw new SocketUnauthorizedError();
    }
    public static HasPlayerInGameRoom(player: Player | undefined): void
    {
        if(!player) 
            throw new Error();
    }
    public static PlayerGreaterThanFour(gameRoom: GameRoom): void 
    {
        if (gameRoom.NumPlayersInGame() < 4) 
            throw Error("Minimum 4 players required");
    }
    public static AreAllPlayersReady(gameRoom: GameRoom): void
    {
        if (!gameRoom.AreAllPlayersReady())
            throw Error('Not all players ready');
    }
    public static AcceptableAuctionPoint(pass: boolean, point: number): void
    {
        if (!pass && (point % 5 !== 0 || point < 55 || point > 100)) 
            throw new Error("Incorrect auction point");
    }
    public static FirstPlayerCannotNotPass(gameRoom: FriendCardGameRoom, pass: boolean): void
    {
        if (pass && gameRoom.GetCurrentRoundGame().IsFirstAuction())
            throw new Error("The first player cannot pass");
    }
    public static AuctionPointGreaterThan(pass: boolean,newPoint: number, previosPoint: number): void
    {
        if(!pass && (newPoint <= previosPoint))
            throw new Error("New auction point less than previos");
    }
    public static NotHasCardInHand(player: FriendCardPlayer, friendCard: CardId): void
    {
        if (player.GetHandCard().HasCard(friendCard))
            throw new Error("You have this card on your hand");
    }
    public static NotAlreadySetTrumpAndFriend(gameRoom: FriendCardGameRoom)
    {
        if(gameRoom.GetCurrentRoundGame().IsTrumpAndFriendNotUndefined())
            throw new Error("Trump and friend already setup");
    }
    public static AlreadySetTrumpAndFriend(gameRoom: FriendCardGameRoom)
    {
        if(!gameRoom.GetCurrentRoundGame().IsTrumpAndFriendNotUndefined())
            throw new Error("Trump and friend are not setup");
    }
}