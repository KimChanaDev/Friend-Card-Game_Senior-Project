import { Namespace, Server, Socket} from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { GAME_TYPE } from '../Enum/GameType.js';
import { GameRoom } from '../GameFlow/Game/GameRoom.js';
import { Player } from '../GameFlow/Player/Player.js';
import { GamesStore } from '../GameFlow/Game/GameStore.js';
import { PlayerFactory } from '../GameFlow/Player/PlayerFactory.js';
import { PlayerDTO } from '../Model/DTO/PlayerDTO.js';
import { BUILD_IN_SOCKET_GAME_EVENTS, SOCKET_EVENT, SOCKET_GAME_EVENTS } from '../Enum/SocketEvents.js';
import {
	SocketBadConnectionError,
	SocketGameAlreadyStartedError,
	SocketGameNotExistError,
	SocketRoomFullError,
	SocketSessionExpiredError,
	SocketUnauthorizedError,
	SocketWrongRoomPasswordError
} from '../Error/SocketErrorException.js';
import {IJwtValidation, JWTPayLoadInterface, ValidateJWT} from '../GameLogic/Utils/Authorization/JWT.js';
import { HandlerValidation } from './HandlerValidation.js';
import {PlayerDisconnectedResponse} from "../Model/DTO/Response/PlayerDisconnectedResponse.js";
import {JwtPayload} from "jsonwebtoken";
import {UserDataModel} from "../Model/Entity/UserData.js";
import {InvalidCredentialsError} from "../Error/ErrorException.js";
import {GameFactory} from "../GameFlow/Game/GameFactory.js";
import {DISCONNECT_REASON} from "../Enum/DisconnectReason.js";

export type SocketNextFunction = (err?: ExtendedError | undefined) => void;
type UserGameMap = { [UID: string]: string };
export abstract class SocketHandler
{
	protected static connectedUsers: UserGameMap = {};
	protected static io: Server;
	private static isIoSet: boolean = false;
    protected namespace: Namespace;
	protected static JoinGameRoom(userId: string, gameId: string): void { SocketHandler.connectedUsers[userId] = gameId; }
	public static GetGameId(userId: string): string | undefined { return SocketHandler.connectedUsers[userId]; }
	protected static LeaveGameRoom(userId: string): void { delete SocketHandler.connectedUsers[userId]; }
	public static HasUserIdInConnectedUsers(userId: string): boolean { return userId in SocketHandler.connectedUsers; }

    protected constructor(io: Server, namespaceName: GAME_TYPE) {
		if (!SocketHandler.isIoSet) {
			SocketHandler.io = io;
			SocketHandler.isIoSet = true;
		}

		const namespace: string = '/' + namespaceName;
		SocketHandler.InitializeIo(namespace);
		this.namespace = SocketHandler.io.of(namespace);
		this.RegisterListeners();
	}

