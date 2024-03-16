import {Socket} from "socket.io";
import {CardId, ColorType, ShapeType} from "../../Enum/CardConstant.js";
import {GAME_STATE} from "../../Enum/GameState.js";
import {ActionsDTO} from "../../Model/DTO/ActionsDTO.js";
import {TrickCardDetailModel, TrickCardModel} from "../../Model/DTO/TrickCardModel.js";
import {CardLogic} from "../../GameLogic/Card/CardLogic.js";
import {DeckLogic} from "../../GameLogic/Card/DeckLogic.js";
import {FriendCardPlayer} from "../Player/FriendCardPlayer.js";
import {ShuffleArray} from "../../GameLogic/Utils/Tools.js";
import {FriendCardGameRoundLogic} from "../../GameLogic/Game/FriendCardGameRoundLogic.js";
import {WinnerTrickResponse} from "../../Model/DTO/Response/WinnerTrickResponse.js";
import {PlayerPointInfo} from "../../Model/DTO/Response/PlayerPointInfo.js";
import {
    RoundResponseModel,
    PlayerPointModel, PlayersRoundPointModel,
    RoundModel,
    RoundResponse, SummaryRoundModel
} from "../../Model/DTO/Response/RoundResponse.js";
import {FRIEND_TIMEOUT_CONFIG} from "../../Enum/TimeoutConfig.js";

export class FriendCardGameRound
{
    public readonly deck = new DeckLogic();
    private readonly totalTrickNumber: number = 13;
    private roundState: GAME_STATE = GAME_STATE.NOT_STARTED;
    private gameplayState: GAME_STATE = GAME_STATE.NOT_STARTED;
    private trumpColor: ColorType | undefined = undefined;
    private friendCard: CardId | undefined= undefined;
    private auctionPoint: number = 50;
    private playersInOrder: FriendCardPlayer[] = [];
    private highestAuctionId: string = '';
    private auctionWinnerTeamIds: string[] = [];
    private anotherTeamIds: string[] = [];
    private roundWinnerIds: string[] = [];
    private roundWinnerPoint: number = 0;
    private trickCardMap: Map<number, TrickCardModel>  = new Map<number, TrickCardModel>();
    private winnerAuctionTeamTotalPoint: number = 0;
    private anotherTeamTotalPoint: number = 0;
    private currentPlayerNumber: number = 0;
    private currentTrickNumber: number = 0;
    private stackPass: number = 0;
    private isFriendAppeared: boolean = false;
    private endTrickFlag: boolean = false;
    private readonly roundNumber: number;
    private readonly gameId: string;
    private playerAuctionPass: string[] = [];

