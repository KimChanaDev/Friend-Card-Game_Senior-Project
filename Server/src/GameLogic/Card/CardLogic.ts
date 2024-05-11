import {CardId, ColorType, Shapes, ShapeType} from "../../Enum/CardConstant.js";
import {resolveCaa} from "dns";

export abstract class CardLogic
{
	public static IsColorSameAs(card1: CardId, card2: CardId): boolean { return (card1[1] as ColorType) === (card2[1] as ColorType); }
	public static IsShapeSameAs(card1: CardId, card2: CardId): boolean { return (card1[0] as ShapeType) === (card2[0] as ShapeType) }
	public static IsShapeGreaterThan(card1: CardId, card2: CardId): boolean { return Shapes.indexOf(card1[0] as ShapeType) > Shapes.indexOf(card2[0] as ShapeType); }
	public static IsShapeGreaterOrSameAs(card1: CardId, card2: CardId): boolean { return this.IsShapeSameAs(card1, card2) || this.IsShapeGreaterThan(card1, card2); }
	public static IsColor(card: CardId, color: ColorType): boolean { return card[1] === color; }
	public static GetCardsOnlyColor(cards: CardId[], color: ColorType): CardId[]{
		const result: CardId[] = []
		cards.forEach(card => {
			if (this.IsColor(card, color)){
				result.push(card)
			}
		})
		return result
	}
	public static IsShape(card: CardId, shape: ShapeType): boolean { return card[0] === shape; }
	public static IsCardsHasShapes(cards: CardId[], shapes: ShapeType[]): boolean{
		let result: boolean = false
		outerLoop : for (const card of cards){
			for (const shape of shapes){
				if(this.IsShape(card, shape)) {
					result = true
					break outerLoop
				}
			}
		}
		return result
	}
	public static IsCardsHasColor(cards: CardId[], color: ColorType): boolean{
		let result: boolean = false
		for (const card of cards){
			if(this.IsColor(card, color)){
				result = true
				break;
			}
		}
		return result
	}
	public static GetColor(card: CardId): ColorType { return card[1] as ColorType; }
}