import { Request, Response, NextFunction, RequestHandler } from "express";
import { ValidationMiddleware } from "../Middleware/ValidationMiddleware.js";
import { LoginDTO, UserDataDTO } from "../Model/DTO/UserDataDTO.js";
import { ExpressRouter } from "./ExpressRouter.js";
import { UserDataModel } from "../Model/Entity/UserData.js";
// import { InvalidCredentialsError, PasswordMismatchError, UserExistsError, InternalError, ResourceNotFoundError } from "../Error/ErrorException.js";
// import { GenerateNewSaltAndHash, ValidatePassword } from "../GameLogic/Utils/Authorization/Password.js";
import { IssueJWTwithEmail } from "../GameLogic/Utils/Authorization/JWT.js";
import { HistoryResponseDTO, LoginWithEmailResponseDTO, ProfileResponseDTO, ResetPasswordDTO } from "../Model/DTO/Response/LoginWithEmailResponseDTO.js";
import { newFirebaseAuthMiddleware } from "../Middleware/FirebaseAuthMiddleware.js";
import axios from "axios";
import { isEmail } from "class-validator";
import { JwtAuthMiddleware } from "../Middleware/JwtAuthMiddleware.js";
import { JwtPayload } from "jsonwebtoken";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier.js";
import { MatchModel } from "../Model/Entity/MatchData.js";
import { v4 as uuidv4 } from 'uuid'
import {SocketHandler} from "../Handler/SocketHandler.js";
import {GameRoom} from "../GameFlow/Game/GameRoom.js";
import {GamesStore} from "../GameFlow/Game/GameStore.js";
import {Player} from "../GameFlow/Player/Player.js";

export class UserdataController extends ExpressRouter {
    public path: string = '/userdata';
    constructor() {
        super();
        this.InitializeRoutes();
    }
    private async InitializeRoutes(): Promise<void> {
        this.router.post('/register', ValidationMiddleware(UserDataDTO), this.RegisterUser);
        this.router.post('/login', ValidationMiddleware(LoginDTO), this.LoginUser);
        this.router.post('/firebase-auth', newFirebaseAuthMiddleware, this.FirebaseAuth);
        this.router.get('/profile', JwtAuthMiddleware, this.Profile);
        this.router.get('/history', JwtAuthMiddleware, this.History);
        this.router.patch('/profile', JwtAuthMiddleware, this.UpdateProfile);
        this.router.post('/resetpassword', JwtAuthMiddleware, this.ResetPassword);
        // this.router.patch('/history', this.UpdateHistory); //For testing
    }
    private async RegisterUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        let firebaseTokenId: string | null = null;

