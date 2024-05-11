import { NextFunction, Request, Response } from 'express';
import { SessionExpiredError, UnauthorizedError } from '../Error/ErrorException.js';
import { IJwtValidation, ValidateJWT } from '../GameLogic/Utils/Authorization/JWT.js';
import { JwtValidationError } from '../Enum/JwtValidationError.js';
import { UserDataModel } from '../Model/Entity/UserData.js';

export async function JwtAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>
{
	if (!req.headers.authorization) return next(new UnauthorizedError());
	const validationResult: IJwtValidation = await ValidateJWT(req.headers.authorization);
	if (validationResult.success) {
		req.jwt = validationResult.payload;
		return next();
	} else if (validationResult.error === JwtValidationError.EXPIRED) {
		console.log(validationResult.error);
		res.status(401).json({ error: 'Session expired.' });
	} else {
		res.status(401).json({ error: 'Unauthorized.' });
	}
}
