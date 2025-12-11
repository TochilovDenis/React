// Панель информации о игре

import '../styles/GameInfo.css'; // Стили для информации

// Пропсы компонента:
// - gamePhase: текущая фаза игры
// - currentPlayer: текущий игрок
// - messages: массив сообщений игры
// - playerScore: счет игрока
// - computerScore: счет компьютера
// - winner: победитель
// - selectedShip: выбранный корабль
// - showComputerBoard: показывать ли поле компьютера
// - playerShips: корабли игрока (для отладки)
// - computerShips: корабли компьютера (для отладки)
const GameInfo = ({
    gamePhase,
    currentPlayer,
    messages,
    playerScore,
    computerScore,
    winner,
    selectedShip,
    showComputerBoard,
    playerShips = [],
    computerShips = []
}) => {
    // Получение текста текущей фазы игры
    const getPhaseText = () => {
        switch (gamePhase) {
            case 'placement':
                return 'Фаза расстановки кораблей';
            case 'battle':
                return 'Фаза боя';
            case 'finished':
                return 'Игра завершена';
            default:
                return '';
        }
    };

    // Получение текста текущего игрока
    const getPlayerText = () => {
        if (gamePhase === 'finished') {
            // Если игра завершена - показываем победителя
            return winner === 'player' ? 'Вы победили!' : 'Компьютер победил!';
        }
        return currentPlayer === 'player' ? 'Ваш ход' : 'Ход компьютера';
    };

    // Получение имени корабля по типу
    const getShipName = (shipType) => {
        const shipNames = {
            'battleship': 'Линкор',
            'cruiser': 'Крейсер',
            'destroyer': 'Эсминец',
            'torpedo': 'Торпедный катер'
        };
        return shipNames[shipType] || shipType; // Возвращаем имя или тип, если имя не найдено
    };

    // Рендеринг информации о выбранном корабле
    const getShipInfo = () => {
        if (!selectedShip || gamePhase !== 'placement') return null;

        return (
            <div className="ship-info">
                <strong>Выбранный корабль:</strong> {getShipName(selectedShip.type)} ({selectedShip.size} клетка{selectedShip.size > 1 ? 'и' : ''})
                <span className="orientation">Ориентация: {selectedShip.orientation === 'horizontal' ? 'горизонтальная' : 'вертикальная'}</span>
            </div>
        );
    };
    
    // Рендеринг отладочной информации (только в режиме разработки)
    const renderDebugInfo = () => {
        if (process.env.NODE_ENV === 'development') {
            const playerAlive = playerShips.filter(s => !s.sunk).length; // Живые корабли игрока
            const computerAlive = computerShips.filter(s => !s.sunk).length; // Живые корабли компьютера

            return (
                <div className="debug-info">
                    <div className="debug-stats">
                        <span>Ваши корабли: {playerAlive} из {playerShips.length} живы</span>
                        <span>Корабли компьютера: {computerAlive} из {computerShips.length} живы</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Основной рендеринг компонента
    return (
        <div className="game-info">
            {/* Информация о текущей фазе игры */}
            <div className="game-phase">
                <h3>Текущая фаза: {getPhaseText()}</h3>
                {!showComputerBoard && gamePhase === 'placement' && (
                    <div className="computer-status">
                        <span className="status-badge">✓</span>
                        <span>Противник готов к бою</span>
                    </div>
                )}
            </div>

            {/* Информация о статусе игрока и счет */}
            <div className="player-info">
                <div className="player-status">
                    <span className="status-label">Статус:</span>
                    <span className={`status-value ${currentPlayer}`}>
                        {getPlayerText()}
                    </span>
                </div>

                <div className="score-board">
                    <div className="score player-score">
                        <span className="score-label">Ваш счет:</span>
                        <span className="score-value">{playerScore}</span>
                    </div>
                    <div className="score computer-score">
                        <span className="score-label">Счет компьютера:</span>
                        <span className="score-value">{computerScore}</span>
                    </div>
                </div>
            </div>

            {getShipInfo()} {/* Информация о выбранном корабле */}

            {/* Сообщения игры */}
            <div className="game-messages">
                <h4>Сообщения игры:</h4>
                <div className="messages-list">
                    {messages.map((message, index) => (
                        <div key={index} className="message">
                            {message}
                        </div>
                    ))}
                </div>
            </div>

            {/* Баннер результата игры (если игра завершена) */}
            {gamePhase === 'finished' && (
                <div className="game-result">
                    <div className={`result-banner ${winner}`}>
                        {winner === 'player' ? '🎉 ПОБЕДА! 🎉' : '😔 ПОРАЖЕНИЕ 😔'}
                    </div>
                    <p className="result-text">
                        {winner === 'player'
                            ? 'Вы потопили все корабли противника!'
                            : 'Компьютер потопил все ваши корабли!'}
                    </p>
                </div>
            )}

            {renderDebugInfo()} {/* Отладочная информация */}
        </div>
    );
};

export default GameInfo;