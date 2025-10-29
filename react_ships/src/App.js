import React, { useState, useEffect } from 'react';
import './styles.css';

const BOARD_SIZE = 10;
const SHIPS = [
  { name: '4-палубный', size: 4, count: 1 },
  { name: '3-палубный', size: 3, count: 2 },
  { name: '2-палубный', size: 2, count: 3 },
  { name: '1-палубный', size: 1, count: 4 }
];

const createEmptyBoard = () => 
  Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));

const canPlaceShip = (board, ship, row, col, isHorizontal) => {
  for (let i = 0; i < ship.size; i++) {
    const r = isHorizontal ? row : row + i;
    const c = isHorizontal ? col + i : col;
    
    if (r >= BOARD_SIZE || c >= BOARD_SIZE) return false;
    if (board[r][c] !== 0) return false;
    
    // Проверка соседних клеток
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && 
            board[nr][nc] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
};

const placeShip = (board, ship, row, col, isHorizontal) => {
  const newBoard = board.map(row => [...row]);
  for (let i = 0; i < ship.size; i++) {
    const r = isHorizontal ? row : row + i;
    const c = isHorizontal ? col + i : col;
    newBoard[r][c] = ship.size;
  }
  return newBoard;
};

const generateComputerBoard = () => {
  let board = createEmptyBoard();
  const ships = [...SHIPS];
  
  ships.forEach(shipType => {
    for (let count = 0; count < shipType.count; count++) {
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        const isHorizontal = Math.random() > 0.5;
        
        if (canPlaceShip(board, { size: shipType.size }, row, col, isHorizontal)) {
          board = placeShip(board, { size: shipType.size }, row, col, isHorizontal);
          placed = true;
        }
      }
    }
  });
  
  return board;
};

const App = () => {
  const [playerBoard, setPlayerBoard] = useState(createEmptyBoard());
  const [computerBoard, setComputerBoard] = useState(generateComputerBoard());
  const [computerShots, setComputerShots] = useState(createEmptyBoard());
  const [gameState, setGameState] = useState('placing'); // placing, playing, gameOver
  const [currentShip, setCurrentShip] = useState(0);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [message, setMessage] = useState('Расставьте ваши корабли');
  const [playerShips, setPlayerShips] = useState([]);

  // Инициализация расстановки кораблей игрока
  useEffect(() => {
    if (gameState === 'placing') {
      const shipsList = [];
      SHIPS.forEach(shipType => {
        for (let i = 0; i < shipType.count; i++) {
          shipsList.push({ ...shipType, id: shipsList.length });
        }
      });
      setPlayerShips(shipsList);
    }
  }, [gameState]);

  const handlePlayerBoardClick = (row, col) => {
    if (gameState !== 'placing' || currentShip >= playerShips.length) return;

    const ship = playerShips[currentShip];
    
    if (canPlaceShip(playerBoard, ship, row, col, isHorizontal)) {
      const newBoard = placeShip(playerBoard, ship, row, col, isHorizontal);
      setPlayerBoard(newBoard);
      
      if (currentShip + 1 >= playerShips.length) {
        setGameState('playing');
        setMessage('Игра началась! Ваш ход');
      } else {
        setCurrentShip(currentShip + 1);
        setMessage(`Разместите ${playerShips[currentShip + 1].name} корабль`);
      }
    } else {
      setMessage('Невозможно разместить корабль здесь');
    }
  };

  const handleComputerBoardClick = (row, col) => {
    if (gameState !== 'playing' || computerShots[row][col] !== 0) return;

    const newShots = [...computerShots];
    const isHit = computerBoard[row][col] !== 0;
    
    newShots[row][col] = isHit ? 2 : 1; // 2 - попадание, 1 - промах
    setComputerShots(newShots);

    if (isHit) {
      setMessage('Попадание!');
      
      // Проверка победы игрока
      if (checkWin(newShots,
Board)) {
        setMessage('Вы победили!');
        setGameState('gameOver');
        return;
      }
    } else {
      setMessage('Промах! Ход компьютера');
      setTimeout(computerTurn, 1000);
    }
  };

  const computerTurn = () => {
    let row, col;
    do {
      row = Math.floor(Math.random() * BOARD_SIZE);
      col = Math.floor(Math.random() * BOARD_SIZE);
    } while (playerBoard[row][col] === 1 || playerBoard[row][col] === 2);

    const newPlayerBoard = playerBoard.map(r => [...r]);
    const isHit = newPlayerBoard[row][col] !== 0;
    
    newPlayerBoard[row][col] = isHit ? 2 : 1;
    setPlayerBoard(newPlayerBoard);

    if (isHit) {
      setMessage('Компьютер попал!');
      
      // Проверка победы компьютера
      if (checkWin(newPlayerBoard, playerBoard.map(row => row.map(cell => 
        cell === 1 ? 0 : cell === 2 ? 0 : cell)))) {
        setMessage('Компьютер победил!');
        setGameState('gameOver');
      } else {
        setTimeout(computerTurn, 1000);
      }
    } else {
      setMessage('Компьютер промахнулся! Ваш ход');
    }
  };

  const checkWin = (shots, board) => {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] !== 0 && shots[r][c] !== 2) {
          return false;
        }
      }
    }
    return true;
  };

  const resetGame = () => {
    setPlayerBoard(createEmptyBoard());
    setComputerBoard(generateComputerBoard());
    setComputerShots(createEmptyBoard());
    setGameState('placing');
    setCurrentShip(0);
    setIsHorizontal(true);
    setMessage('Расставьте ваши корабли');
  };

  const renderBoard = (board, shots, onClick, showShips = false) => {
    return (
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => {
              let className = 'cell';
              const shot = shots ? shots[rowIndex][colIndex] : 0;
              
              if (shot === 2) {
                className += ' hit';
              } else if (shot === 1) {
                className += ' miss';
              } else if (showShips && cell !== 0) {
                className += ' ship';
              }
              
              return (
                <div
                  key={colIndex}
                  className={className}
                  onClick={() => onClick(rowIndex, colIndex)}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app">
      <h1>Морской бой</h1>
      
      <div className="game-info">
        <p>{message}</p>
        {gameState === 'placing' && playerShips[currentShip] && (
          <div>
            <p>Текущий корабль: {playerShips[currentShip].name}</p>
            <button onClick={() => setIsHorizontal(!isHorizontal)}>
              Направление: {isHorizontal ? 'Горизонтальное' : 'Вертикальное'}
            </button>
          </div>
        )}
      </div>

      <div className="boards-container">
        <div className="board-section">
          <h2>Ваше поле</h2>
          {renderBoard(playerBoard, null, handlePlayerBoardClick, true)}
        </div>
        
        <div className="board-section">
          <h2>Поле противника</h2>
          {renderBoard(computerBoard, computerShots, handleComputerBoardClick)}
        </div>
      </div>

      {(gameState === 'gameOver' || gameState === 'placing') && (
        <button className="reset-button" onClick={resetGame}>
          {gameState === 'gameOver' ? 'Новая игра' : 'Перезапуск'}
        </button>
      )}
    </div>
  );
};

export default App;