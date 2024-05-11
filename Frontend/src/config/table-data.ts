export interface TableHeader {
  id: string;
  title: string;
  attribute: string;
}

export type TableData = {
  gameType: string;
  owner: {
    id: string;
    username: string;
  };
  maxPlayers: number;
  roomName: string;
  isPasswordProtected: boolean;
  id: string;
  numPlayersInGame: number;
};

export const lobbyTableHeaders: TableHeader[] = [
  {
    id: "1",
    title: "MatchID",
    attribute: "id",
  },
  {
    id: "2",
    title: "Status",
    attribute: "status",
  },
  {
    id: "3",
    title: "Owner",
    attribute: "owner",
  },
  {
    id: "4",
    title: "Lobby Name",
    attribute: "roomName",
  },
];
