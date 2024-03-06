import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { JwtPayload } from 'jsonwebtoken';

declare global {
	namespace Express {
		interface Request {
			jwt?: JwtPayload;
			firebase?: string | DecodedIdToken;
			idToken?: string;
		}
	}
}
