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
            // return next(new InternalError());
            return next(new UnauthorizedError());
        }
    }
}