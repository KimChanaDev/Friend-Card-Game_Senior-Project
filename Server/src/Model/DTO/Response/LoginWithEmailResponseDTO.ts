export class LoginWithEmailResponseDTO {
	constructor(
        private response: {
            message: string,
            data: {
                jwt: string,
                displayName: string,
                UID: string,
                imagePath: string
            }
        }
    ) {}
}

export class ProfileResponseDTO {
    constructor(
        private response: {
            message: string,
            data: {
                displayName: string | undefined,
                imagePath: string| undefined,
                UID: string| undefined
            }
        }
    ) {}
}

export class HistoryResponseDTO {
    constructor(
        private response: {
            message: string,
            data: {
                win: number,
                match: number,
                lastestMatch: object[]
            }
        }
    ) {}
}