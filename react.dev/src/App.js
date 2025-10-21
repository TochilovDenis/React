import { useState } from "react";

function Square({ value, onSquareClick, winner }) {
  if (winner) {
    return (
      <button className="square sqr_win" onClick={onSquareClick}>
        {value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    );
  }
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    }
    else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const [winner, lines_w] = calculateWinner(squares);
  console.log(winner, lines_w);
  let status;
  if (winner) {
    status = "Победа: " + winner;
  } else {
    status = "Следующий игрок: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {[...Array(3)].map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {[...Array(3)].map((_, colIndex) => {
            const index = rowIndex * 3 + colIndex;
            let winner_fl = false;
            if (lines_w != null) {
              winner_fl = lines_w.some((elem_w) => elem_w === index);
            }
            return (
              < Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} winner={winner_fl} />
            );
          })}
        </div>
      ))}
    </>
  );
}


export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];


  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }


  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;

    let step_index = null;
    if (move != 0) {
      for (let y = 0; y < squares.length; y++) {
        if (history[move][y] != history[move - 1][y]) {
          step_index = y;
        }
      }
    }

    if (move > 0) {
      description = 'Ваш ход #' + move;
    } else {
      description = 'Начать игру';
    }
    return (
      <tr key={move}>
        <td>{step_index}</td>
        <td>{squares[step_index]}</td>
        <td><button onClick={() => jumpTo(move)}>{description}</button></td>
      </tr>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <table>
          <thead>
            <tr>
              <th scope="col">index</th>
              <th scope="col">player</th>
              <th scope="col">jumpTo</th>
            </tr>
          </thead>
          <tbody>{moves}</tbody>
        </table>
      </div>
    </div>
  );
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log({ winner: squares[a], lines: lines });
      return [squares[a], lines[i]];
    }
  }
  if (!squares.some((element) => element === null)) {
    return ["Ничья", null];
  }
  return [null, null];
}