export interface LoginApiResponse {
    response: {
      message: string;
      data: Userdata;
    };
}
export interface Userdata {
    jwt: string;
    displayName: string;
    UID: string;
    imagePath: string;
    isLogIn: boolean
}



