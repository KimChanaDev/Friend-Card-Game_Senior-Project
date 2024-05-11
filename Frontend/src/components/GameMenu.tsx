// src/components/GameMenu.tsx
import React from 'react';
import './GameMenu.css';

interface GameMenuProps {
  onButtonClick: (buttonIndex: number) => void;
  isUserLogin: boolean;
}

const GameMenu: React.FC<GameMenuProps> = ({ onButtonClick,isUserLogin}) => {
  return (
    <div className="game-menu">
      <div className='gamename'>
        <span className="game-name">F R I E N D S</span>
        <span className="game-name-sub">CARD GAME</span>
      </div>
      
      <div className="button-container">
        <button onClick={() => onButtonClick(1)} disabled ={!isUserLogin}>Online Play</button>
        <button onClick={() => onButtonClick(2)}>Play with bot</button>
        <button onClick={() => onButtonClick(3)}>How to play</button>
      </div>
    </div>
  );
};

export default GameMenu;