        try {
            console.log('RegisterUser: ' + req);
            const newUserData: UserDataDTO = req.body;
            if (newUserData.password !== newUserData.confirmPassword) {
                // return next(new PasswordMismatchError());
                throw new Error('PasswordMismatch')
            }
            // const user = await UserDataModel.findOne({ username: newUserData.username });
            const user = await UserDataModel.findOne({
                $and: [
                    { username: newUserData.username },
                    { provider: "password" }
                ]
            });
            // if (user) return next(new UserExistsError(newUserData.username));
            if (user) throw new Error('UserExistsError');

            const { data: response } = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBCNyyTwo_RLCHrJD_xNnYHy8G67DDeKbw', {
                email: newUserData.email,
                password: newUserData.password,
                returnSecureToken: true,
            })

            firebaseTokenId = response.idToken;

            const jsonRes = JSON.parse(Buffer.from(response.idToken.split('.')[1], 'base64').toString());

            const getNextUID = async () => {
                const lastUser = await UserDataModel.findOne({ UID: { $exists: true, $type: 2 } }, {}, { sort: { UID: -1 } });
                if (lastUser && lastUser.UID) {
                    const lastUID = lastUser.UID;
                        const nextNumber = parseInt(lastUID) + 1;
                        return nextNumber.toString();
                }
                return '80000001';
            };

            const uid = await getNextUID();

            const uuid = uuidv4();

            // const { salt, hash } = GenerateNewSaltAndHash(newUserData.password);
            const createdUser = new UserDataModel({
                username: newUserData.username,
                email: newUserData.email,
                // password: newUserData.password,
                // confirmPassword: newUserData.confirmPassword,
                imagePath: newUserData.imagePath,
                displayName: newUserData.username,
                provider: jsonRes.firebase.sign_in_provider,
                firebaseId: jsonRes.user_id,
                // win: 0,
                // match: 0,
                // lastestMatch: [
                //     {
                //         matchId: 11,
                //         score: 999,
                //     },
                //     {
                //         matchId: 22,
                //         score: 888,
                //     },
                //     {
                //         matchId: 33,
                //         score: 777,
                //     },
                //     {
                //         matchId: 44,
                //         score: 666,
                //     },
                //     {
                //         matchId: 55,
                //         score: 555,
                //     },
                //     {
                //         matchId: 66,
                //         score: 444,
                //     },
                // ],
                UID: uid,
                UUID: uuid,
            });
            const savedUser = await createdUser.save();
            const createdMatch = new MatchModel({
                firebaseId: createdUser.firebaseId,
                win: 0,
                match: 0,
                latestMatch: [],
            })
            await createdMatch.save();
            const token: string = IssueJWTwithEmail(savedUser);
            // console.log(savedUser)
            const result = {
                message: 'success',
                data: {
                    jwt: token,
                    displayName: savedUser.username,
                    UID: savedUser.UID,
                    imagePath: savedUser.imagePath,
                }
            }
            res.json(new LoginWithEmailResponseDTO(result))
        } catch (err : any) {
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.error?.message;
                console.error(errorMessage);
                if (errorMessage === 'EMAIL_EXISTS') {
                    res.status(400).json({ error: 'This email is already in use.' });
                } else if (errorMessage === 'OPERATION_NOT_ALLOWED') {
                    res.status(400).json({ error: 'This operation is not allowed.' });
                } else if (errorMessage === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
                    res.status(400).json({ error: 'Too many attempts. Please try again later.' });
                } else {
                    // Handle other Firebase errors or log the entire error for debugging
                    console.error('Firebase Authentication Error:', err.response?.data);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else if (err.message === 'PasswordMismatch') {
                console.error(err.message);
                res.status(418).json({ error: 'Password doesn\'t match with confirm password.' });
            } else if (err.message === 'UserExistsError') {
                console.error(err.message);
                res.status(409).json({ error: 'This username already exists.' });
            } else {
                // Handle non-Axios errors or log the entire error for debugging
                console.error('Unexpected Error:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
            //if firebase user exists, remove firebase user if the register operation fail. (ex. register to firebase success but fail to save object to mongoDB)
            if (firebaseTokenId) {
                try {
                    console.log('removing user from firebase')
                    await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyBCNyyTwo_RLCHrJD_xNnYHy8G67DDeKbw', {
                        idToken: firebaseTokenId,
                    });
                } catch (deleteError) {
                    console.error('Error deleing user from Firebase', deleteError);
                }
            }
        }
    }
    private async LoginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('LoginUser: ' + req);
            const newUserData: LoginDTO = req.body;
            if (!isEmail(newUserData.username)) {
                const user = await UserDataModel.findOne({
                    $and: [
                        { username: newUserData.username },
                        { provider: "password" }
                    ]
                });
                // if (!user) return next(new InvalidCredentialsError());
                if (!user) throw new Error('InvalidCredentialsError');
                const { data: response } = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBCNyyTwo_RLCHrJD_xNnYHy8G67DDeKbw', {
                    email: user.email,
                    password: newUserData.password,
                    returnSecureToken: true,
                })
                const uuid = uuidv4();
                const updatedResult = await UserDataModel.updateOne(
                    { firebaseId: user.firebaseId },
                    {
                        $set: {
                            UUID: uuid,
                        }
                    }
                )
                if (updatedResult.modifiedCount == 0) {
                    throw new Error('Fail to update UUID');
                }
                const updatedUser = await UserDataModel.findOne({
                    $and: [
                        { username: newUserData.username },
                        { provider: "password" }
                    ]
                });
                if (!updatedUser) throw new Error('Cannot find updated user');
                const token: string = IssueJWTwithEmail(updatedUser);
                const result = {
                    message: 'success',
                    data: {
                        jwt: token,
                        displayName: updatedUser.displayName,
                        UID: updatedUser.UID,
                        imagePath: updatedUser.imagePath,
                    }
                }
                res.json(new LoginWithEmailResponseDTO(result))
            } else {
                const { data: response } = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBCNyyTwo_RLCHrJD_xNnYHy8G67DDeKbw', {
                    email: newUserData.username,
                    password: newUserData.password,
                    returnSecureToken: true,
                })
                const jsonRes = JSON.parse(Buffer.from(response.idToken.split('.')[1], 'base64').toString());
                const user = await UserDataModel.findOne({
                    firebaseId: jsonRes.user_id
                });
                // if (!user) return next(new InvalidCredentialsError());
                if (!user) throw new Error('InvalidCredentialsError');
                const uuid = uuidv4();
                const updatedResult = await UserDataModel.updateOne(
                    { firebaseId: user.firebaseId },
                    {
                        $set: {
                            UUID: uuid,
                        }
                    }
                )
                if (updatedResult.modifiedCount == 0) {
                    throw new Error('Fail to update UUID');
                }
                const updatedUser = await UserDataModel.findOne({
                    firebaseId: jsonRes.user_id
                });
                if (!updatedUser) throw new Error('Cannot find updated user');
                const token: string = IssueJWTwithEmail(updatedUser);
                const result = {
                    message: 'success',
                    data: {
                        jwt: token,
                        displayName: updatedUser.displayName,
                        UID: updatedUser.UID,
                        imagePath: updatedUser.imagePath,
                    }
                }
                if(SocketHandler.HasUserIdInConnectedUsers(updatedUser.UID)){
                    console.log("at check HasUserId")
                    const gameRoomIdAreConnect: string | undefined = SocketHandler.GetGameId(updatedUser.UID)
                    if(gameRoomIdAreConnect){
                        console.log("at check gameRoomIdAreConnect")
                        const gameRoom: GameRoom = GamesStore.getInstance.GetGameById(gameRoomIdAreConnect) as GameRoom;
                        const player: Player = gameRoom.GetPlayerByUID(updatedUser.UID) as Player;
                        console.log("gameRoom: " + gameRoom)
                        console.log("player: " + player)
                        console.log("gameRoomIdAreConnect: " + gameRoomIdAreConnect)
                        SocketHandler.DisconnectedPlayer(gameRoom, player, "You have been double logged in", undefined)
                    }
                }
                res.json(new LoginWithEmailResponseDTO(result))
            }
        } catch (err : any) {
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.error?.message;
                console.error(errorMessage);
                if (errorMessage === 'INVALID_LOGIN_CREDENTIALS') {
                    res.status(401).json({ error: 'Invalid login credentials.' });
                } else if (errorMessage === 'EMAIL_NOT_FOUND') {
                    res.status(404).json({ error: 'Email not found.' });
                } else if (errorMessage === 'INVALID_PASSWORD') {
                    res.status(401).json({ error: 'Invalid username or password.' });
                } else if (errorMessage === 'USER_DISABLED') {
                    res.status(403).json({ error: 'This account has been disabled by an administrator.' });
                } else {
                    // Handle other Firebase errors or log the entire error for debugging
                    console.error('Firebase Authentication Error:', err.response?.data);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else if (err.message === 'InvalidCredentialsError') {
                console.error(err.message);
                res.status(401).json({ error: 'Invalid login credentials' });
            } else {
                // Handle non-Axios errors or log the entire error for debugging
                console.error('Unexpected Error:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }        
    }
    private async Profile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('Profile: ' + req);
            const jwtPayload: string | JwtPayload | undefined = req.jwt;
            if (jwtPayload && typeof jwtPayload === 'object') {
                const user = await UserDataModel.findOne({
                    firebaseId: jwtPayload.firebaseId,
                });
                // if (!user) return next(new InvalidCredentialsError());
                if (!user) throw new Error('InvalidCredentialsError');
                const result = {
                    message: 'success',
                    data: {
                        displayName: user.displayName,
                        UID: user.UID,
                        imagePath: user.imagePath,
                    }
                }
                res.json(new ProfileResponseDTO(result))
            } else {
                console.log('Internal Error')
                // return next(new InternalError());
                throw new Error('InternalError')
            }
        } catch (err : any) {
            if (err.message === 'InvalidCredentialsError') {
                console.error(err.message);
                res.status(401).json({ error: 'Invalid login credentials' });
            } else {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }
    private async UpdateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('UpdateProfile: ' + req);
            const jwtPayload: string | JwtPayload | undefined = req.jwt;
            if (jwtPayload && typeof jwtPayload === 'object') {
                const user = await UserDataModel.findOne({
                    firebaseId: jwtPayload.firebaseId,
                });
                // if (!user) return next(new InvalidCredentialsError());
                if (!user) throw new Error('InvalidCredentialsError');
                if (req.body.displayName === user.displayName && req.body.imagePath === user.imagePath) {
                    const result = {
                        message: 'success',
                        data: {
                            displayName: req.body.displayName,
                            UID: user.UID,
                            imagePath: req.body.imagePath,
                        }
                    }
                }
                const updatedUser = await UserDataModel.updateOne(
                    { firebaseId: user.firebaseId },
                    {
                        $set: {
                            displayName: req.body.displayName,
                            imagePath: req.body.imagePath,
                        },
                    }
                );
                if (updatedUser.modifiedCount > 0) {
                    const result = {
                        message: 'success',
                        data: {
                            displayName: req.body.displayName,
                            UID: user.UID,
                            imagePath: req.body.imagePath,
                        }
                    }
                    res.json(new ProfileResponseDTO(result))
                } else {
                    res.status(500).json({ error: 'Failed to update profile.' });
                }
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    private async History(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('History: ' + req);
            const jwtPayload: string | JwtPayload | undefined = req.jwt;
            if (jwtPayload && typeof jwtPayload === 'object') {
                const matches = await MatchModel.findOne(
                    {
                        firebaseId: jwtPayload.firebaseId,
                    },
                    {
                        latestMatch: { $slice: -5 }
                    }
                );
                // if (!matches) return next(new InternalError());
                if (!matches) throw new Error('InternalError')
                const result = {
                    message: 'success',
                    data: {
                        win: matches.win,
                        match: matches.match,
                        latestMatch: matches.latestMatch,
                    }
                }
                res.json(new HistoryResponseDTO(result))
            } else {
                console.log('Internal Error')
                // return next(new InternalError());
                throw new Error('InternalError')
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    private async UpdateHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('UpdateHistory: ' + req);
            // const jwtPayload: string | JwtPayload | undefined = req.jwt;
            // if (jwtPayload && typeof jwtPayload === 'object') {
                const matches = await MatchModel.findOne(
                    {
                        // firebaseId: jwtPayload.firebaseId,
                        // UID: req.body.uid,
                        firebaseId: req.body.firebaseId,
                    },
                );
                // if (!matches) return next(new InternalError());
                if (!matches) throw new Error('InternalError')
                const updatedMatch = await MatchModel.updateOne(
                    {
                        // firebaseId: jwtPayload.firebaseId,
                        // UID: req.body.uid,
                        firebaseId: req.body.firebaseId,
                    },
                    {
                        $push: {
                            latestMatch: {
                                id: req.body.id,
                                score: req.body.score,
                                place: req.body.place,
                                win: req.body.win
                            }
                        },
                        $inc: {
                            match: 1,
                            win: req.body.win ? 1 : 0
                        },
                    }
                )
                if (updatedMatch.modifiedCount > 0) {
                    const matches = await MatchModel.findOne(
                        {
                            // firebaseId: jwtPayload.firebaseId,
                            // UID: req.body.uid,
                            firebaseId: req.body.firebaseId,
                        },
                    );
                    // if (!matches) return next(new InternalError());
                    if (!matches) throw new Error('InternalError')
                    const result = {
                        message: 'success',
                        data: {
                            win: matches.win,
                            match: matches.match,
                            latestMatch: matches.latestMatch,
                        }
                    }

                    res.json(new HistoryResponseDTO(result))
                } else {
                    res.status(500).json({ error: 'Failed to update profile.' });
                }
            // } else {
            //     console.log('Internal Error')
            //     return next(new InternalError());
            // }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    // this method take idToken (google) then register and return friendJWT
    private async FirebaseAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        let firebaseTokenId: string | null | undefined = req.idToken;

        try {
            console.log('FirebaseAuth: ' + req);
            const firebasePayload: string | DecodedIdToken | undefined = req.firebase
            if (firebasePayload && typeof firebasePayload === 'object') {
                const user = await UserDataModel.findOne({
                    firebaseId: firebasePayload.user_id
                })
                // console.log(firebasePayload)
                // firebaseTokenId = req.firebase;
                if (!user) {
                    const getNextUID = async () => {
                        const lastUser = await UserDataModel.findOne({ UID: { $exists: true, $type: 2 } }, {}, { sort: { UID: -1 } });
                        if (lastUser && lastUser.UID) {
                            const lastUID = lastUser.UID;
                                const nextNumber = parseInt(lastUID) + 1;
                                return nextNumber.toString();
                        }
                        return '80000001';
                    };
                    
                    const uid = await getNextUID();

                    const uuid = uuidv4();

                    const createdUser = new UserDataModel({
                        // username: firebasePayload.name,
                        // username: firebasePayload.user_id,
                        // email: firebasePayload.user_id + "@gmail.com",
                        // password: newUserData.password,
                        // confirmPassword: newUserData.confirmPassword,
                        imagePath: firebasePayload.picture,
                        displayName: firebasePayload.name,
                        provider: firebasePayload.firebase.sign_in_provider,
                        firebaseId: firebasePayload.user_id,
                        // win: 0,
                        // match: 0,
                        // latestMatch: [],
                        UID: uid,
                        UUID: uuid,
                    });
                    const savedUser = await createdUser.save();
                    const createdMatch = new MatchModel({
                        firebaseId: createdUser.firebaseId,
                        win: 0,
                        match: 0,
                        latestMatch: [],
                    })
                    await createdMatch.save();
                    const token: string = IssueJWTwithEmail(savedUser);
                    const result = {
                        message: 'success',
                        data: {
                            jwt: token,
                            displayName: savedUser.username,
                            UID: savedUser.UID,
                            imagePath: savedUser.imagePath,
                        }
                    }
                    res.json(new LoginWithEmailResponseDTO(result));
                } else {
                    const token: string = IssueJWTwithEmail(user);
                    const result = {
                        message: 'success',
                        data: {
                            jwt: token,
                            displayName: user.username,
                            UID: user.UID,
                            imagePath: user.imagePath,
                        }
                    }
                    res.json(new LoginWithEmailResponseDTO(result));
                }
            } else {
                console.log('Internal Server Error')
                // res.json(new InternalError());
                throw new Error('InternalError')
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            if (typeof firebaseTokenId === 'string') {
                try {
                    console.log('removing user from firebase')
                    await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyBCNyyTwo_RLCHrJD_xNnYHy8G67DDeKbw', {
                        idToken: firebaseTokenId,
                    });
                } catch (deleteError) {
                    console.error('Error deleing user from Firebase', deleteError);
                }
            }
        }
    }

    private async ResetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('ResetPassword: ' + req);
            const jwtPayload: string | JwtPayload | undefined = req.jwt;
            if (jwtPayload && typeof jwtPayload === 'object') {
                const user = await UserDataModel.findOne({
                    firebaseId: jwtPayload.firebaseId,
                });
                if (!user) throw new Error('InvalidCredentialsError');
                const { data: response } = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBCNyyTwo_RLCHrJD_xNnYHy8G67DDeKbw', {
                    requestType: "PASSWORD_RESET",
                    email: user.email,
                })
                const result = {
                    message: 'reset password email was sent',
                    data: {
                        email: user.email,
                    }
                }
                res.json(new ResetPasswordDTO(result))
            } else {
                console.log('Internal Error')
                // return next(new InternalError());
                throw new Error('InternalError')
            }
        } catch (err : any) {
            if (err.message === 'InvalidCredentialsError') {
                console.error(err.message);
                res.status(401).json({ error: 'Invalid login credentials' });
            } else {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }
}