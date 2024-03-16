import { TableData, TableHeader } from "../config/table-data";
import "./Custom-table.css";
import { useState } from "react";
import { PageButton, CreateButton, SearchGameID } from "./Custom-table.styled";
import { Header1, Header2 } from "../ModalPopup/ModalPopup.styled";
import JoinGameModal from "../ModalPopup/JoinGameModal";
import CreateGameModal from "../ModalPopup/CreateGameModal";
import React from "react";

import Vfx from "./Vfx";
import { MatchDetail } from "../entities/response";
interface Props {
  headers: TableHeader[];
  data: TableData[];
  onFilterIdChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function CustomTable({ headers, data, onFilterIdChange }: Props) {
  const { playButton } = Vfx();

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
    playButton();
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
    playButton();
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  const handlePrevPage = () => {
    playButton();
    console.log('test')
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

interface HistoryProps {
  data?: MatchDetail[];
}

const HistoryClick = (item: MatchDetail) => {

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
              {item.win ? (
                <div className="result">
                  <img
                    src="/win.png"
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
                    src="/lose.png"
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
