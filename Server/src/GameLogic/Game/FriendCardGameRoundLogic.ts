import {CardId, ColorType} from "../../Enum/CardConstant.js";
import {FriendCardPlayer} from "../../GameFlow/Player/FriendCardPlayer.js";
import {TrickCardDetailModel, TrickCardModel} from "../../Model/DTO/TrickCardModel.js";
import {DeckLogic} from "../Card/DeckLogic.js";
import {FriendCardLogic} from "../Card/FriendCardLogic.js";

export class FriendCardGameRoundLogic
{
    public static CalculateWinnerTrickSetNextLeader(
        trumpColor: ColorType, 
        leaderColor: ColorType, 
        trickCardModel: TrickCardModel, 
        playersInOrder: FriendCardPlayer[],
        roundNumber: number): number
    {
        const trickCardDetailModelArray: TrickCardDetailModel[] = trickCardModel.detail;
        const winnerCard: CardId = FriendCardLogic.TrickWinnerCard(trumpColor, leaderColor, trickCardDetailModelArray);
        const pointInTrick: number = FriendCardLogic.FindPointInCards(trickCardDetailModelArray);
        const winnerId: string | undefined = trickCardDetailModelArray.find(a => a.cardId === winnerCard)?.playerId
        trickCardModel.winnerId = winnerId;
        trickCardModel.pointInTrick = pointInTrick;
        trickCardModel.winnerCard = winnerCard;
        playersInOrder.find(a => a.UID === winnerId)?.AddRoundPoint(roundNumber, pointInTrick);
        return playersInOrder.findIndex(a => a.UID === winnerId);
    }
    public static NextTrick(currentTrickNumber: number): number
    {
        return currentTrickNumber++;
    }
    public static InitializeTeam(
        highestAuctionPlayer: FriendCardPlayer | undefined, 
        friendPlayer: FriendCardPlayer | undefined, 
        playersInOrder: FriendCardPlayer[], 
        winnerAuctionTeamIds: string[],
        anotherTeamIds: string[]): void
    {
        if(!highestAuctionPlayer || !friendPlayer) throw new Error("Initialize team error");
        winnerAuctionTeamIds.push(highestAuctionPlayer.UID);
        winnerAuctionTeamIds.push(friendPlayer.UID);
        playersInOrder.filter(p => p.UID !== highestAuctionPlayer.UID && p.UID !== friendPlayer.UID).forEach(player => anotherTeamIds.push(player.UID));
    }
    public static InitializeTrick(number: number, trickCardMap: Map<number, TrickCardModel>): void 
    {
        for (let i = 0; i < number; i++) 
            trickCardMap.set(i, new TrickCardModel());
    }
    public static NextPlayer(currentPlayerNumber: number, maxPlayer: number) : number
    {
        let result = ++currentPlayerNumber;
        if (result >= maxPlayer) result = 0;
        return result;
    }
    public static PrepareCard(deck: DeckLogic, playersInOrder: FriendCardPlayer[]): void
    {
        deck.Full();
        playersInOrder.forEach((player: FriendCardPlayer) => {
            player.GetHandCard().Empty();
            player.GetHandCard().Add(deck.PopNumRandomCards(13));
        });
    }
    public static CalculateTotalTeamPoint(
        winnerAuctionTeamIds: string[],
        anotherTeamIds: string[],
        playersInOrder: FriendCardPlayer[],
        roundNumber: number): [number, number]
    {
        let winnerAuctionTeamTotalPoint: number = 0;
        let anotherTeamTotalPoint: number = 0;
        playersInOrder.filter(player => winnerAuctionTeamIds.some(id => id === player.UID)).forEach(player => {
            winnerAuctionTeamTotalPoint += player.GetRoundPoint(roundNumber);
        })
        playersInOrder.filter(player => anotherTeamIds.some(id => id === player.UID)).forEach(player => {
            anotherTeamTotalPoint += player.GetRoundPoint(roundNumber);
        })
        return [winnerAuctionTeamTotalPoint, anotherTeamTotalPoint]
    }
    public static CalculatePlayerGamePoint(
        roundNumber: number,
        playersInOrder: FriendCardPlayer[],
        auctionWinnerPlayerId: string,
        auctionWinnerTeamIds: string[],
        anotherTeamIds: string[],
        winnerAuctionTeamTotalPoint: number,
        anotherTeamTotalPoint: number,
        auctionPoint: number
    ): [string[], number]
    {
        let roundWinnerIds: string[];
        let roundWinnerPoint: number;
        const isWinnerAuctionTeamWinTheGame: boolean = winnerAuctionTeamTotalPoint >= auctionPoint;
        if (isWinnerAuctionTeamWinTheGame)
        {
            roundWinnerIds = auctionWinnerTeamIds;
            roundWinnerPoint = winnerAuctionTeamTotalPoint;
            playersInOrder.filter(player => auctionWinnerTeamIds.some(id => id === player.UID)).forEach(player => {
                let gamePoint: number;
                if(player.UID === auctionWinnerPlayerId)
                    gamePoint = auctionPoint + (player.GetRoundPoint(roundNumber));
                else
                    gamePoint = (auctionPoint / 2) + (player.GetRoundPoint(roundNumber));
                player.AddGamePoint(roundNumber, gamePoint);
            });
            playersInOrder.filter(player => anotherTeamIds.some(id => id === player.UID)).forEach(player => {
                player.DecreaseGamePoint(roundNumber, 100 - auctionPoint);
            });
        }
        else
        {
            roundWinnerIds = anotherTeamIds;
            roundWinnerPoint = anotherTeamTotalPoint;
            playersInOrder.filter(player => auctionWinnerTeamIds.some(id => id === player.UID)).forEach(player => {
                if(player.UID === auctionWinnerPlayerId)
                {
                    player.DecreaseGamePoint(roundNumber, auctionPoint);
                }
                else
                {
                    let gamePoint: number = (auctionPoint / 2) - (player.GetRoundPoint(roundNumber));
                    player.DecreaseGamePoint(roundNumber, gamePoint >= 0 ? gamePoint : 0 );
                }
            });

            let sumPlayerPoint: number = 0;
            playersInOrder.filter(player => anotherTeamIds.some(id => id === player.UID)).forEach(player => sumPlayerPoint += player.GetRoundPoint(roundNumber));
            playersInOrder.filter(player => anotherTeamIds.some(id => id === player.UID)).forEach(player => player.AddGamePoint(roundNumber, sumPlayerPoint / 2) );
        }
        return[roundWinnerIds, roundWinnerPoint];
    }
}