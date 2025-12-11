// Импорт StrictMode из React - специальный режим для выявления потенциальных проблем
import { StrictMode } from 'react';

// Импорт функции createRoot для создания корня React приложения (React 18+)
import { createRoot } from 'react-dom/client';

// Импорт глобальных стилей приложения
import './styles/App.css';

// Импорт главного компонента приложения
import App from './App.js';

// Создание корня React приложения в элементе с id="root"
const root = createRoot(document.getElementById('root'));

// Рендеринг приложения в корневой элемент
root.render(
  // Оборачиваем приложение в StrictMode для дополнительных проверок
  <StrictMode>
    {/* Главный компонент приложения */}
    <App />
  </StrictMode>
);