// Компонент игрового поля
import Cell from './Cell'; // Импорт компонента клетки
import '../styles/Board.css'; // Стили для поля

// Пропсы компонента:
// - board: двумерный массив состояния клеток
// - onCellClick: функция обработки клика по клетке
// - showShips: показывать ли корабли
// - gamePhase: текущая фаза игры
// - isInteractive: является ли поле интерактивным
const Board = ({ board, onCellClick, showShips, gamePhase, isInteractive }) => {
  // Обработчик клика по клетке
  const handleCellClick = (x, y) => {
    // Проверяем интерактивность и наличие обработчика
    if (isInteractive && onCellClick) {
      onCellClick(x, y); // Вызываем обработчик с координатами
    }
  };

  return (
    <div className="board compact">
      {/* Заголовок с буквами (A-J) */}
      <div className="board-row board-header">
        <div className="board-corner"></div> {/* Пустой угол */}
        {[...Array(10)].map((_, i) => (
          <div key={`header-${i}`} className="board-header-cell">
            {String.fromCharCode(65 + i)} {/* A, B, C, ..., J */}
          </div>
        ))}
      </div>
      
      {/* Рендерим строки поля */}
      {board.map((row, y) => (
        <div key={`row-${y}`} className="board-row">
          {/* Заголовок строки с цифрой (1-10) */}
          <div className="board-header-cell">
            {y + 1}
          </div>
          {/* Рендерим клетки в строке */}
          {row.map((cell, x) => (
            <Cell
              key={`cell-${x}-${y}`}
              x={x}
              y={y}
              type={cell} // Тип клетки: empty, ship, hit, miss, sunk
              onClick={() => handleCellClick(x, y)} // Обработчик клика
              showShip={showShips && (cell === 'ship' || cell === 'sunk')} // Показывать ли корабль
              isInteractive={isInteractive} // Интерактивна ли клетка
              gamePhase={gamePhase} // Текущая фаза игры
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;