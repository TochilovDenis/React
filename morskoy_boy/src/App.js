import { useState } from "react";

function Square({ value, status, index, onSquareClick }) {
  if (value == "B") {
    return (
      <button className="square sqr_mozhno" onClick={onSquareClick}>
        {index}
      </button>
    );
  } else if (value == "Z") {
    return (
      <button className="square sqr_zan" onClick={onSquareClick}>
        {index}
      </button>
    );
  } else if (value == "Y") {
    return (
      <button className="square" onClick={onSquareClick}>
        {index}
      </button>
    );
  } else if (value == "X") {
    return (
      <button className="square sqr_hit" onClick={onSquareClick}>
        {index}
      </button>
    );
  } else if (value == "M") {
    return (
      <button className="square sqr_miss" onClick={onSquareClick}>
        {index}
      </button>
    );
  } else if (value == "C") {
    return (
      <button className="square sqr_kill" onClick={onSquareClick}>
        {index}
      </button>
    );
  } else if (value == null || status == 2) {
    return (
      <button className="square" onClick={onSquareClick}>
        {index}
      </button>
    );
  } else if (value == "O") {
    return (
      <button className="square  sqr_place" onClick={onSquareClick}>
        {index}
      </button>
    );
  }
}

function Board({ pl_IsNext, arena, onPlay, name }) {
  // console.log(arena);

  let status = "";
  let status_area = 1;

  if (pl_IsNext.indexOf("p1") >= 0) {
    status = "Ход игрока " + 1;
  }
  if (pl_IsNext.indexOf("p2") >= 0) {
    status = "Ход игрока " + 2;
  }

  //p1_S/p2_S
  if (pl_IsNext.indexOf("S") >= 0) {
    status_area = 2;
  }

  function handleClick(i) {
    onPlay(pl_IsNext, i);
  }

  return (
    <>
      <div className="status">{status}</div>
      {[...Array(10)].map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {[...Array(10)].map((_, colIndex) => {
            const index = rowIndex * 10 + colIndex;
            let winner_fl = false;
            return (
              <Square
                key={index}
                value={arena[index]}
                status={status_area}
                index={index}
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
  //Поля игроков
  // null - пустое поле
  // O  -    Выставлен корабль
  // M  -    Промах
  // X  -    Попадание
  // C  -    Убит
  const [arena_pl1, setArena_pl1] = useState(Array(100).fill("Y"));
  const [arena_pl2, setArena_pl2] = useState(Array(100).fill("Y"));
  const [zan, setzan] = useState(Array(100).fill("Y"));

  // Состояние игры/Статус игры
  // состояния pl_IsNext
  //1. 1 игрок выставляет корабли  -- p1_O
  //1.1 переход хода 2 игроку
  //2. 2 игрок выставляет корабли  -- p2_O
  //2.1 переход хода 1 игроку
  //3. стреляет 1 игрок  -- p1_S
  //4. поподание 1 игрок ->3  -- p1_X
  //5. промах 1 игрок ->6    -- p1_M
  //6. стреляет 2 игрок    -- p2_S
  //7. поподание 2 игрок ->6 -- p2_X
  //8. промах 2 игрок ->3   -- p2_M
  const [pl_IsNext, setPlIsNext] = useState("p1_O");
  let description = "передать ход 2 игроку";

  function handlePlay(move, field) {
    // arena[i] = "O";

    if (move == "p1_O") {
      const arena_pl = arena_pl1.slice();
      if (arena_pl[field] != "Z") {
        if (arena_pl[field] == "O") {
          arena_pl[field] = null;
        } else {
          arena_pl[field] = "O";
        }
        setzan(check_arena(arena_pl)[0]);
        setArena_pl1(check_arena(arena_pl)[0]);
      }
    } else if (move == "p2_O") {
      const arena_pl = arena_pl2.slice();
      if (arena_pl[field] != "N")
        if (arena_pl[field] == "O") {
          arena_pl[field] = null;
        } else {
          arena_pl[field] = "O";
        }
      console.log(check_arena(arena_pl));
      setArena_pl2(arena_pl);
    } else if (move == "p2_S") {
      const arena_pl = arena_pl2.slice();
      if (arena_pl[field] == "O") {
        arena_pl[field] = "X";
      } else {
        setPlIsNext("p1_S");
        arena_pl[field] = "M";
      }
      setArena_pl2(arena_pl);
    } else if (move == "p1_S") {
      const arena_pl = arena_pl1.slice();
      if (arena_pl[field] == "O") {
        arena_pl[field] = "X";
      } else {
        arena_pl[field] = "M";
        setPlIsNext("p2_S");
      }
      setArena_pl1(arena_pl);
    }
  }

  function jumpTo() {
    if (pl_IsNext == "p1_O") {
      description = "передать ход 2 игроку";
      setPlIsNext("p2_O");
    }
    if (pl_IsNext == "p2_O") {
      description = "передать ход 1 игроку";
      setPlIsNext("p1_S");
      const arena_pl = arena_pl1.slice();
      setArena_pl1(arena_pl2);
      setArena_pl2(arena_pl);
    }
  }
  // if (pl_IsNext.indexOf("S") >= 0) {
  //   return (
  //     <div className="game">
  //       <div className="game-board">
  //         <Board pl_IsNext={pl_IsNext} arena={arena_pl1} onPlay={handlePlay} />
  //       </div>
  //       <button onClick={jumpTo}>{description}</button>
  //       <div className="game-board">
  //         <Board pl_IsNext={pl_IsNext} arena={arena_pl2} onPlay={handlePlay} />
  //       </div>
  //       <button onClick={jumpTo}>{description}</button>
  //     </div>
  //   );
  // } else
  if (pl_IsNext.indexOf("p1") >= 0) {
    return (
      <div className="game">
        <div className="game-board">
          <Board pl_IsNext={pl_IsNext} arena={arena_pl1} onPlay={handlePlay} />
          <Board pl_IsNext={pl_IsNext} arena={zan} onPlay={handlePlay} />
        </div>
        <button onClick={jumpTo}>{description}</button>
      </div>
    );
  } else {
    return (
      <div className="game">
        <div className="game-board">
          <Board pl_IsNext={pl_IsNext} arena={arena_pl2} onPlay={handlePlay} />
        </div>
        <button onClick={jumpTo}>{description}</button>
      </div>
    );
  }
}

function check_arena(arena) {
  let zan = Array(100).fill("Y");
  let battleship = 1;
  let cruisers = 2;
  let destroyers = 3;
  let boats = 4;
  let num = 0;

  for (let i = 0; i < 100; i++) {
    num = 0;
    if (zan[i] != "O" && arena[i] == "O") {
      get_cr(i);
      if (num == 4) {
        battleship--;
      }
      if (num == 3) {
        cruisers--;
      }
      if (num == 2) {
        destroyers--;
      }
      if (num == 1) {
        boats--;
      }
    }
  }
  console.log(zan);
  return [zan, battleship, cruisers, destroyers, boats];

  function get_cr(index) {
    num++;
    zan[index] = "O";

    if (index + 10 < 100)
      if (arena[index + 10] == "O") {
        get_cr(index + 10);
      }

    if (index + 1 < 100)
      if (arena[index + 1] == "O") {
        get_cr(index + 1);
      }
  
    if (num != 4) {
      zapret_angl(index);
    } else {
      zapret_vse(index);
    }
  }

  function zapret_angl(index) {
    add_z(index - 11);
    add_z(index - 9);
    add_z(index + 9);
    add_z(index + 11);
    // if (index - 11 >= 0 ) zan[index - 11] = "Z";
    // if (index - 10 >= 0) zan[index - 10] = "Z";
    // if (index - 9 >= 0) zan[index - 9] = "Z";
    // if (index - 1 >= 0) zan[index - 1] = "Z";
    // if (index + 1 < 100) zan[index + 1] = "Z";
    // if (index + 9 < 100) zan[index + 9] = "Z";
    // if (index + 10 < 100) zan[index + 10] = "Z";
    // if (index + 11 < 100) zan[index + 11] = "Z";
  }
  function zapret_vse(index) {
    add_z(index - 11);
    add_z(index - 10);
    add_z(index - 9);
    add_z(index - 1);
    add_z(index + 1);
    add_z(index + 9);
    add_z(index + 10);
    add_z(index + 11);
    // if (index - 11 >= 0) zan[index - 11] = "Z";
    // if (index - 10 >= 0) zan[index - 10] = "Z";
    // if (index - 9 >= 0) zan[index - 9] = "Z";
    // if (index - 1 >= 0) zan[index - 1] = "Z";
    // if (index + 1 < 100) zan[index + 1] = "Z";
    // if (index + 9 < 100) zan[index + 9] = "Z";
    // if (index + 10 < 100) zan[index + 10] = "Z";
    // if (index + 11 < 100) zan[index + 11] = "Z";
  }

  function add_z(index) {
    if (index >= 0 && index < 100 && zan[index] != "O") {
      zan[index] = "Z";
    }
  }
}
