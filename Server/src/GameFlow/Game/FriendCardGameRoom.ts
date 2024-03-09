import {Socket} from "socket.io";
import {GameRoom} from "./GameRoom.js";
import {FriendCardPlayer} from "../Player/FriendCardPlayer.js";
import {FriendCardGameRound} from "./FriendCardGameRound.js";
import {GAME_STATE} from "../../Enum/GameState.js";
import {
    RoundResponseModel,
    PlayerPointModel,
    PlayersRoundPointModel,
    RoundModel,
    RoundResponse,
    SummaryRoundModel, TotalGamePointModel
} from "../../Model/DTO/Response/RoundResponse.js";
import {CARD_AI_FORMAT, CardId, ColorType, TRUMP_SUIT_AI_FORMAT} from "../../Enum/CardConstant.js";
import {GameFinishedDTO} from "../../Model/DTO/GameFinishedDTO.js";
import {SOCKET_EVENT, SOCKET_GAME_EVENTS} from "../../Enum/SocketEvents.js";
import {WinnerTrickResponse} from "../../Model/DTO/Response/WinnerTrickResponse.js";
import {CardPlayedDTO} from "../../Model/DTO/CardPlayedDTO.js";
import {TrumpAndFriendDTO} from "../../Model/DTO/TrumpAndFriendDTO.js";
import {AuctionPointDTO} from "../../Model/DTO/AuctionPointDTO.js";
import {RandomArrayElement} from "../../GameLogic/Utils/Tools.js";
import {matchObject} from "../../Model/Entity/MatchData.js";
import {BOT_CONFIG} from "../../Enum/BotConfig.js";
import {BotAuction, BotPlayCard, BotSelectFriendCard, BotSelectTrumpSuit} from "../../Service/Bot/BotService.js";
import {FriendCardGameRoundLogic} from "../../GameLogic/Game/FriendCardGameRoundLogic.js";
import {CardLogic} from "../../GameLogic/Card/CardLogic.js";
import {HandlerValidation} from "../../Handler/HandlerValidation.js";
import {FriendCardGameRepository} from "../../Repository/FriendCardGameRepository.js";
import {GamesStore} from "./GameStore.js";
import {GUEST_CONFIG} from "../../Enum/GuestConfig.js";

export class FriendCardGameRoom extends GameRoom
{
    protected winner?: FriendCardPlayer | undefined;
    protected playersInGame: Map<string, FriendCardPlayer> = new Map<string, FriendCardPlayer>();
    private winnerPoint: number = 0;
    private roundsInGame: FriendCardGameRound[] = [];
    private currentRoundNumber: number = 0;
    private isNoPlayerInRoom: boolean = false
    private readonly totalNumberRound: number = 4;

