// import admin from '../Configuration/firebase-config'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { UnauthorizedError, InternalError } from '../Error/ErrorException.js'
import { ClassConstructor } from 'class-transformer'
import admin from 'firebase-admin'

export async function FirebaseAuthMiddleware(type: ClassConstructor<object>): Promise<RequestHandler> {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (!req.headers.authorization) return next(new UnauthorizedError())
        const token = req.headers.authorization.split(' ')[1]

        try {
            const decodeValue = await admin.auth().verifyIdToken(token)
            if (decodeValue) {
                console.log(decodeValue)
                return next()
            }

        } catch (e) {
            console.log(e)
            return next(new UnauthorizedError());
        }
    }
}

export async function newFirebaseAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    // if (!req.headers.authorization) return next(new UnauthorizedError());
    if (!req.headers.authorization) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
    }
    const token = req.headers.authorization
    try {
        const decodeValue = await admin.auth().verifyIdToken(token)
        if (decodeValue) {
            req.firebase = decodeValue
            return next();
        }
        // return next(new UnauthorizedError());
        res.status(401).json({ error: 'Unauthorized.' });
    } catch (e) {
        console.log(e)
        // return next(e);
        return next('failed to verify IdToken')
    }
}