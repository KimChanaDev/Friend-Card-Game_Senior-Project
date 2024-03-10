export enum JwtValidationError
{
	EXPIRED = 'jwt expired',
	OLDJWT = 'old jwt',
	INVALID = 'invalid token',
	UNKNOWN = 'unknown',
}