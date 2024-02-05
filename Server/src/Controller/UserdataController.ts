import { Request, Response, NextFunction, RequestHandler } from "express";
import { ValidationMiddleware } from "../Middleware/ValidationMiddleware.js";
import { LoginDTO, ProfileDTO, UserDataDTO } from "../Model/DTO/UserDataDTO.js";
import { ExpressRouter } from "./ExpressRouter.js";
import { UserDataModel } from "../Model/Entity/UserData.js";
import { InvalidCredentialsError, PasswordMismatchError, UserExistsError, InternalError, ResourceNotFoundError } from "../Error/ErrorException.js";
import { GenerateNewSaltAndHash, ValidatePassword } from "../GameLogic/Utils/Authorization/Password.js";
import { IssueJWTwithEmail, ValidateJWT } from "../GameLogic/Utils/Authorization/JWT.js";
import { HistoryResponseDTO, LoginWithEmailResponseDTO, ProfileResponseDTO } from "../Model/DTO/Response/LoginWithEmailResponseDTO.js";
import { FirebaseAuthMiddleware, newFirebaseAuthMiddleware } from "../Middleware/FirebaseAuthMiddleware.js";
import axios, { AxiosError } from "axios";
import { IsEmail, isEmail } from "class-validator";
import { JwtAuthMiddleware } from "../Middleware/JwtAuthMiddleware.js";
import { JwtPayload } from "jsonwebtoken";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier.js";
import { MatchModel } from "../Model/Entity/MatchData.js";

export class UserdataController extends ExpressRouter {
    public path: string = '/userdata';
    constructor() {
        super();
        this.InitializeRoutes();
    }
    private async InitializeRoutes(): Promise<void> {
        this.router.post('/register', ValidationMiddleware(UserDataDTO), this.RegisterUser);
        this.router.post('/login', ValidationMiddleware(LoginDTO), this.LoginUser);
        this.router.get('/profile', JwtAuthMiddleware, this.Profile);
        this.router.get('/history', JwtAuthMiddleware, this.History);
        this.router.post('/firebase-auth', newFirebaseAuthMiddleware, this.FirebaseAuth);
    }
    private async RegisterUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const newUserData: UserDataDTO = req.body;
            if (newUserData.password !== newUserData.confirmPassword) {
                return next(new PasswordMismatchError());
            }
            const user = await UserDataModel.findOne({ username: newUserData.username });
            if (user) return next(new UserExistsError(newUserData.username));

