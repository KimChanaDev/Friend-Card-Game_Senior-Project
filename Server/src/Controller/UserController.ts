import { Request, Response, NextFunction, RequestHandler } from "express";
import { ValidationMiddleware } from "../Middleware/ValidationMiddleware.js";
import { UserDTO } from "../Model/DTO/UserDTO.js";
import { UserDataDTO } from "../Model/DTO/UserDataDTO.js";
import { ExpressRouter } from "./ExpressRouter.js";
import { UserModel } from "../Model/Entity/UserEntity.js";
import { UserDataModel } from "../Model/Entity/UserData.js";
import { InvalidCredentialsError, UserExistsError } from "../Error/ErrorException.js";
import { GenerateNewSaltAndHash, ValidatePassword } from "../GameLogic/Utils/Authorization/Password.js";
import { IssueJWT } from "../GameLogic/Utils/Authorization/JWT.js";
import { LoginResponseDTO } from "../Model/DTO/Response/LoginResponseDTO.js";
import { UserResponseDTO } from "../Model/DTO/Response/UserResponseDTO.js";
import { FirebaseAuthMiddleware } from "../Middleware/FirebaseAuthMiddleware.js";
import axios from "axios";

export class UserController extends ExpressRouter
{
    public path: string = '/users';
    constructor() {
        super();
        this.InitializeRoutes();
    }
    private async InitializeRoutes(): Promise<void>
    {
        this.router.post('/register', ValidationMiddleware(UserDTO), this.RegisterUser);
		this.router.post('/login', ValidationMiddleware(UserDTO), this.LoginUser);
		this.router.get('/tasks', await FirebaseAuthMiddleware(UserDTO), this.Task);
		// this.router.post('/firebaseRegister', ValidationMiddleware(UserDataDTO),this.firebaseRegister);
    }
    private async RegisterUser(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const newUserData: UserDTO = req.body;
		const user = await UserModel.findOne({ username: newUserData.username });
		if (user) return next(new UserExistsError(newUserData.username));

		const { salt, hash } = GenerateNewSaltAndHash(newUserData.password);
		const createdUser = new UserModel({
			username: newUserData.username,
			hash: hash,
			salt: salt,
		});
		const savedUser = await createdUser.save();
		const token: string = IssueJWT(savedUser);
		res.json(new LoginResponseDTO(UserResponseDTO.CreateFromUserDocument(savedUser), token));
    }
    private async LoginUser(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const newUserData: UserDTO = req.body;
		const user = await UserModel.findOne({
			username: newUserData.username,
		});
		if (!user) return next(new InvalidCredentialsError());
		if (!ValidatePassword(newUserData.password, user.hash, user.salt)) return next(new InvalidCredentialsError());

		const token: string = IssueJWT(user);
		res.json(new LoginResponseDTO(UserResponseDTO.CreateFromUserDocument(user), token));
    }
	private Task(req: Request, res: Response, next: NextFunction): void
	{
		res.json({
			tasks: [
				{title: 'Test1'},
				{title: 'kuyyedheedum'}
			]
		})
	}
	
	// private async firebaseRegister(req: Request, res: Response, next: NextFunction): Promise<void>
	// {
	// 	const newUserData: UserDataDTO = req.body;
	// 	const user = await UserModel.findOne({ username: newUserData.username });
	// 	if (user) return next(new UserExistsError(newUserData.username));

	// 	try {
	// 		const { data: response } = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBCNyyTwo_RLCHrJD_xNnYHy8G67DDeKbw', {
	// 			email: newUserData.email,
	// 			password: newUserData.password,
	// 			returnSecureToken: true,
	// 		})
	// 		console.log('User signed up successfully:', response.data);
	// 		const { salt, hash } = GenerateNewSaltAndHash(newUserData.password);
	// 		const createdUser = new UserModel({
	// 			username: newUserData.username,
	// 			hash: hash,
	// 			salt: salt,
	// 		});
	// 		const savedUser = await createdUser.save();
	// 		const token: string = IssueJWT(savedUser);
	// 		res.json(new LoginResponseDTO(UserResponseDTO.CreateFromUserDocument(savedUser), token));
	// 	} catch (err) {
	// 		console.log(err);
	// 		res.json(err);
	// 	}
	// }
}