    constructor(roundNumber: number, gameId: string) {
        this.roundNumber = roundNumber;
        this.gameId = gameId;
    };
    public GetPlayersInOrderIndex(UID: string): number{
        return this.playersInOrder.findIndex(a => a.UID === UID)
    }
    public StartRoundProcess(isFromNextRoundProcess: boolean
                             , initialPlayers : FriendCardPlayer[]
                             , socket: Socket
                             , AuctionTimeOutCallback: (socket: Socket) => void
                             , BotAuctionCallback: (socket: Socket) => void
    ): void {
        if (initialPlayers.length !== 4) throw new Error("Players are not equal to 4");
        this.playersInOrder = initialPlayers;
        this.currentPlayerNumber = Math.floor(Math.random() * 4);
        FriendCardGameRoundLogic.PrepareCard(this.deck, this.playersInOrder);
        this.roundState = GAME_STATE.STARTED

        const timeout: number = isFromNextRoundProcess ? FRIEND_TIMEOUT_CONFIG.AUCTION_WITH_ROUND_FINISH_IN_SEC : FRIEND_TIMEOUT_CONFIG.AUCTION_IN_SEC
        if(this.GetCurrentPlayer().GetIsDisconnected()){
            const actionBotDelay: number = isFromNextRoundProcess ? FRIEND_TIMEOUT_CONFIG.ROUND_FINISHED_POPUP_IN_SEC : 0
            this.GetCurrentPlayer().BotPlay(timeout, actionBotDelay, () => BotAuctionCallback(socket))
        }
        else{
            this.GetCurrentPlayer().StartTimer(timeout, () => AuctionTimeOutCallback(socket))
        }
    }
    public AuctionProcess(auctionPass: boolean
                          , newAuctionPoint: number
                          , socket: Socket
                          , AuctionTimeOutCallback: (socket: Socket) => void
                          , SelectMainCardTimeOutCallback: (socket: Socket) => void
                          , BotAuctionCallback: (socket: Socket) => void
                          , BotSelectMainCardCallback: (socket: Socket) => void
    ): void
    {
        this.GetCurrentPlayer().ClearTimer()
        if (auctionPass)
        {
            this.playerAuctionPass.push(this.GetCurrentPlayer().UID)
            this.stackPass++;
        }
        else
        {
            this.auctionPoint = newAuctionPoint;
            this.highestAuctionId = this.GetCurrentPlayer().UID;
        }
        if(this.stackPass === 3 || this.auctionPoint === 100)
        {
            this.gameplayState = GAME_STATE.STARTED;
            this.currentPlayerNumber = this.GetHighestAuctionPlayerIndex()
            if(this.GetCurrentPlayer().GetIsDisconnected()){
                const actionBotDelay: number = 0
                this.GetCurrentPlayer().BotPlay(FRIEND_TIMEOUT_CONFIG.SELECT_MAIN_CARD_IN_SEC, actionBotDelay, () => BotSelectMainCardCallback(socket))
            }
            else{
                this.GetCurrentPlayer().StartTimer(FRIEND_TIMEOUT_CONFIG.SELECT_MAIN_CARD_IN_SEC, () => SelectMainCardTimeOutCallback(socket))
            }
        }else{
            do{
                this.currentPlayerNumber = FriendCardGameRoundLogic.NextPlayer(this.currentPlayerNumber, this.playersInOrder.length);
            }while(this.playerAuctionPass.some(uid => uid === this.GetCurrentPlayer().UID));
            if(this.GetCurrentPlayer().GetIsDisconnected()){
                const actionBotDelay: number = 0
                this.GetCurrentPlayer().BotPlay(FRIEND_TIMEOUT_CONFIG.AUCTION_IN_SEC, actionBotDelay, () => BotAuctionCallback(socket))
            }
            else{
                this.GetCurrentPlayer().StartTimer(FRIEND_TIMEOUT_CONFIG.AUCTION_IN_SEC, () => AuctionTimeOutCallback(socket))
            }
        }
    }
    public GetScoreCard(playerId: string): CardId[]{
        const result: CardId[] = []
        const TrickNumberArrayFromBeginning: number[] = Array.from({length: this.totalTrickNumber}, (_, index) => index);
        TrickNumberArrayFromBeginning.forEach(trickNumber => {
            const trickCard = this.trickCardMap.get(trickNumber);
            if(trickCard && trickCard.winnerId === playerId){
                trickCard.detail.forEach(trickCardDetailModel => {
                    if (trickCardDetailModel.cardId.charAt(0) === "5" || trickCardDetailModel.cardId.charAt(0) === "T" || trickCardDetailModel.cardId.charAt(0) === "K"){
                        result.push(trickCardDetailModel.cardId)
                    }
                })
            }
        })
        return result
    }
    public IsFirstAuction(): boolean { return this.auctionPoint === 50; }
    public SetTrumpAndFriendProcess(trumpColor: ColorType
                                    , friendCard: CardId
                                    , player: FriendCardPlayer
                                    , socket:Socket
                                    , PlayCardTimeOutCallback: (socket: Socket) => void
                                    , BotPlayCardCallback: (socket: Socket) => void
    ): void {
        this.trumpColor = trumpColor;
        this.friendCard = friendCard;
        const highestAuctionPlayer : FriendCardPlayer | undefined= this.GetHighestAuctionPlayer();
        const friendPlayer: FriendCardPlayer | undefined  = this.GetFriendPlayer();
        FriendCardGameRoundLogic.InitializeTeam(highestAuctionPlayer, friendPlayer, this.playersInOrder, this.auctionWinnerTeamIds, this.anotherTeamIds);
        FriendCardGameRoundLogic.InitializeTrick(this.totalTrickNumber, this.trickCardMap);
        this.GetCurrentPlayer().ClearTimer()
        this.currentPlayerNumber = this.playersInOrder.findIndex(p => p.UID === player.UID);
        if(this.GetCurrentPlayer().GetIsDisconnected()){
            const actionBotDelay: number = 0
            this.GetCurrentPlayer().BotPlay(FRIEND_TIMEOUT_CONFIG.PLAY_CARD_IN_SEC, actionBotDelay, () => BotPlayCardCallback(socket))
        }
        else {
            this.GetCurrentPlayer().StartTimer(FRIEND_TIMEOUT_CONFIG.PLAY_CARD_IN_SEC, () => PlayCardTimeOutCallback(socket))
        }
        this.currentTrickNumber = 0;
    }
    
