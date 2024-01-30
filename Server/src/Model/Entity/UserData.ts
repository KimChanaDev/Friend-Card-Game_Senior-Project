import { IsEmail } from 'class-validator';
import { model, Schema } from 'mongoose';

// interface matchObject {
//     matchId: string;
//     score: number;
// }

export interface UserDataDocument extends Document {
	id: string;
    username: string;
    email: string;
    // password: string;
    // confirmPassword: string;
    imagePath: string;
    displayName: string;
    provider: string;
    firebaseId: string;
    UID: string;
    // win: number;
    // match: number;
    // lastestMatch: matchObject[];
}

const userSchema = new Schema<UserDataDocument>({
    username: {
		type: String,
		minlength: 6,
		maxlength: 20,
		required: true,
		unique: true,
	},
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [IsEmail, 'Invalid email format'],
    },
    // password: {
    //     type: String,
    //     minlength: 6,
    //     maxlength: 20,
    //     required: true,
    // },
    imagePath: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    firebaseId: {
        type: String,
        required: true,
    },
    // win: {
    //     type: Number,
    //     required: true,
    // },
    // match: {
    //     type: Number,
    //     required: true,
    // },
    // lastestMatch: {
    //     type: [],
    //     required: true,
    // }
});

export const UserDataModel = model<UserDataDocument>('UserData', userSchema);