export interface IEmojiCoolDown{
    playerId: string;
    coolDown:  NodeJS.Timeout | null;
}