    public PlayCardProcess(cardId: CardId
                           , playerId: string
                           , socket: Socket
                           , PlayCardTimeOutCallback: (socket: Socket) => void
                           , BotPlayCardCallback: (socket: Socket) => void
    ): CardId {
        let removeCard: CardId;
        const leaderCardId: CardId | undefined  = this.trickCardMap.get(this.currentTrickNumber)?.detail.at(0)?.cardId;
        const leaderColor: ColorType | undefined = leaderCardId ? CardLogic.GetColor(leaderCardId) : undefined;
        if(leaderColor && this.GetCurrentPlayer().GetHandCard().HasColor(leaderColor))
        {
            if(leaderCardId && (CardLogic.IsColorSameAs(cardId, leaderCardId)))
            {
                removeCard = cardId;
            }
            else
            {
                throw new Error("Your card are not follow leader");
            }
        }
        else
        {
            removeCard = cardId;
        }
        this.GetCurrentPlayer().GetHandCard().Remove(removeCard);
        const currentTrickCardModel: TrickCardModel | undefined = this.trickCardMap.get(this.currentTrickNumber);
        currentTrickCardModel?.AddCardDetail(playerId, removeCard);
        let firstTimeFriendAppear: boolean = false
        if (this.friendCard === removeCard) {
            firstTimeFriendAppear = true;
            this.isFriendAppeared = true;
        }
        if(this.IsFinishedTrick(leaderColor, currentTrickCardModel)){
            this.TrickFinishedProcess(leaderColor!
                , currentTrickCardModel!
                , () => PlayCardTimeOutCallback(socket)
                , socket
                ,() => BotPlayCardCallback(socket)
            )
        }
        else{
            this.GetCurrentPlayer().ClearTimer()
            this.currentPlayerNumber = FriendCardGameRoundLogic.NextPlayer(this.currentPlayerNumber, this.playersInOrder.length);
            const timeout: number = firstTimeFriendAppear ? FRIEND_TIMEOUT_CONFIG.PLAY_CARD_WITH_ONLY_FRIEND_APPEAR_POPUP_IN_SEC : FRIEND_TIMEOUT_CONFIG.PLAY_CARD_IN_SEC
            if(this.GetCurrentPlayer().GetIsDisconnected()){
                const actionBotDelay: number = firstTimeFriendAppear ? FRIEND_TIMEOUT_CONFIG.FRIEND_APPEAR_POPUP_IN_SEC : 0
                this.GetCurrentPlayer().BotPlay(timeout, actionBotDelay, () => BotPlayCardCallback(socket))
            }
            else{
                this.GetCurrentPlayer().StartTimer(timeout, () => PlayCardTimeOutCallback(socket))
            }
        }
        return removeCard;
    }
    private IsFinishedTrick(leaderColor: ColorType | undefined, currentTrickCardModel: TrickCardModel | undefined ): boolean {
        return (leaderColor && currentTrickCardModel?.detail.length === 4) ?? false
    }
    private TrickFinishedProcess(
        leaderColor: ColorType
        , currentTrickCardModel: TrickCardModel
        , PlayCardTimeOutCallback: (socket: Socket) => void
        , socket: Socket
        , BotPlayCardCallback: (socket: Socket) => void
    ): void
    {
        this.GetCurrentPlayer().ClearTimer()
        this.currentPlayerNumber =  FriendCardGameRoundLogic.CalculateWinnerTrickSetNextLeader(
            this.trumpColor!,
            leaderColor,
            currentTrickCardModel,
            this.playersInOrder,
            this.roundNumber
        );
        this.currentTrickNumber++;
        this.endTrickFlag = true;
        if(this.currentTrickNumber >= this.totalTrickNumber) {
            this.FinishRound()
        }else{
            if(this.GetCurrentPlayer().GetIsDisconnected()){
                this.GetCurrentPlayer().BotPlay(FRIEND_TIMEOUT_CONFIG.PLAY_CARD_WITH_TRICK_FINISH_POPUP_IN_SEC
                    , FRIEND_TIMEOUT_CONFIG.TRICK_FINISHED_POPUP_IN_SEC
                    , () => BotPlayCardCallback(socket)
                )
            }
            else {
                this.GetCurrentPlayer().StartTimer(FRIEND_TIMEOUT_CONFIG.PLAY_CARD_WITH_TRICK_FINISH_POPUP_IN_SEC, () => PlayCardTimeOutCallback(socket))
            }
        }
    }
    public FinishRound(): void
    {
        const [winnerTeamPoint, anotherTeamPoint] = FriendCardGameRoundLogic.CalculateTotalTeamPoint(this.auctionWinnerTeamIds, this.anotherTeamIds, this.playersInOrder, this.roundNumber);
        this.winnerAuctionTeamTotalPoint = winnerTeamPoint;
        this.anotherTeamTotalPoint = anotherTeamPoint;
        const [roundWinnerIds, roundWinnerPoint] = FriendCardGameRoundLogic.CalculatePlayerGamePoint(
            this.roundNumber, 
            this.playersInOrder, 
            this.highestAuctionId, 
            this.auctionWinnerTeamIds, 
            this.anotherTeamIds,
            this.winnerAuctionTeamTotalPoint,
            this.anotherTeamTotalPoint,
            this.auctionPoint
        );
        this.roundWinnerIds = roundWinnerIds;
        this.roundWinnerPoint = roundWinnerPoint;
        this.gameplayState = GAME_STATE.FINISHED;
        this.roundState = GAME_STATE.FINISHED;
    }
    public IsFriendAppeared(): boolean { return this.isFriendAppeared; }
    public GetAuctionWinnerTeamIds(): string[] { return this.auctionWinnerTeamIds; }
    public GetAnotherTeamIds(): string[] { return this.anotherTeamIds; }
    public GetFriendPlayer(): FriendCardPlayer | undefined 
    { 
        let friendPlayer: FriendCardPlayer | undefined = undefined;
        if(this.friendCard){
            this.playersInOrder.forEach(player => {
                if(player.GetHandCard().HasCard(this.friendCard!)) 
                    friendPlayer = player;
            })
        }
        return friendPlayer;
    }
    public GetRoundNumber(): number { return this.roundNumber }
    public GetRoundWinnerIds(): string[] { return this.roundWinnerIds}
    public IsTrumpAndFriendNotUndefined(): boolean { return this.trumpColor !== undefined && this.auctionPoint !== undefined; }
    public GetPlayerInOrder(): FriendCardPlayer[] { return this.playersInOrder; }
    public GetCurrentTrickNumber(): number { return this.currentTrickNumber; }
    public GetCurrentPlayer(): FriendCardPlayer { return this.playersInOrder[this.currentPlayerNumber]; }
    public GetHighestAuctionPlayer(): FriendCardPlayer | undefined { return this.playersInOrder.find(a => a.UID === this.highestAuctionId); }
    public GetHighestAuctionPlayerIndex(): number { return this.playersInOrder.findIndex(a => a.UID === this.highestAuctionId); }
    public IsPlayerTurn(playerId: string) : boolean { return this.GetCurrentPlayer()?.UID === playerId; }
    public IsEndOfTrick(): boolean{
        let result: boolean = false;
        if (this.endTrickFlag){
            result = true;
            this.endTrickFlag = false;
        }
        return result;
    }
    public GetNameByUID(UID: string): string{
        const player: FriendCardPlayer | undefined = this.playersInOrder.find(a => a.UID === UID)
        return player ? player.username : "No name"
    }
    public GetLatestWinnerTrickResponse(): WinnerTrickResponse | undefined{
        const latestTrick: number = this.currentTrickNumber - 1;
        const trickCardModel: TrickCardModel | undefined  = this.trickCardMap.get(latestTrick);
        if (trickCardModel && trickCardModel.winnerId && trickCardModel.winnerCard && trickCardModel.pointInTrick !== undefined) {
            const playersPoint: PlayerPointInfo[] = this.CreatePlayerPointInfo();
            const orderWinnerPosition: number = this.GetPlayersInOrderIndex(trickCardModel.winnerId)
            const winnerUsername: string = this.GetNameByUID(trickCardModel.winnerId)
            return new WinnerTrickResponse(trickCardModel.winnerId
                , winnerUsername
                , trickCardModel.winnerCard
                , trickCardModel.pointInTrick
                , latestTrick
                , playersPoint
                , orderWinnerPosition);
        }
        else {
            return undefined;
        }
    }
    public CreatePlayerPointInfo(): PlayerPointInfo[] {
        return this.playersInOrder.map(a => {
            const playerId: string = a.UID;
            const playerName: string = a.username;
            const cardsPointReceive: number = a.GetRoundPoint(this.roundNumber);
            const gamePointReceive: number = a.GetGamePoint(this.roundNumber);
            return new PlayerPointInfo(playerId, playerName, cardsPointReceive, gamePointReceive)
        })
    }
    public GetGameplayState(): GAME_STATE { return this.gameplayState; }
    public GetAuctionPoint() : number { return this.auctionPoint; }
    public GetInfoForAuctionPointResponse(): [string, string | undefined, number, number] {
        return [this.GetCurrentPlayer().UID, this.GetHighestAuctionPlayer()?.UID, this.auctionPoint, this.gameplayState];
    }
    public GetRoundState(): GAME_STATE { return this.roundState; }
    public GetCardsInField(): CardId[] {
        const cards: CardId[] | undefined = this.trickCardMap.get(this.currentTrickNumber)?.GetAllCardInTrick();
        return cards ? cards : []
    }
    public GetActionsDTOForPlayer(player: FriendCardPlayer): ActionsDTO {
        return {
			isPlayerTurn: this.IsPlayerTurn(player.UID),
            cardsPlayerCanPlay: this.IsPlayerTurn(player.UID) ? this.CardsCanPlay(player) : []
		};
	}
    public CardsCanPlay(player: FriendCardPlayer): CardId[]{
        let result: CardId[];
        const leaderCardId: CardId | undefined  = this.trickCardMap.get(this.currentTrickNumber)?.detail.at(0)?.cardId;
        const leaderColor: ColorType | undefined = leaderCardId ? CardLogic.GetColor(leaderCardId) : undefined;
        if (leaderColor) {
            const cardsFollowAsLeader: CardId[] = player.GetHandCard().GetAllCardsHasColor(leaderColor);
            if (cardsFollowAsLeader.length === 0){
                result = player.GetHandCard().GetInDeck();
            }
            else {
                result = cardsFollowAsLeader;
            }
        }
        else {
            result = player.GetHandCard().GetInDeck();
        }
        return result;
    }
    public CanPlayerPlaySpecificCard(player: FriendCardPlayer, cardId: CardId): boolean
    {
        const playerHand: CardId[] = player.GetHandCard().GetInDeck();
        return playerHand.indexOf(cardId) >= 0;
    }
    public GetTrumpColor(): ColorType | undefined { return this.trumpColor }
    public GetCardsByColorArePlayed(color: ColorType): CardId[] {
        const cardsResult: CardId[] = []
        let allCardsPlayed: CardId[] = []
        this.trickCardMap.forEach((trick: TrickCardModel, key: number) => {
            allCardsPlayed = allCardsPlayed.concat(trick.GetAllCardInTrick())
        })
        allCardsPlayed.forEach(card => {
            if(CardLogic.IsColor(card, color)){
                cardsResult.push(card)
            }
        })
        return cardsResult
    }
    public GetCardsByShapeArePlayed(shape: ShapeType): CardId[] {
        const cardsResult: CardId[] = []
        let allCardsPlayed: CardId[] = []
        this.trickCardMap.forEach((trick: TrickCardModel, key: number) => {
            allCardsPlayed = allCardsPlayed.concat(trick.GetAllCardInTrick())
        })
        allCardsPlayed.forEach(card => {
            if(CardLogic.IsShape(card, shape)){
                cardsResult.push(card)
            }
        })
        return cardsResult
    }
    public GetFriendCardInTrick(): CardId | undefined {
        let friendCard: CardId | undefined = undefined
        const currentPlayerUID: string = this.GetCurrentPlayer().UID
        let friendUID: string | undefined = undefined
        if (this.isFriendAppeared && this.auctionWinnerTeamIds.some(UID => UID === currentPlayerUID)){
            this.auctionWinnerTeamIds.forEach(UID => {
                if(UID !== currentPlayerUID){
                    friendUID = UID
                }
            })
        }
        else if (this.isFriendAppeared && this.anotherTeamIds.some(UID => UID === currentPlayerUID)) {
            this.anotherTeamIds.forEach(UID => {
                if(UID !== currentPlayerUID){
                    friendUID = UID
                }
            })
        }
        if(friendUID){
            friendCard = this.trickCardMap.get(this.currentTrickNumber)?.GetCardByPlayerId(friendUID)
        }
        return friendCard
    }
    public GetCurrentPlayerOrderTurn(): number {
        let orderTurn: number = 0 // start from 0 to 3
        const totalPlayerPlayedInTrick: number | undefined = this.trickCardMap.get(this.currentTrickNumber)?.detail.length
        if(totalPlayerPlayedInTrick){
            orderTurn = totalPlayerPlayedInTrick
        }
        return orderTurn
    }
}