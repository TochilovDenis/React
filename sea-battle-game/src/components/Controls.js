// Панель управления игрой

import '../styles/Controls.css'; // Стили для управления

// Пропсы компонента:
// - gamePhase: текущая фаза игры
// - onRandomPlace: функция случайной расстановки
// - onRotate: функция поворота корабля
// - onReset: функция сброса игры
// - shipsToPlace: массив кораблей для размещения
// - selectedShipIndex: индекс выбранного корабля
// - onSelectShip: функция выбора корабля
// - showComputerBoard: показывать ли поле компьютера
const Controls = ({
    gamePhase,
    onRandomPlace,
    onRotate,
    onReset,
    shipsToPlace,
    selectedShipIndex,
    onSelectShip,
    showComputerBoard
}) => {
    // Получение доступных для размещения кораблей
    const getAvailableShips = () => {
        return shipsToPlace.filter(ship => !ship.placed);
    };

    // Получение уже размещенных кораблей
    const getPlacedShips = () => {
        return shipsToPlace.filter(ship => ship.placed);
    };

    // Рендеринг селектора кораблей
    const renderShipSelector = () => {
        if (gamePhase !== 'placement') return null; // Только в фазе расстановки

        return (
            <div className="ship-selector">
                <h4>Выберите корабль для размещения:</h4>
                <div className="ships-list">
                    {shipsToPlace.map((ship, index) => (
                        <div
                            key={ship.id}
                            className={`ship-item ${index === selectedShipIndex ? 'selected' : ''} ${ship.placed ? 'placed' : ''}`}
                            onClick={() => !ship.placed && onSelectShip(index)} // Выбор только неразмещенных
                            title={`${ship.name} (${ship.size} клеток)`}
                        >
                            <div className="ship-preview">
                                {/* Визуальное представление корабля */}
                                {ship.size === 1 ? '●' : Array(ship.size).fill('⬤').join(' ')}
                            </div>
                            <div className="ship-info">
                                <span className="ship-name">
                                    {ship.name}
                                </span>
                                <span className="ship-size">{ship.size} клетка{ship.size > 1 ? 'и' : ''}</span>
                                {ship.placed && <span className="placed-badge">✓</span>} /* Галочка для размещенных */
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Рендеринг управления расстановкой
    const renderPlacementControls = () => {
        if (gamePhase !== 'placement') return null;

        return (
            <div className="placement-controls">
                <h4>Управление расстановкой:</h4>
                <div className="placement-buttons">
                    <button
                        className="control-btn rotate-btn"
                        onClick={onRotate}
                        title="Повернуть корабль"
                    >
                        ↻ Повернуть корабль
                    </button>
                    <button
                        className="control-btn random-btn"
                        onClick={onRandomPlace}
                        title="Случайная расстановка"
                    >
                        🎲 Случайная расстановка
                    </button>
                </div>
                <div className="placement-hint">
                    <p>💡 Нажмите на клетку вашего поля, чтобы разместить выбранный корабль</p>
                    <p>💡 Нажмите на корабль в списке, чтобы выбрать его</p>
                </div>
            </div>
        );
    };

    // Рендеринг управления боем
    const renderBattleControls = () => {
        if (gamePhase !== 'battle') return null;

        return (
            <div className="battle-controls">
                <h4>Управление боем:</h4>
                <div className="battle-hint">
                    <p>🎯 Нажимайте на клетки поля противника, чтобы сделать выстрел</p>
                    <p>💥 Красные клетки - попадания, белые - промахи</p>
                    <p>🔥 Оранжевые клетки - потопленные корабли</p>
                    <p>🔒 Теперь вы видите поле противника!</p>
                </div>
            </div>
        );
    };

    // Рендеринг общих игровых контролов
    const renderGameControls = () => {
        return (
            <div className="game-controls">
                <h4>Общее управление:</h4>
                <div className="control-buttons">
                    <button
                        className="control-btn reset-btn"
                        onClick={onReset}
                        title="Начать новую игру"
                    >
                        🆕 Новая игра
                    </button>

                    {gamePhase === 'finished' && (
                        <button
                            className="control-btn continue-btn"
                            onClick={onReset}
                            title="Играть еще раз"
                        >
                            🔄 Играть снова
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // Рендеринг статистики
    const renderStats = () => {
        const available = getAvailableShips().length; // Количество доступных кораблей
        const placed = getPlacedShips().length; // Количество размещенных кораблей
        const total = shipsToPlace.length; // Общее количество кораблей

        return (
            <div className="stats">
                <div className="stat-item">
                    <span className="stat-label">Всего кораблей:</span>
                    <span className="stat-value">{total}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Размещено:</span>
                    <span className="stat-value placed">{placed}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Осталось:</span>
                    <span className="stat-value available">{available}</span>
                </div>
            </div>
        );
    };

    // Основной рендеринг компонента
    return (
        <div className="controls-container">
            {renderStats()} {/* Статистика */}

            {/* Уведомление о готовности компьютера */}
            {!showComputerBoard && gamePhase === 'placement' && (
                <div className="computer-ready-notice">
                    <div className="notice-icon">⚠️</div>
                    <div className="notice-text">
                        <strong>Противник готов к бою!</strong>
                        <p>Расставьте все свои корабли, чтобы начать игру</p>
                    </div>
                </div>
            )}

            {/* Основное содержимое панели управления */}
            <div className="controls-content">
                {renderShipSelector()} {/* Селектор кораблей */}
                {renderPlacementControls()} {/* Управление расстановкой */}
                {renderBattleControls()} {/* Управление боем */}
                {renderGameControls()} {/* Общее управление */}
            </div>

            {/* Правила игры */}
            <div className="game-rules">
                <h4>📋 Классические правила игры:</h4>
                <ul className="rules-list">
                    <li>📌 Разместите 10 кораблей на своем поле (10×10):</li>
                    <li className="sublist">
                        <ul>
                            <li>• 1 линкор (4 клетки)</li>
                            <li>• 2 крейсера (по 3 клетки)</li>
                            <li>• 3 эсминца (по 2 клетки)</li>
                            <li>• 4 торпедных катера (по 1 клетке)</li>
                        </ul>
                    </li>
                    <li>🎯 Корабли не должны соприкасаться (даже по диагонали)</li>
                    <li>💥 По очереди делайте выстрелы по полю противника</li>
                    <li>🏆 Первый, кто потопит все корабли противника, побеждает</li>
                </ul>
            </div>
        </div>
    );
};

export default Controls;