import {MatchModel, matchObject} from "../Model/Entity/MatchData.js";
import {FriendCardPlayer} from "../GameFlow/Player/FriendCardPlayer";

export class FriendCardGameRepository {

    public static SaveMatchHistory(matchModel: matchObject, isWinner: boolean, player: FriendCardPlayer){
        MatchModel.updateOne({ firebaseId: player.firebaseId },
            {
                $push: { latestMatch: matchModel },
                $inc: {
                    match: 1,
                    win: isWinner ? 1 : 0
                },
            }
        ).then(() => {
            console.log(`save database success. firebaseId: ${player.firebaseId}`)
        }).catch(() => {
            console.error(`save database failed. firebaseId: ${player.firebaseId} match: ${JSON.stringify(matchModel)}`)
        });
    }
}