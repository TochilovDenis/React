// Утилиты игровой логики

// Создание пустого игрового поля 10x10
export const createEmptyBoard = () => {
    const board = []; // Инициализация массива поля
    for (let y = 0; y < 10; y++) {
        board[y] = []; // Создание строки
        for (let x = 0; x < 10; x++) {
            board[y][x] = 'empty'; // Заполнение пустыми клетками
        }
    }
    return board;
};

// Проверка возможности размещения корабля в заданной позиции
export const isValidPlacement = (board, ship, x, y) => {
    // Проверка выхода за границы поля
    if (ship.orientation === 'horizontal') {
        if (x + ship.size > 10) return false; // Горизонтальный корабль выходит за правую границу
    } else {
        if (y + ship.size > 10) return false; // Вертикальный корабль выходит за нижнюю границу
    }

    // Проверка каждой клетки корабля и окружающих клеток
    for (let i = 0; i < ship.size; i++) {
        // Вычисляем координаты клетки корабля
        const posX = ship.orientation === 'horizontal' ? x + i : x;
        const posY = ship.orientation === 'horizontal' ? y : y + i;

        // Проверяем, что клетка пустая
        if (board[posY][posX] !== 'empty') return false;

        // Проверяем окружающие клетки (включая диагональные)
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const checkX = posX + dx;
                const checkY = posY + dy;

                // Проверяем, что координаты внутри поля
                if (checkX >= 0 && checkX < 10 && checkY >= 0 && checkY < 10) {
                    // Если в соседней клетке есть корабль - размещение невозможно
                    if (board[checkY][checkX] === 'ship') return false;
                }
            }
        }
    }

    // Все проверки пройдены - размещение возможно
    return true;
};

// Генерация случайной расстановки кораблей компьютера
export const generateComputerShips = () => {
    const board = createEmptyBoard(); // Создаем пустое поле
    const ships = [ // Определяем набор кораблей
        { type: 'battleship', name: 'Линкор', size: 4, hits: 0, sunk: false, positions: [], placed: true },
        { type: 'cruiser', name: 'Крейсер', size: 3, hits: 0, sunk: false, positions: [], placed: true },
        { type: 'cruiser', name: 'Крейсер', size: 3, hits: 0, sunk: false, positions: [], placed: true },
        { type: 'destroyer', name: 'Эсминец', size: 2, hits: 0, sunk: false, positions: [], placed: true },
        { type: 'destroyer', name: 'Эсминец', size: 2, hits: 0, sunk: false, positions: [], placed: true },
        { type: 'destroyer', name: 'Эсминец', size: 2, hits: 0, sunk: false, positions: [], placed: true },
        { type: 'torpedo', name: 'Катер', size: 1, hits: 0, sunk: false, positions: [], placed: true },
        { type: 'torpedo', name: 'Катер', size: 1, hits: 0, sunk: false, positions: [], placed: true },
        { type: 'torpedo', name: 'Катер', size: 1, hits: 0, sunk: false, positions: [], placed: true },
        { type: 'torpedo', name: 'Катер', size: 1, hits: 0, sunk: false, positions: [], placed: true }
    ];

    // Размещаем каждый корабль
    ships.forEach(ship => {
        let placed = false; // Флаг успешного размещения
        let attempts = 0; // Счетчик попыток

        // Пытаемся разместить корабль (максимум 100 попыток)
        while (!placed && attempts < 100) {
            // Генерируем случайные координаты и ориентацию
            const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
            // Учитываем размер корабля при генерации координат
            const x = Math.floor(Math.random() * (orientation === 'horizontal' ? 10 - ship.size : 10));
            const y = Math.floor(Math.random() * (orientation === 'horizontal' ? 10 : 10 - ship.size));

            // Для однопалубных кораблей ориентация не имеет значения
            const tempShip = ship.size === 1 ? { ...ship, orientation: 'horizontal' } : { ...ship, orientation };

            // Проверяем возможность размещения
            if (isValidPlacement(board, tempShip, x, y)) {
                ship.positions = []; // Инициализируем массив позиций
                // Размещаем корабль на поле
                for (let i = 0; i < ship.size; i++) {
                    const posX = tempShip.orientation === 'horizontal' ? x + i : x;
                    const posY = tempShip.orientation === 'horizontal' ? y : y + i;

                    board[posY][posX] = 'ship'; // Помечаем клетку как корабль
                    ship.positions.push({ x: posX, y: posY }); // Сохраняем позицию
                }
                placed = true; // Помечаем как размещенный
            }
            attempts++; // Увеличиваем счетчик попыток
        }
    });

    return { board, ships }; // Возвращаем поле и корабли
};