            const { data: response } = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBCNyyTwo_RLCHrJD_xNnYHy8G67DDeKbw', {
                email: newUserData.email,
                password: newUserData.password,
                returnSecureToken: true,
            })

            const jsonRes = JSON.parse(Buffer.from(response.idToken.split('.')[1], 'base64').toString());

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
                win: 0,
                match: 0,
                lastestMatch: [
                    // {
                    //     matchId: 11,
                    //     score: 999,
                    // },
                    // {
                    //     matchId: 22,
                    //     score: 888,
                    // },
                    // {
                    //     matchId: 33,
                    //     score: 777,
                    // },
                    // {
                    //     matchId: 44,
                    //     score: 666,
                    // },
                    // {
                    //     matchId: 55,
                    //     score: 555,
                    // },
                    // {
                    //     matchId: 66,
                    //     score: 444,
                    // },
                ],
                // uid: 
            });
            const savedUser = await createdUser.save();
            const createdMatch = new MatchModel({
                firebaseId: createdUser.firebaseId,
                win: 0,
                match: 0,
                lastestMatch: [],
            })
            await createdMatch.save();
            const token: string = IssueJWTwithEmail(savedUser);
            // console.log(savedUser)
            const result = {
                message: 'success',
                data: {
                    jwt: token,
                    displayName: savedUser.username,
                    UID: savedUser.id,
                    imagePath: savedUser.imagePath,
                }
            }
            res.json(new LoginWithEmailResponseDTO(result))
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError;
                res.status(400).json(axiosError.message);
            } else {
                res.json(err);
            }
        }
    }
    private async LoginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const newUserData: LoginDTO = req.body;
            if (!isEmail(newUserData.username)) {
                const user = await UserDataModel.findOne({
                    $and: [
                        { username: newUserData.username },
                        { provider: "password" }
                    ]
                });
                if (!user) return next(new InvalidCredentialsError());
                const { data: response } = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBCNyyTwo_RLCHrJD_xNnYHy8G67DDeKbw', {
                    email: user.email,
                    password: newUserData.password,
                    returnSecureToken: true,
                })
                const token: string = IssueJWTwithEmail(user);
                const result = {
                    message: 'success',
                    data: {
                        jwt: token,
                        displayName: user.displayName,
                        UID: user.id,
                        imagePath: user.imagePath,
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
                if (!user) return next(new InvalidCredentialsError());
                const token: string = IssueJWTwithEmail(user);
                const result = {
                    message: 'success',
                    data: {
                        jwt: token,
                        displayName: user.displayName,
                        UID: user.id,
                        imagePath: user.imagePath,
                    }
                }
                res.json(new LoginWithEmailResponseDTO(result))
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError;
                res.status(400).json(axiosError.message);
            } else {
                res.json(err);
            }
        }
    }
    private async Profile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const jwtPayload: string | JwtPayload | undefined = req.jwt;
            if (jwtPayload && typeof jwtPayload === 'object') {
                const user = await UserDataModel.findOne({
                    firebaseId: jwtPayload.firebaseId,
                });
                if (!user) return next(new InvalidCredentialsError());
                const result = {
                    message: 'success',
                    data: {
                        displayName: user.displayName,
                            UID: user.id,
                        imagePath: user.imagePath,
                    }
                }
                res.json(new ProfileResponseDTO(result))
            } else {
                return next(new InternalError());
            }
        } catch (err) {
            res.json(err)
        }
    }
    private async History(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const jwtPayload: string | JwtPayload | undefined = req.jwt;
            if (jwtPayload && typeof jwtPayload === 'object') {
                const matches = await MatchModel.findOne(
                    {
                        firebaseId: jwtPayload.firebaseId,
                    },
                    {
                        lastestMatch: { $slice: -5 }
                    }
                );
                if (!matches) return next(new InternalError());
                const result = {
                    message: 'success',
                    data: {
                        win: matches.win,
                        match: matches.match,
                        lastestMatch: matches.lastestMatch,
                    }
                }
                res.json(new HistoryResponseDTO(result))
            } else {
                return next(new InternalError());
            }
        } catch (err) {
            res.json(err)
        }
    }
    // this method take idToken that you will get from login though firebase and return friendJWT
    private async FirebaseAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const firebasePayload: string | DecodedIdToken | undefined = req.firebase
            if (firebasePayload && typeof firebasePayload === 'object') {
                const user = await UserDataModel.findOne({
                    firebaseId: firebasePayload.user_id
                })
                if (!user) {
                    // console.log(firebasePayload)
                    // res.json(firebasePayload)
                    const createdUser = new UserDataModel({
                        username: firebasePayload.name,
                        email: "noemail@gmail.com",
                        // password: newUserData.password,
                        // confirmPassword: newUserData.confirmPassword,
                        imagePath: firebasePayload.picture,
                        displayName: firebasePayload.name,
                        provider: firebasePayload.firebase.firebase.sign_in_provider,
                        firebaseId: firebasePayload.user_id,
                        win: 0,
                        match: 0,
                        lastestMatch: [],
                        // uid: 
                    });
                    const savedUser = await createdUser.save();
                    const token: string = IssueJWTwithEmail(savedUser);
                    const result = {
                        message: 'success',
                        data: {
                            jwt: token,
                            displayName: savedUser.username,
                            UID: savedUser.id,
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
                            UID: user.id,
                            imagePath: user.imagePath,
                        }
                    }
                    res.json(new LoginWithEmailResponseDTO(result));
                }
            } else {
                res.json(new InternalError());
            }
        } catch (err) {
            res.json(err)
        }
    }
}