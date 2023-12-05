import { CardId, ColorType, Colors, ShapeType, Shapes } from "../../Enum/CardConstant.js";
import { RandomArrayElement } from '../Utils/Tools.js';
import { CardLogic } from "./CardLogic.js";

export class DeckLogic
{
    private validShapes: ShapeType[];
	private validColors: ColorType[];
	private inDeck: CardId[];
    private readonly numOfDecks: number;

    constructor(numOfDecks: number = 1) {
		this.validShapes = [...Shapes];
		this.validColors = [...Colors];
        this.numOfDecks = numOfDecks;
        this.inDeck = [];
	}

    public Empty(): void { this.inDeck = []; }
    public HasColor(color: ColorType): boolean | undefined { return this.inDeck.some(card => CardLogic.IsColor(card, color))}
    public HasCard(cardId: CardId): boolean { return this.inDeck.indexOf(cardId) >= 0; }
    public Remove(cardId: CardId): void { this.inDeck.splice(this.inDeck.indexOf(cardId), 1); }
	public IsCardValidForDeck(cardId: CardId): boolean { return this.validShapes.includes(cardId[0] as ShapeType) && this.validColors.includes(cardId[1] as ColorType); }
	public IsColorValidForDeck(color: ColorType): boolean { return this.validColors.includes(color); }
	public GetNumOfCardsInDeck(): number { return this.inDeck.length; }
	public GetInDeck(): CardId[] { return this.inDeck; }
	public GetAllCardsHasColor(color: ColorType): CardId[] { return this.inDeck.filter(card =>  CardLogic.IsColor(card, color)).map(card => card) }
    public Full(): void
    {
		this.inDeck = [];
		const cards: CardId[] = this.validShapes.flatMap((shape) =>
			this.validColors.map((color) => (shape + color) as CardId)
		);
		for (let i = 0; i < this.numOfDecks; i++)
        {
            this.inDeck.push(...cards);
        }
	}
    public Add(toAdd: CardId | CardId[]): void
    {
		if (Array.isArray(toAdd))
        {
			if (toAdd.every((card) => this.IsCardValidForDeck(card)))
                this.inDeck.push(...toAdd);
			else 
                throw new Error('Card not valid for deck');
		}
        else
        {
			if (this.IsCardValidForDeck(toAdd))
                this.inDeck.push(toAdd);
			else
                throw new Error('Card not valid for deck');
		}
	}
    public PopNumRandomCards(numCard: number): CardId[]
    {
		let cardIds: CardId[] = [];
		if (numCard < this.inDeck.length) {
			for (let i = 0; i < numCard; i++) {
				const card: CardId = RandomArrayElement(this.inDeck);
				this.Remove(card);
				cardIds.push(card);
			}
		} else {
			cardIds = [...this.inDeck];
			this.Empty();
		}

		return cardIds;
	}
}