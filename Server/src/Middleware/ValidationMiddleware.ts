import { ClassConstructor, plainToClass } from 'class-transformer';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BadRequestError } from '../Error/ErrorException.js';
import { ValidationError, validate } from 'class-validator';

export function ValidationMiddleware(type: ClassConstructor<object>): RequestHandler {
	return (req: Request, res: Response, next: NextFunction): void => {
		validate(plainToClass(type, req.body)).then((errors: ValidationError[]) => {
			if (errors.length > 0) {
				console.error(`Validation error on ${type.name}: `, errors);
				const errorTypes = ['minLength', 'maxLength', 'matches', 'isString', 'isInt', 'isEnum', 'isEmail'];
				const errorMessages: string[] = [];
				for (const errorType of errorTypes) {
					const errorMessage: string | undefined = errors?.at(0)?.constraints?.[errorType];
					if (errorMessage) {
						errorMessages.push(errorMessage);
					}
				}
				res.status(400).json({error: errorMessages})
			} else {
				next();
			}
		});
	};
}
