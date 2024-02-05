import { model, Schema } from 'mongoose';

interface matchObject {
    matchId: string;
    score: number;
}

export interface MatchDataDocument extends Document {
    firebaseId: string;
    win: number;
    match: number;
    latestMatch: matchObject[];
}

const matchSchema = new Schema<MatchDataDocument>({
    firebaseId: {
        type: String,
        required: true,
    },
    win: {
        type: Number,
        required: true,
    },
    match: {
        type: Number,
        required: true,
    },
    latestMatch: {
        type: [],
        require: true,
    },
});

export const MatchModel = model<MatchDataDocument>('Matches', matchSchema);