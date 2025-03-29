import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Определение ключа для localStorage
const DEMO_MODE_KEY = 'kitstart_demo_mode';

// Интерфейс для контекста
interface DemoContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
}

// Создаем контекст с начальными значениями
const DemoContext = createContext<DemoContextType>({
  isDemoMode: false,
  toggleDemoMode: () => {},
  enableDemoMode: () => {},
  disableDemoMode: () => {},
});

// Хук для использования контекста
export const useDemoMode = () => useContext(DemoContext);

// Интерфейс для пропсов провайдера
interface DemoProviderProps {
  children: ReactNode;
}

// Компонент-провайдер
export const DemoProvider: React.FC<DemoProviderProps> = ({ children }) => {
  // Инициализируем состояние из localStorage
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const storedValue = localStorage.getItem(DEMO_MODE_KEY);
    return storedValue ? storedValue === 'true' : false;
  });

  // Функция для переключения режима
  const toggleDemoMode = () => {
    setIsDemoMode(prevMode => !prevMode);
  };

  // Функция для включения демо-режима
  const enableDemoMode = () => {
    setIsDemoMode(true);
  };

  // Функция для выключения демо-режима
  const disableDemoMode = () => {
    setIsDemoMode(false);
  };

  // Сохраняем состояние в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(DEMO_MODE_KEY, isDemoMode.toString());
    // При включении демо-режима выводим сообщение в консоль
    if (isDemoMode) {
      console.log('Приложение работает в демо-режиме с моковыми данными');
    }
  }, [isDemoMode]);

  return (
    <DemoContext.Provider value={{ isDemoMode, toggleDemoMode, enableDemoMode, disableDemoMode }}>
      {children}
    </DemoContext.Provider>
  );
}; 