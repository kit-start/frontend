import React, { createContext, useContext, ReactNode } from 'react';
import { message } from 'antd';

// Интерфейс контекста уведомлений
interface NotificationContextType {
  showInfo: (content: string) => void;
  showSuccess: (content: string) => void;
  showError: (content: string) => void;
  showWarning: (content: string) => void;
}

// Создание контекста уведомлений с пустыми функциями по умолчанию
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Интерфейс пропсов провайдера
interface NotificationProviderProps {
  children: ReactNode;
}

// Провайдер контекста уведомлений
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const showSuccess = (content: string) => {
    message.success(content);
  };

  const showError = (content: string) => {
    message.error(content);
  };

  const showWarning = (content: string) => {
    message.warning(content);
  };

  const showInfo = (content: string) => {
    message.info(content);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        showSuccess, 
        showError, 
        showWarning, 
        showInfo 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotificationContext должен использоваться внутри NotificationProvider');
  }
  
  return context;
};

export default NotificationProvider; 