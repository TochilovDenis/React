import { useState } from "react";

function Square({ value, onSquareClick }) {
  if (value == null) {
    return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    );
  }
  else if (value == "O") {
    return (
      <button className="square  sqr_win" onClick={onSquareClick}>
        {value}
      </button>
    );
  }
}

function Board({ pl_IsNext, arena, onPlay, move_pl, onChangeMove }) {
  let status = "";
  if (pl_IsNext == "1plO") {
    status = "Ход игрока " + 1;
  }
  if (pl_IsNext == "2plO") {
    status = "Ход игрока " + 2;
  }

  function handleClick(i) {
    /*
    null - пусто поле
      o  - выставлен корабль
      s  - выстрел
      x  - попадание
      c  - убит 
    */
    onPlay("p" + move_pl + "O", i);
  }

  return (
    <>
      <div className="status">{status}</div>
      {[...Array(10)].map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {[...Array(10)].map((_, colIndex) => {
            const index = rowIndex * 10 + colIndex;
            let winner_fl = false;
            // if (lines_w != null) {
            //   winner_fl = lines_w.some((elem_w) => elem_w === index);
            // }

            return (
              <Square
                key={index}
                value={arena[index]}
                onSquareClick={() => handleClick(index)}

              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [arena_pl1, setArena_pl1] = useState(Array(100).fill(null))
  const [arena_pl2, setArena_pl2] = useState(Array(100).fill(null))

  const [pl_IsNext, setPlIsNext] = useState("1plO");

  function changeMove(value) {
    setMove_pl(value);
  }

  function handlePlay(move_pl, field) {
    if (move_pl == "p1O") {
      const nextArena = arena_pl1.slice();
      nextArena[field] = "O";
      setArena_pl1(nextArena)
    }
    else if (move_pl == "p2O") {
      const nextArena = arena_pl2.slice();
      nextArena[field] = "O";
      setArena_pl2(nextArena)
    }
  }

  return (
    <div className="game">
      <div key="arena_pl1" className="game-board">
        <Board pl_IsNext={pl_IsNext} arena={arena_pl1} onPlay={handlePlay} move_pl={"1"} />
      </div>
      <div key="arena_pl2" className="game-board">
        <Board pl_IsNext={pl_IsNext} arena={arena_pl2} onPlay={handlePlay} move_pl={"2"} />
      </div>
      <div className="game-info">
        <table>
          <thead>
            <tr>
              <th scope="col">index</th>
              <th scope="col">player</th>
              <th scope="col">jump_to</th>
            </tr>
          </thead>
          {/* <tbody>{moves}</tbody> */}
        </table>
      </div>
    </div>
  );
}