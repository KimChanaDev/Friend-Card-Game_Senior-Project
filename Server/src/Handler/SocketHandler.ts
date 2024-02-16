import { Namespace, Server, Socket} from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { GAME_TYPE } from '../Enum/GameType.js';
import { GameRoom } from '../GameFlow/Game/GameRoom.js';
import { Player } from '../GameFlow/Player/Player.js';
import { GamesStore } from '../GameFlow/Game/GameStore.js';
import { GAME_STATE } from '../Enum/GameState.js';
import { PlayerFactory } from '../GameFlow/Player/PlayerFactory.js';
import { PlayerDTO } from '../Model/DTO/PlayerDTO.js';
import { BUILD_IN_SOCKET_GAME_EVENTS, SOCKET_EVENT, SOCKET_GAME_EVENTS } from '../Enum/SocketEvents.js';
import { SocketBadConnectionError, SocketGameAlreadyStartedError, SocketGameNotExistError, SocketRoomFullError, SocketSessionExpiredError, SocketUnauthorizedError, SocketWrongRoomPasswordError } from '../Error/SocketErrorException.js';
import {IJwtValidation, JWTPayLoadInterface, ValidateJWT} from '../GameLogic/Utils/Authorization/JWT.js';
import { HandlerValidation } from './HandlerValidation.js';
import {PlayerDisconnectedResponse} from "../Model/DTO/Response/PlayerDisconnectedResponse.js";
import {JwtPayload} from "jsonwebtoken";
import {UserDataModel} from "../Model/Entity/UserData.js";
import {InternalError, InvalidCredentialsError} from "../Error/ErrorException.js";

export type SocketNextFunction = (err?: ExtendedError | undefined) => void;
export abstract class SocketHandler
{
    protected static connectedUsers: Set<string> = new Set<string>();
	protected static io: Server;
	private static isIoSet: boolean = false;
    protected namespace: Namespace;
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
	protected EmitToRoomAndSender(socket: Socket, event: SOCKET_EVENT, gameId: string, ...args: any[]): void
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
	private static VerifyJwt(socket: Socket, next: SocketNextFunction): void
	{
		try
		{
			HandlerValidation.HandshakeHasToken(socket);
			const validateResult: IJwtValidation = ValidateJWT(socket.handshake.query.token as string);
			HandlerValidation.ValidateJWTSuccess(validateResult);
			socket.middlewareData.jwt = validateResult.payload;
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
			console.log("Connecting to the room")
			HandlerValidation.HandshakeHasGameIdAndMiddlewareHasJWT(socket);
			const gameId = socket.handshake.query.gameId as string;
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

			SocketHandler.connectedUsers.add(user.UID);
			const newPlayer: Player = PlayerFactory.CreatePlayerObject(
				gameRoom!.gameType,
				user.UID,
				user.username,
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
			HandlerValidation.HandshakeHasGameIdAndMiddlewareHasJWT(socket);
			console.log(`Socket ${socket.id} connected`);
			const gameId: string = socket.handshake.query.gameId as string;
			const jwtPayload: JWTPayLoadInterface | JwtPayload | undefined = socket.middlewareData.jwt;
			HandlerValidation.HasJWT(jwtPayload)
			const gameRoom: GameRoom | undefined = GamesStore.getInstance.GetGameById(gameId) as GameRoom;
			HandlerValidation.HasGameRoom(gameRoom);
			const player: Player | undefined = gameRoom.GetPlayerByUID(jwtPayload!.UID) as Player;
			HandlerValidation.HasPlayerInGameRoom(player);
			socket.on(BUILD_IN_SOCKET_GAME_EVENTS.DISCONNECT, (disconnectReason: string) => {
				this.DisconnectedPlayer(gameRoom, player, disconnectReason, socket)
			});
			socket.on(BUILD_IN_SOCKET_GAME_EVENTS.ERROR, (error: Error) => {
				console.log(`Socket Error - ${error.toString()}`);
				socket.disconnect();
			});
			return {gameRoom, player};
		}
		catch (ex: any)
		{
			if(ex instanceof SocketBadConnectionError) { socket.disconnect(); return undefined;} 
			if(ex instanceof SocketGameNotExistError) { return undefined; } 
			if(ex instanceof Error) { return undefined; } 
		}
	}

	protected DisconnectedPlayer( gameRoom: GameRoom, player: Player, disconnectReason: string, socket: Socket): void{
		SocketHandler.connectedUsers.delete(player.UID);
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
		this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.PLAYER_DISCONNECTED, gameRoom.id, response);
		// if (gameRoom.GetGameRoomState() === GAME_STATE.FINISHED) {
		// 	// const gameFinishedDTO: GameFinishedDTO = { winnerUsername: (gameRoom.GetWinner() as Player).username };
		// 	// this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.GAME_FINISHED, gameId, gameFinishedDTO);
		// } else
		// 	this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.PLAYER_DISCONNECTED, gameId, PlayerDTO.CreateFromPlayer(player));
		console.log(`Socket ${socket.id} disconnected - ${disconnectReason}`);
	}
}