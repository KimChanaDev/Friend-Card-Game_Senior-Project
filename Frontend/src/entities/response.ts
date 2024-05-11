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

export interface HistoryApiResponse {
response: {
  message: string;
  data: History;
};
}

export interface History {
win: number;
match: number;
latestMatch: MatchDetail[];
}
export interface MatchDetail {
id: string;
score: number;
place: number;
win: boolean;
}


