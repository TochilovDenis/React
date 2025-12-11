//  Главный компонент приложения

// Импорт необходимых зависимостей
import React, { useState, useEffect } from 'react'; // React и его хуки
import Board from './components/Board'; // Компонент игрового поля
import GameInfo from './components/GameInfo'; // Компонент информации о игре
import Controls from './components/Controls'; // Компонент управления
// Импорт утилит игровой логики
import {
    createEmptyBoard, // Создание пустого поля
    isValidPlacement, // Проверка возможности размещения корабля
    generateComputerShips, // Генерация кораблей компьютера
} from './utils/gameLogic';
import './styles/App.css'; // Стили для App компонента

// Главный компонент приложения
function App() {
    // Состояние игры
    const [gameState, setGameState] = useState({
        playerBoard: createEmptyBoard(), // Поле игрока
        computerBoard: createEmptyBoard(), // Поле компьютера
        playerShips: [], // Корабли игрока
        computerShips: [], // Корабли компьютера
        gamePhase: 'placement', // Текущая фаза игры: placement(расстановка), battle(бой), finished(завершено)
        currentPlayer: 'player', // Чей сейчас ход: player или computer
        selectedShip: null, // Выбранный для размещения корабль
        messages: ['Расставьте ваши корабли'], // Сообщения игры
        playerScore: 0, // Счет игрока
        computerScore: 0, // Счет компьютера
        winner: null, // Победитель игры
        showComputerBoard: false // Показывать ли поле компьютера
    });

    // Состояние кораблей для размещения
    const [shipsToPlace, setShipsToPlace] = useState([
        { id: 1, type: 'battleship', name: 'Линкор', size: 4, placed: false, orientation: 'horizontal' },
        { id: 2, type: 'cruiser', name: 'Крейсер', size: 3, placed: false, orientation: 'horizontal' },
        { id: 3, type: 'cruiser', name: 'Крейсер', size: 3, placed: false, orientation: 'horizontal' },
        { id: 4, type: 'destroyer', name: 'Эсминец', size: 2, placed: false, orientation: 'horizontal' },
        { id: 5, type: 'destroyer', name: 'Эсминец', size: 2, placed: false, orientation: 'horizontal' },
        { id: 6, type: 'destroyer', name: 'Эсминец', size: 2, placed: false, orientation: 'horizontal' },
        { id: 7, type: 'torpedo', name: 'Катер', size: 1, placed: false, orientation: 'horizontal' },
        { id: 8, type: 'torpedo', name: 'Катер', size: 1, placed: false, orientation: 'horizontal' },
        { id: 9, type: 'torpedo', name: 'Катер', size: 1, placed: false, orientation: 'horizontal' },
        { id: 10, type: 'torpedo', name: 'Катер', size: 1, placed: false, orientation: 'horizontal' }
    ]);

    // Индекс выбранного корабля в массиве shipsToPlace
    const [selectedShipIndex, setSelectedShipIndex] = useState(0);

    // Эффект для отладочного вывода состояния игры
    useEffect(() => {
        console.log('=== ИГРОВОЕ СОСТОЯНИЕ ОБНОВЛЕНО ===');
        console.log('Фаза:', gameState.gamePhase);
        console.log('Победитель:', gameState.winner);
        // Вывод информации о кораблях игрока
        console.log('Корабли игрока:', gameState.playerShips.map(s => ({
            type: s.type,
            name: s.name,
            hits: s.hits,
            size: s.size,
            sunk: s.sunk,
            positions: s.positions ? s.positions.length : 0
        })));
        // Вывод информации о кораблях компьютера
        console.log('Корабли компьютера:', gameState.computerShips.map(s => ({
            type: s.type,
            name: s.name,
            hits: s.hits,
            size: s.size,
            sunk: s.sunk,
            positions: s.positions ? s.positions.length : 0
        })));
    }, [gameState]); // Зависимость от gameState - выполняется при каждом изменении состояния

    // Инициализация игры - генерация кораблей компьютера
    useEffect(() => {
        const computerSetup = generateComputerShips(); // Генерация кораблей и поля компьютера
        setGameState(prev => ({
            ...prev, // Сохраняем предыдущее состояние
            computerBoard: computerSetup.board, // Устанавливаем поле компьютера
            computerShips: computerSetup.ships // Устанавливаем корабли компьютера
        }));
    }, []); // Пустой массив зависимостей - выполняется только при монтировании компонента

    // Обработчик размещения корабля
    const handlePlaceShip = (x, y) => {
        // Проверяем, что находимся в фазе расстановки
        if (gameState.gamePhase !== 'placement') return;

        const ship = shipsToPlace[selectedShipIndex]; // Получаем выбранный корабль
        if (!ship || ship.placed) return; // Если корабль не выбран или уже размещен - выходим

        const newBoard = [...gameState.playerBoard]; // Копируем поле игрока
        const newShips = [...gameState.playerShips]; // Копируем корабли игрока

        // Для однопалубных кораблей ориентация не имеет значения
        const effectiveShip = ship.size === 1 ? { ...ship, orientation: 'horizontal' } : ship;

        // Проверяем возможность размещения корабля в выбранной клетке
        if (isValidPlacement(newBoard, effectiveShip, x, y)) {
            // Создаем объект размещенного корабля
            const placedShip = {
                ...effectiveShip,
                placed: true,
                positions: [], // Массив позиций корабля
                hits: 0, // Количество попаданий
                sunk: false // Флаг потопления
            };

            // Размещаем корабль на поле
            for (let i = 0; i < effectiveShip.size; i++) {
                const posX = effectiveShip.orientation === 'horizontal' ? x + i : x;
                const posY = effectiveShip.orientation === 'horizontal' ? y : y + i;

                if (posY < 10 && posX < 10) {
                    newBoard[posY][posX] = 'ship'; // Помечаем клетку как корабль
                    placedShip.positions.push({ x: posX, y: posY }); // Добавляем позицию
                }
            }

            // Обновляем список кораблей для размещения
            const updatedShips = [...shipsToPlace];
            updatedShips[selectedShipIndex] = { ...ship, placed: true }; // Помечаем корабль как размещенный

            setShipsToPlace(updatedShips); // Обновляем состояние кораблей

            // Проверяем, все ли корабли размещены
            const allPlaced = updatedShips.every(s => s.placed);

            if (allPlaced) {
                // Все корабли размещены - начинаем игру
                setGameState(prev => ({
                    ...prev,
                    playerBoard: newBoard,
                    playerShips: [...prev.playerShips, placedShip], // Добавляем размещенный корабль
                    messages: ['Все корабли размещены! Игра начинается!']
                }));

                // Через 1.5 секунды начинаем битву
                setTimeout(() => {
                    setGameState(prev => ({
                        ...prev,
                        gamePhase: 'battle', // Переходим в фазу боя
                        showComputerBoard: true, // Показываем поле компьютера
                        currentPlayer: 'player', // Первый ход - игрока
                        messages: ['Игра начинается! Ваш ход!']
                    }));
                }, 1500);
            } else {
                // Еще есть корабли для размещения
                setGameState(prev => ({
                    ...prev,
                    playerBoard: newBoard,
                    playerShips: [...prev.playerShips, placedShip],
                    messages: [`${ship.name} размещен! Выберите следующий корабль.`]
                }));

                // Находим следующий неразмещенный корабль
                const nextIndex = updatedShips.findIndex(s => !s.placed);
                setSelectedShipIndex(nextIndex); // Выбираем следующий корабль
            }
        } else {
            // Невозможно разместить корабль
            setGameState(prev => ({
                ...prev,
                messages: ['Невозможно разместить корабль здесь!']
            }));
        }
    };

    // Обработчик выстрела игрока
    const handlePlayerFire = (x, y) => {
        // Проверяем, что сейчас фаза боя и ход игрока
        if (gameState.gamePhase !== 'battle' || gameState.currentPlayer !== 'player') return;

        const cell = gameState.computerBoard[y][x]; // Получаем состояние клетки

        // Проверяем, не стреляли ли уже в эту клетку
        if (cell === 'hit' || cell === 'miss' || cell === 'sunk') {
            setGameState(prev => ({
                ...prev,
                messages: ['Вы уже стреляли сюда!']
            }));
            return;
        }

        // Создаем глубокие копии поля и кораблей компьютера
        const newComputerBoard = [...gameState.computerBoard];
        const newComputerShips = JSON.parse(JSON.stringify(gameState.computerShips));

        const isHit = cell === 'ship'; // Проверяем попадание
        newComputerBoard[y][x] = isHit ? 'hit' : 'miss'; // Обновляем состояние клетки

        if (isHit) {
            // Поиск корабля, в который попали
            for (let i = 0; i < newComputerShips.length; i++) {
                const ship = newComputerShips[i];
                const hitIndex = ship.positions.findIndex(p => p.x === x && p.y === y);

                if (hitIndex !== -1) {
                    ship.hits++; // Увеличиваем счетчик попаданий

                    // Проверяем, потоплен ли корабль
                    if (ship.hits >= ship.size) {
                        ship.sunk = true; // Помечаем корабль как потопленный
                        // Помечаем все клетки потопленного корабля
                        ship.positions.forEach(pos => {
                            newComputerBoard[pos.y][pos.x] = 'sunk';
                        });

                        const shipName = ship.name || 'корабль'; // Получаем имя корабля

                        setGameState(prev => ({
                            ...prev,
                            messages: [`Вы потопили ${shipName} компьютера!`]
                        }));
                    }
                    break; // Выходим из цикла, так как корабль найден
                }
            }
        }

        // Проверяем, потоплены ли все корабли компьютера
        const allComputerShipsSunk = newComputerShips.every(ship => ship.sunk);

        if (allComputerShipsSunk) {
            // Игрок победил
            setGameState(prev => ({
                ...prev,
                computerBoard: newComputerBoard,
                computerShips: newComputerShips,
                gamePhase: 'finished',
                winner: 'player',
                playerScore: prev.playerScore + 1, // Увеличиваем счет игрока
                messages: ['🎉 ПОБЕДА! Вы потопили все корабли компьютера! 🎉']
            }));
            return;
        }

        // Если игра продолжается, передаем ход компьютеру
        setGameState(prev => ({
            ...prev,
            computerBoard: newComputerBoard,
            computerShips: newComputerShips,
            currentPlayer: 'computer',
            messages: [
                isHit ? 'Попадание!' : 'Промах!',
                'Ход компьютера...'
            ]
        }));

        // Через секунду компьютер делает ход
        setTimeout(() => {
            handleComputerTurn();
        }, 1000);
    };

    // Ход компьютера
    const handleComputerTurn = () => {
        console.log('Компьютер делает ход...');

        // Создаем глубокие копии поля и кораблей игрока
        const newPlayerBoard = JSON.parse(JSON.stringify(gameState.playerBoard));
        const newPlayerShips = JSON.parse(JSON.stringify(gameState.playerShips));

        // Находим все возможные клетки для выстрела
        const availableCells = [];
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = newPlayerBoard[y][x];
                // Клетка доступна для выстрела, если она пустая или с кораблем
                if (cell === 'empty' || cell === 'ship') {
                    availableCells.push({ x, y, cell });
                }
            }
        }

        // Проверяем, есть ли доступные клетки
        if (availableCells.length === 0) {
            console.log('Нет доступных клеток для выстрела');
            setGameState(prev => ({
                ...prev,
                currentPlayer: 'player',
                messages: ['Компьютер не нашел куда стрелять. Ваш ход.']
            }));
            return;
        }

        // Выбираем случайную клетку
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const { x, y, cell } = availableCells[randomIndex];

        console.log('Компьютер стреляет в:', x, y, 'тип клетки:', cell);

        const isHit = cell === 'ship'; // Проверяем попадание
        newPlayerBoard[y][x] = isHit ? 'hit' : 'miss'; // Обновляем клетку

        if (isHit) {
            // Поиск корабля, в который попали
            for (let i = 0; i < newPlayerShips.length; i++) {
                const ship = newPlayerShips[i];
                const hitIndex = ship.positions.findIndex(p => p.x === x && p.y === y);

                if (hitIndex !== -1) {
                    console.log('Попали в корабль:', ship.name, 'было hits:', ship.hits);
                    ship.hits++; // Увеличиваем счетчик попаданий

                    // Проверяем, потоплен ли корабль
                    if (ship.hits >= ship.size) {
                        console.log('Корабль потоплен!', ship.name);
                        ship.sunk = true; // Помечаем как потопленный

                        // Помечаем все клетки потопленного корабля
                        ship.positions.forEach(pos => {
                            newPlayerBoard[pos.y][pos.x] = 'sunk';
                        });

                        const shipName = ship.name || 'корабль';

                        setGameState(prev => ({
                            ...prev,
                            messages: [`Компьютер потопил ваш ${shipName}!`]
                        }));
                    }
                    break;
                }
            }
        }

        // Проверяем, потоплены ли все корабли игрока
        const allPlayerShipsSunk = newPlayerShips.every(ship => ship.sunk);

        console.log('Все корабли потоплены?', allPlayerShipsSunk);

        if (allPlayerShipsSunk) {
            // Компьютер победил
            console.log('ИГРА ЗАВЕРШЕНА! Компьютер победил!');
            setGameState(prev => ({
                ...prev,
                playerBoard: newPlayerBoard,
                playerShips: newPlayerShips,
                gamePhase: 'finished',
                winner: 'computer',
                computerScore: prev.computerScore + 1, // Увеличиваем счет компьютера
                messages: ['😔 КОМПЬЮТЕР ПОБЕДИЛ! Он потопил все ваши корабли! 😔']
            }));
            return;
        }

        // Если игра продолжается, передаем ход игроку
        console.log('Игра продолжается, передаем ход игроку');
        setGameState(prev => ({
            ...prev,
            playerBoard: newPlayerBoard,
            playerShips: newPlayerShips,
            currentPlayer: 'player',
            messages: [
                isHit ? 'Компьютер попал!' : 'Компьютер промахнулся!',
                'Ваш ход.'
            ]
        }));
    };

    // Случайная расстановка кораблей
    const handleRandomPlacement = () => {
        const newBoard = createEmptyBoard(); // Создаем новое пустое поле
        const newShips = []; // Массив для размещенных кораблей
        const ships = [...shipsToPlace]; // Копируем корабли для размещения
        let failedToPlace = false; // Флаг неудачной расстановки

        // Пытаемся разместить каждый корабль
        ships.forEach(ship => {
            let placed = false; // Флаг успешного размещения
            let attempts = 0; // Счетчик попыток

            // Пытаемся разместить корабль (максимум 100 попыток)
            while (!placed && attempts < 100) {
                const x = Math.floor(Math.random() * 10); // Случайная координата X
                const y = Math.floor(Math.random() * 10); // Случайная координата Y
                const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical'; // Случайная ориентация

                // Для однопалубных кораблей ориентация не имеет значения
                const tempShip = ship.size === 1 ? { ...ship, orientation: 'horizontal' } : { ...ship, orientation };

                // Проверяем возможность размещения
                if (isValidPlacement(newBoard, tempShip, x, y)) {
                    // Создаем объект размещенного корабля
                    const placedShip = {
                        ...tempShip,
                        placed: true,
                        positions: [],
                        hits: 0,
                        sunk: false
                    };

                    // Размещаем корабль на поле
                    for (let i = 0; i < tempShip.size; i++) {
                        const posX = tempShip.orientation === 'horizontal' ? x + i : x;
                        const posY = tempShip.orientation === 'horizontal' ? y : y + i;

                        if (posY < 10 && posX < 10) {
                            newBoard[posY][posX] = 'ship';
                            placedShip.positions.push({ x: posX, y: posY });
                        }
                    }

                    newShips.push(placedShip); // Добавляем корабль в список
                    placed = true; // Помечаем как размещенный
                }
                attempts++; // Увеличиваем счетчик попыток
            }

            if (!placed) {
                failedToPlace = true; // Не удалось разместить корабль
            }
        });

        // Если не удалось разместить все корабли
        if (failedToPlace) {
            setGameState(prev => ({
                ...prev,
                messages: ['Не удалось разместить все корабли. Попробуйте еще раз.']
            }));
            return;
        }

        // Помечаем все корабли как размещенные
        const updatedShips = ships.map(ship => ({ ...ship, placed: true }));

        setShipsToPlace(updatedShips);
        setGameState(prev => ({
            ...prev,
            playerBoard: newBoard,
            playerShips: newShips,
            gamePhase: 'battle', // Переходим к фазе боя
            showComputerBoard: true, // Показываем поле компьютера
            messages: ['Корабли расставлены случайно! Ваш ход!']
        }));
    };

    // Поворот корабля (не применяется к однопалубным)
    const handleRotateShip = () => {
        const updatedShips = [...shipsToPlace];
        const currentShip = updatedShips[selectedShipIndex];

        // Проверяем, что корабль не размещен и имеет более 1 палубы
        if (currentShip && !currentShip.placed && currentShip.size > 1) {
            // Меняем ориентацию на противоположную
            updatedShips[selectedShipIndex] = {
                ...currentShip,
                orientation: currentShip.orientation === 'horizontal' ? 'vertical' : 'horizontal'
            };
            setShipsToPlace(updatedShips);
        }
    };

    // Сброс игры (начать новую)
    const handleResetGame = () => {
        // Сбрасываем состояние кораблей для размещения
        const newShipsToPlace = shipsToPlace.map(ship => ({
            ...ship,
            placed: false,
            orientation: 'horizontal'
        }));

        // Генерируем новые корабли компьютера
        const computerSetup = generateComputerShips();

        // Обновляем все состояния
        setShipsToPlace(newShipsToPlace);
        setSelectedShipIndex(0);
        setGameState({
            playerBoard: createEmptyBoard(), // Новое пустое поле игрока
            computerBoard: computerSetup.board, // Новое поле компьютера
            playerShips: [], // Пустой список кораблей игрока
            computerShips: computerSetup.ships.map(ship => ({
                ...ship,
                sunk: false,
                hits: 0
            })), // Сбрасываем состояние кораблей компьютера
            gamePhase: 'placement', // Возвращаемся к фазе расстановки
            currentPlayer: 'player', // Первый ход - игрока
            selectedShip: null,
            messages: ['Расставьте ваши корабли'],
            playerScore: gameState.playerScore, // Сохраняем счет игрока
            computerScore: gameState.computerScore, // Сохраняем счет компьютера
            winner: null,
            showComputerBoard: false // Скрываем поле компьютера
        });
    };

    // Рендеринг компонента
    return (
        <div className="App">
            {/* Заголовок игры */}
            <header className="App-header">
                <h1>⚓ Морской Бой ⚓</h1>
                <p className="subtitle">Классические правила: 10 кораблей</p>
            </header>

            <main>
                {/* Компонент информации о игре */}
                <GameInfo
                    gamePhase={gameState.gamePhase}
                    currentPlayer={gameState.currentPlayer}
                    messages={gameState.messages}
                    playerScore={gameState.playerScore}
                    computerScore={gameState.computerScore}
                    winner={gameState.winner}
                    selectedShip={shipsToPlace[selectedShipIndex]}
                    showComputerBoard={gameState.showComputerBoard}
                    playerShips={gameState.playerShips}
                    computerShips={gameState.computerShips}
                />

                {/* Контейнер игровых полей */}
                <div className="boards-container">
                    {/* Поле игрока */}
                    <div className="board-section">
                        <h2>Ваше поле</h2>
                        <Board
                            board={gameState.playerBoard}
                            onCellClick={
                                // В фазе расстановки - размещение кораблей, в других фазах - пустая функция
                                gameState.gamePhase === 'placement'
                                    ? handlePlaceShip
                                    : () => { }
                            }
                            showShips={true} // Всегда показываем корабли игрока
                            gamePhase={gameState.gamePhase}
                            isInteractive={gameState.gamePhase === 'placement'} // Интерактивно только в фазе расстановки
                        />
                    </div>

                    {/* Поле компьютера */}
                    <div className="board-section">
                        <h2>Поле компьютера</h2>

                        {!gameState.showComputerBoard ? (
                            // Скрытое поле (до начала битвы)
                            <div className="hidden-board">
                                <div className="board-overlay">
                                    <div className="hidden-message">
                                        <div className="lock-icon">🔒</div>
                                        <h3>Поле противника</h3>
                                        <p>Расстановка кораблей компьютера завершена</p>
                                        <p>Игра начнется после размещения всех ваших кораблей</p>
                                        <div className="ready-status">
                                            <span className="status-indicator ready">✓</span>
                                            <span>Противник готов к бою</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Неинтерактивное поле компьютера */}
                                <Board
                                    board={gameState.computerBoard}
                                    onCellClick={() => { }} // Пустая функция - поле не кликабельно
                                    showShips={false} // Не показываем корабли компьютера
                                    gamePhase={gameState.gamePhase}
                                    isInteractive={false}
                                />
                            </div>
                        ) : (
                            // Видимое поле (во время битвы)
                            <Board
                                board={gameState.computerBoard}
                                onCellClick={
                                    // Кликабельно только во время фазы боя и когда ход игрока
                                    gameState.gamePhase === 'battle' && gameState.currentPlayer === 'player'
                                        ? handlePlayerFire
                                        : () => { }
                                }
                                showShips={false} // Не показываем корабли (только результаты выстрелов)
                                gamePhase={gameState.gamePhase}
                                isInteractive={
                                    gameState.gamePhase === 'battle' &&
                                    gameState.currentPlayer === 'player'
                                }
                            />
                        )}
                    </div>
                </div>

                {/* Панель управления */}
                <Controls
                    gamePhase={gameState.gamePhase}
                    onRandomPlace={handleRandomPlacement}
                    onRotate={handleRotateShip}
                    onReset={handleResetGame}
                    shipsToPlace={shipsToPlace}
                    selectedShipIndex={selectedShipIndex}
                    onSelectShip={setSelectedShipIndex}
                    showComputerBoard={gameState.showComputerBoard}
                />
            </main>
        </div>
    );
}

export default App;