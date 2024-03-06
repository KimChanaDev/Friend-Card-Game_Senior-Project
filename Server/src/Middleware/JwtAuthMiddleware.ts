import { NextFunction, Request, Response } from 'express';
import { SessionExpiredError, UnauthorizedError } from '../Error/ErrorException.js';
import { IJwtValidation, ValidateJWT } from '../GameLogic/Utils/Authorization/JWT.js';
import { JwtValidationError } from '../Enum/JwtValidationError.js';
import { UserDataModel } from '../Model/Entity/UserData.js';

export async function JwtAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>
{
	if (!req.headers.authorization) return next(new UnauthorizedError());
	const validationResult: IJwtValidation = ValidateJWT(req.headers.authorization);
	const user = await UserDataModel.findOne({
		$and: [
			{ firebaseId: validationResult.payload?.firebaseId },
			{ UUID: validationResult.payload?.UUID }
		]
	});
	// console.log("firebaseID: " + validationResult.payload?.firebaseId)
	// console.log("UUID: " + validationResult.payload?.UUID)
	// console.log("User: " + user)
	if (validationResult.success && user) {
		req.jwt = validationResult.payload;
		return next();
	} else if (validationResult.error === JwtValidationError.EXPIRED) {
		console.log(validationResult.error);
		// return next(new SessionExpiredError());
		res.status(401).json({ error: 'Session expired.' });
	} else {
		// return next(new UnauthorizedError());
		res.status(401).json({ error: 'Unauthorized.' });
	}
}
