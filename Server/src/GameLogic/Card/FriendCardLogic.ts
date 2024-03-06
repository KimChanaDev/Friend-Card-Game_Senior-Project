import { CardId, ColorType } from "../../Enum/CardConstant.js";
import { TrickCardDetailModel } from "../../Model/DTO/TrickCardModel.js";
import { CardLogic } from "./CardLogic.js";

export class FriendCardLogic extends CardLogic
{
    public static TrickWinnerCard(trumpColor: ColorType, leaderColer: ColorType, trickCardDetailModel: TrickCardDetailModel[]): CardId
    {
        let winnerCard: CardId;
        let trumpCards: CardId[] =  [];
        let sameLeaderColorCards: CardId[] = [];
        trickCardDetailModel.filter(a => CardLogic.IsColor(a.cardId, trumpColor)).forEach(a => trumpCards.push(a.cardId));
        if(trumpCards.length === 0)
        {
            trickCardDetailModel.filter(a => CardLogic.IsColor(a.cardId, leaderColer)).forEach(a => sameLeaderColorCards.push(a.cardId));
            winnerCard = this.MaximumShapeByColor(sameLeaderColorCards);
        }
        else
        {
            winnerCard = this.MaximumShapeByColor(trumpCards);
        }
        return winnerCard;
    }
    public static FindPointInCards(trickCardDetailModel: TrickCardDetailModel[]): number
    {
        let totalPoint: number = 0;
        trickCardDetailModel.forEach(a => {
            if(CardLogic.IsShape(a.cardId, "5")) totalPoint+=5;
            if(CardLogic.IsShape(a.cardId, "T") || CardLogic.IsShape(a.cardId, "K")) totalPoint+=10;
        });
        return totalPoint; 
    }
    public static MaximumShapeByColor(compareCard :CardId[]): CardId
    {
        let result: CardId = compareCard[0];
        for (let i = 1; i < compareCard.length; i++) {
            if(result && CardLogic.IsShapeGreaterThan(compareCard[i], result))
                result = compareCard[i];
        }
        return result;
    }
    public static CheckShapeCard(cards: CardId[]): number[] {
        const arrayAIFormat: number[] = []
        if( FriendCardLogic.IsCardsHasShapes(cards, ["2","3","4","6","7","8","9"]) ){
            arrayAIFormat.push(1)
        }else{
            arrayAIFormat.push(0)
        }
        if (FriendCardLogic.IsCardsHasShapes(cards, ['5'])){
            arrayAIFormat.push(1)
        }else{
            arrayAIFormat.push(0)
        }
        if (FriendCardLogic.IsCardsHasShapes(cards, ['T'])){
            arrayAIFormat.push(1)
        }else{
            arrayAIFormat.push(0)
        }
        if (FriendCardLogic.IsCardsHasShapes(cards, ['J'])){
            arrayAIFormat.push(1)
        }else{
            arrayAIFormat.push(0)
        }
        if (FriendCardLogic.IsCardsHasShapes(cards, ['Q'])){
            arrayAIFormat.push(1)
        }else{
            arrayAIFormat.push(0)
        }
        if(FriendCardLogic.IsCardsHasShapes(cards, ['K'])){
            arrayAIFormat.push(1)
        }else{
            arrayAIFormat.push(0)
        }
        if(FriendCardLogic.IsCardsHasShapes(cards, ['A'])){
            arrayAIFormat.push(1)
        }else{
            arrayAIFormat.push(0)
        }
        return arrayAIFormat
    }
}