	protected abstract OnConnection(socket: Socket, game: GameRoom, player: Player): void;
	public static EmitToSpecificRoom(event: SOCKET_EVENT, gameId: string, ...args: any[] ): void{
		SocketHandler.io.of(GAME_TYPE.FRIENDCARDGAME).to(gameId).emit(event, ...args);
	}
	protected static EmitToRoomAndSender(socket: Socket, event: SOCKET_EVENT, gameId: string, ...args: any[]): void
	{
		socket.to(gameId).emit(event, ...args);
		socket.emit(event, ...args);
	}
	private static InitializeIo(namespace: string): void
    {
		SocketHandler.io
			.of(namespace)
			.use(this.AddMiddlewareDataProperty)
			.use(this.VerifyJwt)
			.use(this.ConnectToGameRoom);
    }
	private static AddMiddlewareDataProperty(socket: Socket, next: SocketNextFunction): void
	{
		socket.middlewareData = {};
		next();
	}
	private static async VerifyJwt(socket: Socket, next: SocketNextFunction): Promise<void>
	{
		try
		{
			const isGuest: string = socket.handshake.query.isGuest as string
			if(isGuest !== "true"){
				HandlerValidation.HandshakeHasToken(socket);
				const validateResult: IJwtValidation = await ValidateJWT(socket.handshake.query.token as string);
				HandlerValidation.ValidateJWTSuccess(validateResult);
				socket.middlewareData.jwt = validateResult.payload;
			}
			return next();
		}
		catch (ex : any)
		{
			if(ex instanceof SocketUnauthorizedError) return next(ex);
			if(ex instanceof SocketSessionExpiredError) return next(ex);
		}
	}
	private static async ConnectToGameRoom(socket: Socket, next: SocketNextFunction): Promise<void>
	{
		try {
			const isGuest: string = socket.handshake.query.isGuest as string
			if(isGuest !== "true"){
				HandlerValidation.HandshakeHasGameIdAndMiddlewareHasJWT(socket);
				const gameId: string = socket.handshake.query.gameId as string;
				const jwtPayload: JWTPayLoadInterface | JwtPayload | undefined = socket.middlewareData.jwt;
				HandlerValidation.HasJWT(jwtPayload)
				const user = await UserDataModel.findOne({
					firebaseId: jwtPayload!.firebaseId,
				});
				if (!user) return next(new InvalidCredentialsError());
				HandlerValidation.SocketHandlerNotHasUser(SocketHandler.connectedUsers, user.UID);
				const gameRoom: GameRoom | undefined = GamesStore.getInstance.GetGameById(gameId);
				HandlerValidation.HasGameRoom(gameRoom);
				HandlerValidation.GameRoomNotStarted(gameRoom!);
				HandlerValidation.CorrectGameRoomPasswordIfExist(socket, gameRoom!);
				HandlerValidation.GameRoomFull(gameRoom!);

				SocketHandler.JoinGameRoom(user.UID, gameId)
				const newPlayer: Player = PlayerFactory.CreatePlayerObject(
					gameRoom!.gameType,
					user.UID,
					user.username,
					user.displayName,
					socket.id,
					gameRoom!.owner.UID === user.UID,
					jwtPayload!.firebaseId,
					user.imagePath
				);
				gameRoom!.AddPlayer(newPlayer);
				socket.join(gameId);
				const playerModel: PlayerDTO = PlayerDTO.CreateFromPlayer(newPlayer);
				socket.to(gameId).emit(SOCKET_GAME_EVENTS.PLAYER_CONNECTED, playerModel);
				socket.emit(SOCKET_GAME_EVENTS.PLAYERS_IN_GAME, {
					players: gameRoom!.GetAllPlayersDTO(),
					thisPlayer: playerModel
				});
			}
			return next();
		}
		catch(ex: any)
		{
			if(ex instanceof SocketBadConnectionError) return next(ex);
			if(ex instanceof SocketGameNotExistError) return next(ex);
			if(ex instanceof SocketGameAlreadyStartedError) return next(ex);
			if(ex instanceof SocketWrongRoomPasswordError) return next(ex);
			if(ex instanceof SocketRoomFullError) return next(ex);
		}
	}
	private RegisterListeners(): void
	{
		console.log('Before connection');
		this.namespace.on(BUILD_IN_SOCKET_GAME_EVENTS.CONNECTION, (socket: Socket) => {
			console.log('After connection');
			const gameAndPlayer: {gameRoom: GameRoom, player: Player} | undefined = this.RegisterBaseListeners(socket);
			if (!gameAndPlayer) return;
			this.OnConnection(socket, gameAndPlayer.gameRoom, gameAndPlayer.player);
		});
	}
	private RegisterBaseListeners(socket: Socket): {gameRoom: GameRoom, player: Player} | undefined
	{
		try
		{
			let gameRoom: GameRoom | undefined
			let player: Player | undefined
			const isGuest: string = socket.handshake.query.isGuest as string
			if(isGuest === "true"){
				gameRoom = GameFactory.CreateGuestGame(socket.handshake.query.gameType as GAME_TYPE);
				player = PlayerFactory.CreateGuestPlayerObject(gameRoom.gameType)
				gameRoom.AddPlayer(player);
				socket.join(gameRoom.id);
				const playerModel: PlayerDTO = PlayerDTO.CreateFromPlayer(player);
				socket.to(gameRoom.id).emit(SOCKET_GAME_EVENTS.PLAYER_CONNECTED, playerModel);
				socket.emit(SOCKET_GAME_EVENTS.PLAYERS_IN_GAME, {
					players: gameRoom!.GetAllPlayersDTO(),
					thisPlayer: playerModel
				});
			}
			else{
				HandlerValidation.HandshakeHasGameIdAndMiddlewareHasJWT(socket);
				console.log(`Socket ${socket.id} connected`);
				const gameId: string = socket.handshake.query.gameId as string;
				const jwtPayload: JWTPayLoadInterface | JwtPayload | undefined = socket.middlewareData.jwt;
				HandlerValidation.HasJWT(jwtPayload)
				gameRoom = GamesStore.getInstance.GetGameById(gameId) as GameRoom;
				player = gameRoom.GetPlayerByUID(jwtPayload!.UID) as Player;
			}
			HandlerValidation.HasGameRoom(gameRoom);
			HandlerValidation.HasPlayerInGameRoom(player);
			socket.on(BUILD_IN_SOCKET_GAME_EVENTS.DISCONNECT, (disconnectReason: string) => {
				SocketHandler.DisconnectedPlayer(gameRoom!, player!, disconnectReason, socket)
			});
			socket.on(BUILD_IN_SOCKET_GAME_EVENTS.ERROR, (error: Error) => {
				console.log(`Socket Error - ${error.toString()}`);
				socket.disconnect();
			});
			if(gameRoom && player) return {gameRoom, player};
			else return undefined
		}
		catch (ex: any)
		{
			console.error("error: " + ex)
			if(ex instanceof SocketBadConnectionError) { socket.disconnect(); return undefined;} 
			if(ex instanceof SocketGameNotExistError) { return undefined; } 
			if(ex instanceof Error) { return undefined; } 
		}
	}

	public static DisconnectedPlayer( gameRoom: GameRoom, player: Player, disconnectReason: string, socket: Socket | undefined): void{
		if(gameRoom.HasPlayerByUID(player.UID)){
			SocketHandler.LeaveGameRoom(player.UID)
			gameRoom.DisconnectPlayer(player);
			let newHostRoomPlayer: Player | undefined
			if(player.isOwner){
				newHostRoomPlayer = gameRoom.SetNewHostOrOwnerRoom()
				player.isOwner = false
			}
			const response: PlayerDisconnectedResponse = new PlayerDisconnectedResponse(
				PlayerDTO.CreateFromPlayer(player),
				newHostRoomPlayer ? PlayerDTO.CreateFromPlayer(newHostRoomPlayer) : undefined,
			)
			if(socket === undefined){
				response.disconnectReason = DISCONNECT_REASON.DOUBLE_LOGIN
				this.EmitToSpecificRoom(SOCKET_GAME_EVENTS.PLAYER_DISCONNECTED, gameRoom.id, response)
				console.log(`UserId: ${player.UID} | Socket disconnected - ${disconnectReason}`);
			}else{
				this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.PLAYER_DISCONNECTED, gameRoom.id, response);
				console.log(`UserId: ${player.UID} | Socket ${socket.id} disconnected - ${disconnectReason}`);
			}
		}
	}
}