    public StartGameProcess(socket: Socket): void
    {
        this.InitRoundInGame();
        super.SetStartState();
        this.GetCurrentRoundGame().StartRoundProcess(false
            , this.GetAllPlayerAsArray()
            , socket
            ,() => this.AuctionTimeOutCallback(socket)
            ,() => this.BotAuctionCallback(socket)
        );
    }
    private InitRoundInGame(): void
    {
        for (let i = 0; i < this.totalNumberRound; i++) {
            this.roundsInGame.push(new FriendCardGameRound(i, super.id));
        }
        this.currentRoundNumber = 0;
    }
    public RestartFriendCardGameRoom(): void {
        super.RestartGameRoom()
        this.winnerPoint = 0;
        this.roundsInGame = [];
        this.currentRoundNumber = 0;
    }
    public GetWinner(): FriendCardPlayer | undefined { return this.winner }
    public GetWinnerPoint(): number { return this.winnerPoint }
    public GetCurrentRoundGame(): FriendCardGameRound { return this.roundsInGame[this.currentRoundNumber]; }
    public GetCurrentRoundNumber(): number { return this.currentRoundNumber; }
    public IsCurrentRoundGameFinished(): boolean {
        return this.GetCurrentRoundGame().GetRoundState() === GAME_STATE.FINISHED
            && this.GetCurrentRoundGame().GetGameplayState() === GAME_STATE.FINISHED;
    }
    public GetAllPlayerAsArray(): FriendCardPlayer[] { return Array.from(this.playersInGame.values()); }
    public GetAllPlayerIdAsArray(): string[]
    {
        const playerIds: string[] = [];
        this.GetAllPlayerAsArray().forEach(a => playerIds.push(a.UID));
        return playerIds;
    }
    public NextRoundProcess(socket: Socket): void
    {
        this.currentRoundNumber++;
        this.GetCurrentRoundGame().StartRoundProcess(true
            , this.GetAllPlayerAsArray()
            , socket
            ,() => this.AuctionTimeOutCallback(socket)
            , () => this.BotAuctionCallback(socket)
        );
    }
    public CheckGameFinished(): boolean{
        const nextRoundNumberTemp = this.currentRoundNumber + 1
        return nextRoundNumberTemp >= this.totalNumberRound;
    }
    public GenerateRoundResponse(): RoundResponseModel {
        const currentRoundModel: RoundModel = this.CreateCurrentRoundModel()
        const summaryRoundModel: SummaryRoundModel[] = this.CreateSummaryRoundModel()
        const totalGamePointModel: TotalGamePointModel[] = this.CreateTotalGamePoint()
        return new RoundResponseModel(currentRoundModel, summaryRoundModel, totalGamePointModel)
    }
    public CreateTotalGamePoint(): TotalGamePointModel[]{
        const result: TotalGamePointModel[] = []
        let first: boolean = true;
        let highestPoint: number = 0
        this.playersInGame.forEach(player => {
            if(first) {
                first = false;
                highestPoint = player.GetTotalGamePoint()
            }else{
                if (highestPoint < player.GetTotalGamePoint()) highestPoint = player.GetTotalGamePoint()
            }
            result.push(new TotalGamePointModel(player.UID, player.username, player.GetTotalGamePoint(), false))
        })
        result.forEach(e => {
            if(e.totalPoint === highestPoint) e.isHighestPoint = true
        })
        return result
    }
    public CreateCurrentRoundModel(): RoundModel {
        const playerPointModels: PlayerPointModel[] = []
        const currentGameRound: FriendCardGameRound = this.GetCurrentRoundGame()
        this.playersInGame.forEach(player =>{
            const playerId: string = player.UID;
            const isRoundWinner: boolean = currentGameRound.GetRoundWinnerIds().some(id => id === player.UID)
            const cardsPointReceive: number = player.GetRoundPoint(currentGameRound.GetRoundNumber());
            const gamePointReceive: number = player.GetGamePoint(currentGameRound.GetRoundNumber());
            playerPointModels.push(new PlayerPointModel(playerId, isRoundWinner, cardsPointReceive, gamePointReceive))
        })
        return new RoundModel(currentGameRound.GetRoundNumber() + 1, playerPointModels)
    }
    public CreateSummaryRoundModel(): SummaryRoundModel[]{
        const summaryRoundModel: SummaryRoundModel[] = []
        this.roundsInGame.forEach(round => {
            if(round.GetRoundState() !== GAME_STATE.NOT_STARTED){
                const playersRoundPointModel: PlayersRoundPointModel[] = []
                this.playersInGame.forEach(player =>{
                    const playerId: string = player.UID;
                    const isRoundWinner: boolean = round.GetRoundWinnerIds().some(id => id === player.UID)
                    const roundGamePoint: number = player.GetGamePoint(round.GetRoundNumber());
                    playersRoundPointModel.push(new PlayersRoundPointModel(playerId, isRoundWinner, roundGamePoint))
                })
                summaryRoundModel.push(new SummaryRoundModel(round.GetRoundNumber() + 1, playersRoundPointModel))
            }
        })
        return summaryRoundModel
    }
    public DisconnectPlayer(player: FriendCardPlayer): void
    {
        super.DisconnectPlayer(player);
        if (this.AreAllPlayersIsDisconnected()){
            this.isNoPlayerInRoom = true
            GamesStore.getInstance.DeleteGameById(this.id);
        }
        const isNotGuestRoom: boolean = this.owner.UID !== GUEST_CONFIG.UID
        if (isNotGuestRoom){
            const matchModel: matchObject = {
                id: this.id,
                score: player.GetTotalGamePoint(),
                place: 4,
                win: false,
                createdAt: new Date(Date.now()),
            };
            FriendCardGameRepository.SaveMatchHistory(matchModel, false, player)
        }
    }
    public FinishGameProcess(): void
    {
        let winnerPoint: number = -500;
        let winnerPlayer: FriendCardPlayer | undefined;
        this.playersInGame.forEach(player => {
            const totalGamePointByPlayer: number = player.GetTotalGamePoint()
            if(totalGamePointByPlayer > winnerPoint)
            {
                winnerPoint = totalGamePointByPlayer;
                winnerPlayer = player;
            }
        })
        this.winner = winnerPlayer;
        this.winnerPoint = winnerPoint;
        super.SetFinishState();
        const isNotGuestRoom: boolean = this.owner.UID !== GUEST_CONFIG.UID
        if (isNotGuestRoom){
            this.SaveMatchHistory(winnerPlayer?.UID);
        }
    }
    public SaveMatchHistory(winnerPlayerUID: string | undefined): void{
        const userPlaces: FriendCardPlayer[] = Array.from(this.playersInGame.values());
        userPlaces.sort((playerA, playerB) => playerB.GetTotalGamePoint() - playerA.GetTotalGamePoint())
        let placeNumber: number = 1;
        let previousPoint: number | undefined = undefined;
        userPlaces.forEach((player, index) => {
            const isWinner: boolean = winnerPlayerUID === player.UID
            const matchModel: matchObject = {
                id: this.id,
                score: player.GetTotalGamePoint(),
                place: !previousPoint || previousPoint === player.GetTotalGamePoint() ? placeNumber : ++placeNumber,
                win: isWinner,
                createdAt: new Date(Date.now()),
            };
            previousPoint = player.GetTotalGamePoint()
            if(!player.GetIsDisconnected()){
                FriendCardGameRepository.SaveMatchHistory(matchModel, isWinner, player)
            }
        })
    }
    public BotAuctionCallback(socket: Socket): void{
        if(!this.isNoPlayerInRoom){
            const cardInHand: CardId[] = this.GetCurrentRoundGame().GetCurrentPlayer().GetHandCard().GetInDeck()
            const cardsInHandAIFormat: number[] = FriendCardGameRoundLogic.GenerateCardIdsInHandAIFormat(cardInHand)
            const currentBid: number = this.GetCurrentRoundGame().GetAuctionPoint()
            const botLevel: number = this.GetCurrentRoundGame().GetCurrentPlayer().GetBotLevel() ?? BOT_CONFIG.EASY_BOT
            BotAuction(cardsInHandAIFormat, currentBid, botLevel)
                .then((biddingScore: string) => {
                    const botAuctionScore: number = parseInt(biddingScore, 10)
                    const botAuctionPass: boolean = botAuctionScore === 0
                    // console.log("botAuctionScore: " + botAuctionScore)
                    // console.log("botAuctionPass: " + botAuctionPass)
                    const player: FriendCardPlayer = this.GetCurrentRoundGame().GetCurrentPlayer()
                    this.AuctionProcessThenEmitEvent(botAuctionPass, botAuctionScore, player, socket)
                })
                .catch(error => {
                    console.error(`Bot auction python generate error: ${error.toString()}`)
                })
        }
    }
    public BotSelectMainCardCallback(socket: Socket): void{
        if(!this.isNoPlayerInRoom) {
            const cardInHand: CardId[] = this.GetCurrentRoundGame().GetCurrentPlayer().GetHandCard().GetInDeck()
            // console.log("cardInHand: " + cardInHand.toString())
            const cardsInHandAIFormat: number[] = FriendCardGameRoundLogic.GenerateCardIdsInHandAIFormat(cardInHand)
            // console.log("cardsInHandAIFormat: " + cardsInHandAIFormat.toString())
            const botLevel: number = this.GetCurrentRoundGame().GetCurrentPlayer().GetBotLevel() ?? BOT_CONFIG.EASY_BOT
            BotSelectTrumpSuit(cardsInHandAIFormat, botLevel)
                .then((trumpFromAI: string) => {
                    BotSelectFriendCard(cardsInHandAIFormat)
                        .then((friendCardFromAI: string) => {
                            const trumpServerFormat: ColorType | undefined = TRUMP_SUIT_AI_FORMAT.hasOwnProperty(trumpFromAI)
                                ? TRUMP_SUIT_AI_FORMAT[trumpFromAI] as ColorType
                                : undefined
                            const friendCardServerFormat: CardId | undefined = CARD_AI_FORMAT.hasOwnProperty(friendCardFromAI)
                                ? CARD_AI_FORMAT[friendCardFromAI] as CardId
                                : undefined
                            // console.log("bot trumpFromAI: " + trumpFromAI)
                            // console.log("bot friendCardFromAI: " + friendCardFromAI)
                            // console.log("bot trumpServerFormat: " + trumpServerFormat)
                            // console.log("bot friendCardServerFormat: " + friendCardServerFormat)
                            if(trumpServerFormat && friendCardServerFormat) {
                                const player: FriendCardPlayer = this.GetCurrentRoundGame().GetCurrentPlayer()
                                this.SelectMainCardThenEmitEvent(trumpServerFormat, friendCardServerFormat, player, socket)
                            }
                            else{
                                console.error(`trumpFromAI: ${trumpFromAI} or friendCardFromAI: ${friendCardFromAI} are undefined while convert to server format => trumpServerFormat: ${trumpServerFormat}, friendCardServerFormat: ${friendCardServerFormat}`)
                            }
                        })
                        .catch(error => {
                            console.error(`BotSelectFriendCard python generate error: ${error.toString()}`)
                        })
                })
                .catch(error => {
                    console.error(`BotSelectTrumpSuit python generate error: ${error.toString()}`)
                })
        }
    }
    public BotPlayCardCallback(socket: Socket): void{
        if(!this.isNoPlayerInRoom) {
            const cardInHand: CardId[] = this.GetCurrentRoundGame().GetCurrentPlayer().GetHandCard().GetInDeck()
            const cardsInHandAIFormat: number[] = FriendCardGameRoundLogic.GenerateCardIdsInHandAIFormat(cardInHand)
            const gameStateAIFormat: number[] = this.GenerateGameStateAIFormat(cardInHand)
            const botLevel: number = this.GetCurrentRoundGame().GetCurrentPlayer().GetBotLevel() ?? BOT_CONFIG.EASY_BOT

            // console.log("cardInHand: " + cardInHand.toString())
            // console.log("cardsInHandAIFormat: " + cardsInHandAIFormat.toString())
            // console.log("gameStateAIFormat: " + gameStateAIFormat.toString())

            BotPlayCard(cardsInHandAIFormat, gameStateAIFormat, botLevel)
                .then((cardAIFormat: string) => {
                    // console.log("cardAIFormat: " + cardAIFormat)
                    const botCard: CardId | undefined = CARD_AI_FORMAT.hasOwnProperty(cardAIFormat)
                        ? CARD_AI_FORMAT[cardAIFormat] as CardId
                        : undefined
                    if(botCard){
                        // console.log("botCardID server: " + botCard)
                        const player: FriendCardPlayer = this.GetCurrentRoundGame().GetCurrentPlayer()
                        this.PlayCardProcessThenEmitEvent(botCard, player, socket)
                    }else{
                        console.error("botCard server null : " + botCard)
                    }

                })
                .catch(error => {
                    console.error(`Bot play card python generate error: ${error.toString()}`)
                })
        }
    }
    private GenerateGameStateAIFormat(cardInHand: CardId[]): number[] {
        const cardsInHandAIFormatBit: number[] = FriendCardGameRoundLogic.GenerateCardsInHandOrFieldAIFormatBit(cardInHand)
        const firstSuitInFieldAIFormatBit: number[] = FriendCardGameRoundLogic.GenerateFirstSuitInFieldAIFormatBit(this.GetCurrentRoundGame().GetCardsInField())
        const trumpAIFormatBit: number[] = FriendCardGameRoundLogic.GenerateTrumpCardAIFormatBit(this.GetCurrentRoundGame().GetTrumpColor())
        const cardsInFieldAIFormatBit: number[] = FriendCardGameRoundLogic.GenerateCardsInHandOrFieldAIFormatBit(this.GetCurrentRoundGame().GetCardsInField())
        const allCardPlayedAsTrumpAIFormatBit: number[] = this.GenerateAllCardPlayedAsTrumpAIFormatBit()
        const allPointCardPlayedAIFormatBit: number[] = this.GenerateAllPointCardPlayedAIFormatBit()
        const orderBotPlayerAIFormatBit: number[] = this.GenerateOrderBotPlayerAIFormatBit()
        const friendCardInTrickAIFormatBit: number[] = this.GenerateFriendCardInTrickAIFormatBit()
        const orderFriendPlayerAIFormatBit: number[] = [0,0,0,0] // Fix value by AI Requirement
        return cardsInHandAIFormatBit
            .concat(firstSuitInFieldAIFormatBit)
            .concat(trumpAIFormatBit)
            .concat(cardsInFieldAIFormatBit)
            .concat(allCardPlayedAsTrumpAIFormatBit)
            .concat(allPointCardPlayedAIFormatBit)
            .concat(orderBotPlayerAIFormatBit)
            .concat(friendCardInTrickAIFormatBit)
            .concat(orderFriendPlayerAIFormatBit)
    }
    private GenerateOrderBotPlayerAIFormatBit(): number[] {
        let orderBotPlayerAIFormatBit: number[] = [0, 0, 0, 0]
        const botOrderTurn: number = this.GetCurrentRoundGame().GetCurrentPlayerOrderTurn()
        orderBotPlayerAIFormatBit[botOrderTurn] = 1
        return orderBotPlayerAIFormatBit
    }
    private GenerateFriendCardInTrickAIFormatBit(): number[] {
        const friendCardInTrick: CardId | undefined = this.GetCurrentRoundGame().GetFriendCardInTrick()
        return FriendCardGameRoundLogic.GenerateCardsInHandOrFieldAIFormatBit(friendCardInTrick ? [friendCardInTrick] : []) // Can use this method for gen 28 bit also
    }
    private GenerateAllPointCardPlayedAIFormatBit(): number[]{
        const cardsPlayedShape5: CardId[] = this.GetCurrentRoundGame().GetCardsByShapeArePlayed("5")
        const cardsPlayedShapeT: CardId[] = this.GetCurrentRoundGame().GetCardsByShapeArePlayed("T")
        const cardsPlayedShapeK: CardId[] = this.GetCurrentRoundGame().GetCardsByShapeArePlayed("K")
        return [
            CardLogic.IsCardsHasColor(cardsPlayedShape5, "H") ? 1 : 0,
            CardLogic.IsCardsHasColor(cardsPlayedShapeT, "H") ? 1 : 0,
            CardLogic.IsCardsHasColor(cardsPlayedShapeK, "H") ? 1 : 0,

            CardLogic.IsCardsHasColor(cardsPlayedShape5, "D") ? 1 : 0,
            CardLogic.IsCardsHasColor(cardsPlayedShapeT, "D") ? 1 : 0,
            CardLogic.IsCardsHasColor(cardsPlayedShapeK, "D") ? 1 : 0,

            CardLogic.IsCardsHasColor(cardsPlayedShape5, "C") ? 1 : 0,
            CardLogic.IsCardsHasColor(cardsPlayedShapeT, "C") ? 1 : 0,
            CardLogic.IsCardsHasColor(cardsPlayedShapeK, "C") ? 1 : 0,

            CardLogic.IsCardsHasColor(cardsPlayedShape5, "S") ? 1 : 0,
            CardLogic.IsCardsHasColor(cardsPlayedShapeT, "S") ? 1 : 0,
            CardLogic.IsCardsHasColor(cardsPlayedShapeK, "S") ? 1 : 0,
        ]
    }
    private GenerateAllCardPlayedAsTrumpAIFormatBit(): number[]{
        let allCardPlayedAsTrump: CardId[] = []
        if(this.GetCurrentRoundGame().GetTrumpColor()){
            allCardPlayedAsTrump = this.GetCurrentRoundGame().GetCardsByColorArePlayed(this.GetCurrentRoundGame().GetTrumpColor()!)
        }
        return FriendCardGameRoundLogic.GenerateAllCardPlayedAsTrumpAIFormatBit(allCardPlayedAsTrump)
    }
    public AuctionTimeOutCallback(socket: Socket): void{
        if(!this.isNoPlayerInRoom){
            console.log("Auto auction")
            let auctionPass: boolean
            let auctionPoint: number | undefined
            if(this.GetCurrentRoundGame().IsFirstAuction()){
                auctionPass = false
                auctionPoint = 55
            }else{
                auctionPass = true
                auctionPoint = 100 // Not important
            }
            const player: FriendCardPlayer = this.GetCurrentRoundGame().GetCurrentPlayer()
            this.AuctionProcessThenEmitEvent(auctionPass, auctionPoint, player, socket)
        }
    }
    public SelectMainCardTimeOutCallback(socket: Socket): void{
        if(!this.isNoPlayerInRoom){
            console.log("Auto Select Main Card")
            const player: FriendCardPlayer = this.GetCurrentRoundGame().GetCurrentPlayer()
            const card: CardId = player.GetHandCard().RandomCardNotValidInHand()
            const color: ColorType = player.GetHandCard().RandomColor()
            this.SelectMainCardThenEmitEvent(color, card, player, socket)
        }
    }
    public PlayCardTimeOutCallback(socket: Socket): void{
        if(!this.isNoPlayerInRoom){
            console.log("Auto Play Card")
            const player: FriendCardPlayer = this.GetCurrentRoundGame().GetCurrentPlayer()
            const cardsCanPlay: CardId[] = this.GetCurrentRoundGame().CardsCanPlay(player)
            const randomCard: CardId = RandomArrayElement(cardsCanPlay)
            this.PlayCardProcessThenEmitEvent(randomCard, player, socket)
        }
    }
    private SelectMainCardThenEmitEvent(trumpColor: ColorType, friendCard: CardId, player: FriendCardPlayer, socket: Socket): void {
        try {
            HandlerValidation.GameAndRoundAndGameplayStarted(this);
            HandlerValidation.IsWinnerAuction(this, player);
            HandlerValidation.IsFriendCardAndTrumpCardValid(this, friendCard, trumpColor);
            HandlerValidation.NotHasCardInHand(player, friendCard);
            HandlerValidation.NotAlreadySetTrumpAndFriend(this);
            this.GetCurrentRoundGame().SetTrumpAndFriendProcess(trumpColor
                , friendCard
                , player
                , socket
                , () => this.PlayCardTimeOutCallback(socket)
                , () => this.BotPlayCardCallback(socket)
            )
            const trumpAndFriendDTO :TrumpAndFriendDTO = {
                playerId: player.UID,
                trumpColor: trumpColor,
                friendCard: friendCard,
                winnerAuctionPoint: this.GetCurrentRoundGame().GetAuctionPoint()
            };
            this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.SELECT_MAIN_CARD, this.id, trumpAndFriendDTO);
        }
        catch (error: any) {
            console.error("Error SelectMainCardThenEmitEvent method: " + error.toString())
        }
    }
    private AuctionProcessThenEmitEvent(auctionPass: boolean, auctionPoint: number, player: FriendCardPlayer, socket: Socket): void {
        try {
            HandlerValidation.GameAndRoundStarted(this);
            HandlerValidation.IsGamePlayNotStarted(this);
            HandlerValidation.IsPlayerTurn(this, player);
            HandlerValidation.AcceptableAuctionPoint(auctionPass, auctionPoint);
            HandlerValidation.FirstPlayerCannotNotPass(this, auctionPass);
            HandlerValidation.AuctionPointGreaterThan(auctionPass, auctionPoint, this.GetCurrentRoundGame().GetAuctionPoint());
            this.GetCurrentRoundGame().AuctionProcess(
                auctionPass
                , auctionPoint
                , socket
                , () => this.AuctionTimeOutCallback(socket)
                , () => this.SelectMainCardTimeOutCallback(socket)
                , () => this.BotAuctionCallback(socket)
                ,() => this.BotSelectMainCardCallback(socket)
            )
            const [nextPlayerId, highestAuctionPlayerId, currentAuctionPoint, gameplayState] = this.GetCurrentRoundGame().GetInfoForAuctionPointResponse();
            const auctionPointDTO: AuctionPointDTO = {
                playerId: player.UID,
                isPass: auctionPass,
                auctionPoint: !auctionPass ? auctionPoint : undefined,
                nextPlayerId: nextPlayerId,
                highestAuctionPlayerId: highestAuctionPlayerId ?? "",
                highestAuctionPoint: currentAuctionPoint,
            };
            this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.AUCTION, this.id, auctionPointDTO);
        }
        catch (error: any){
            console.error("Error AuctionProcessThenEmitEvent method: " + error.toString())
        }
    }
    private PlayCardProcessThenEmitEvent(cardToPlay: CardId, player: FriendCardPlayer, socket: Socket): void {
        try
        {
            HandlerValidation.AlreadySetTrumpAndFriend(this);
            HandlerValidation.IsGameRoomStartedState(this);
            HandlerValidation.IsPlayerTurn(this, player);
            HandlerValidation.HasCardOnHand(this, player, cardToPlay);
            const playedCard: CardId = this.GetCurrentRoundGame().PlayCardProcess(cardToPlay
                , player.UID
                , socket
                , () => this.PlayCardTimeOutCallback(socket)
                , () => this.BotPlayCardCallback(socket)
            )
            if(this.IsCurrentRoundGameFinished() && this.CheckGameFinished()){
                this.FinishGameProcess()
                const winner: FriendCardPlayer | undefined = this.GetWinner()
                if(winner){
                    const winnerResponse: GameFinishedDTO = {
                        winnerId: winner.UID,
                        winnerName: winner.username,
                        winnerPoint: this.GetWinnerPoint(),
                        roundsFinishedDetail: this.GenerateRoundResponse()
                    }
                    this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.GAME_FINISHED, this.id, winnerResponse);
                }
                else{
                }
            }
            else if (this.IsCurrentRoundGameFinished())
            {
                const roundFinishedResponse: RoundResponseModel = this.GenerateRoundResponse()
                this.NextRoundProcess(socket);
                this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.ROUND_FINISHED, this.id, roundFinishedResponse);
            }
            else if (this.GetCurrentRoundGame().IsEndOfTrick())
            {
                const winnerTrickModel: WinnerTrickResponse | undefined = this.GetCurrentRoundGame().GetLatestWinnerTrickResponse();
                this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.TRICK_FINISHED, this.id, winnerTrickModel);
            }
            const cardPlayedDTO: CardPlayedDTO = {
                playerId: player.UID,
                cardId: playedCard
            };
            this.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.CARD_PLAYED, this.id, cardPlayedDTO);
        }
        catch (error: any) {
            console.error("Error PlayCardProcessThenEmitEvent method: " + error.toString())
        }
    }
    private EmitToRoomAndSender(socket: Socket, event: SOCKET_EVENT, gameId: string, ...args: any[]): void
    {
        socket.to(gameId).emit(event, ...args);
        socket.emit(event, ...args);
    }
}