import React, { createContext, useContext, ReactNode } from 'react';
import { message, notification } from 'antd';

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
  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification();

  const showSuccess = (content: string) => {
    messageApi.success(content);
  };

  const showError = (content: string) => {
    messageApi.error(content);
  };

  const showWarning = (content: string) => {
    messageApi.warning(content);
  };

  const showInfo = (content: string) => {
    messageApi.info(content);
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
      {messageContextHolder}
      {notificationContextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationProvider; 