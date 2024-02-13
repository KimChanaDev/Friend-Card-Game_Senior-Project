import { TableData, TableHeader } from "../config/table-data";
import "./Custom-table.css";
import { useState } from "react";
import { PageButton, CreateButton, SearchGameID } from "./Custom-table.styled";
import { Header1, Header2 } from "../ModalPopup/ModalPopup.styled";
import JoinGameModal from "../ModalPopup/JoinGameModal";
import CreateGameModal from "../ModalPopup/CreateGameModal";
import React from "react";

interface Props {
  headers: TableHeader[];
  data: TableData[];
  onFilterIdChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function CustomTable({ headers, data, onFilterIdChange }: Props) {
  const [selectGame, setSelectGame] = React.useState<TableData>(); 
  const [isJoinVisible, setIsJoinVisible] = useState<boolean>(false);
  const [isCreateVisible, setIsCreateVisible] = useState<boolean>(false);
  const handleClick = (item: TableData) => {
    console.log(item);
    setSelectGame(item)
    setIsCreateVisible(false)
    setIsJoinVisible(true)
  };
  const onBackdropClick = () => {
    setIsCreateVisible(false)
    setIsJoinVisible(false)
  };
  const createButtonClick =() =>{
    setIsJoinVisible(false)
    setIsCreateVisible(true)
  }

  const cellsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / cellsPerPage);

  function renderHeader(headers: TableHeader[]) {
    return (
      <tr>
        {headers.map((header) => (
          <th key={header.id}>{header.title}</th>
        ))}
      </tr>
    );
  }
  function renderTableData(data: TableData[]) {
    return data.map((item, rowIndex) => (
      <tr
        onClick={() => handleClick(item)}
        key={rowIndex}
        className="table-cell"
      >
        <td>{item["id"]}</td>
        {item["numPlayersInGame"] < 4 ? (
          <td>
            {item["numPlayersInGame"]}/{item["maxPlayers"]}
          </td>
        ) : (
          <td> Full </td>
        )}
        {/* <td >{item["numPlayersInGame"]}/{item["maxPlayers"]}</td> */}
        <td>{item["owner"]["username"]}</td>
        <td>{item["roomName"]}</td>
      </tr>
    ));
  }
  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const startIndex = (currentPage - 1) * cellsPerPage;
  const endIndex = startIndex + cellsPerPage;
  const currentPageData = data.slice(startIndex, endIndex);
  return (
    <div>
      <div className="table-header">
        <div className="header-text">
          <Header1> Lobby </Header1>
          <Header2> List </Header2>
        </div>
        <div className="search_box">
          <form action="">
            <SearchGameID
              type="text"
              placeholder="Search MatchID..."
              name="search"
              onChange={onFilterIdChange}
            />
          </form>
        </div>
      </div>
      <table className="custom-table">
        <thead>{renderHeader(headers)}</thead>
        <tbody>{renderTableData(currentPageData)}</tbody>
      </table>
      <div className="table-footer">
        <div className="create-footer">
          <CreateButton onClick={createButtonClick}>Create</CreateButton>
        </div>
        <div className="page-footer">
          <PageButton onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </PageButton>

          <span>
            {" "}
            {totalPages == 0 ? (
                <div>{currentPage} / 1{" "}</div>
              ) : (
                <div>{currentPage} / {totalPages}{" "}</div>
              )}
            
          </span>
          <PageButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </PageButton>
        </div>
      </div>
      <JoinGameModal
        onBackdropClick={onBackdropClick}
        isModalVisible={isJoinVisible}
        matchData={selectGame}
      />
      <CreateGameModal
        onBackdropClick={onBackdropClick}
        isModalVisible={isCreateVisible}
      />
    </div>
  );
}

interface MatchData {
  id: string;
  score: number;
  place: number;
}

interface HistoryProps {
  data?: MatchData[];
}

const HistoryClick = (item: MatchData) => {
  alert(item.id);
};

const HistoryComponent: React.FC<HistoryProps> = ({ data = [] }) => {
  const recentData = data.slice().reverse().slice(0, 5);
  return (
    <table>
      <tbody>
        {recentData.map((item, index) => (
          <tr
            key={index}
            onClick={() => HistoryClick(item)}
            className="recentMatchButton"
          >
            {/* <td>ID = {item.id} Score = {item.score} Place = {item.place}</td> */}
            <td>
              {item.place < 3 ? (
                <div className="result">
                  <img
                    src="https://cdn.discordapp.com/attachments/406860361086795776/1201933444335018134/697f9062398a775a1b22a0bc75e8c8fd.png?ex=65cb9ebf&is=65b929bf&hm=044264e317a334a28a2a170f3ed1a7cc5ea0eb7ba83d4817f12aff0105bce25a&"
                    alt="Win"
                  />
                  <div className="match-detail">
                    <span className="match-id">Match ID : {item.id}</span>
                    <span className="match-score">Score : {item.score}</span>
                  </div>
                </div>
              ) : (
                <div className="result">
                  <img
                    src="https://cdn.discordapp.com/attachments/406860361086795776/1201967953512239114/0fb0ad7b7850d3feac6c89d18f3b7718.png?ex=65cbbee3&is=65b949e3&hm=0a6dcb8c1c2a6e7832ec3d360877d0b7872675ed8161054bebcee39b22511929&"
                    alt="Lose"
                  />
                  <div className="match-detail">
                    <span className="match-id">Match ID : {item.id}</span>
                    <span className="match-score">Score : {item.score}</span>
                  </div>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { CustomTable, HistoryComponent };
