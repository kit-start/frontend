import { useEffect } from 'react';
import { message } from 'antd';
import { initNotificationService, showInfo, showSuccess, showError, showWarning } from '../services/notificationService';

/**
 * Хук для инициализации и работы с уведомлениями
 * Предоставляет методы для отображения различных типов уведомлений
 */
export const useNotifications = () => {
  const [messageApi, contextHolder] = message.useMessage();

  // Инициализируем сервис уведомлений при первом рендере
  useEffect(() => {
    initNotificationService(messageApi);
  }, [messageApi]);

  return {
    contextHolder,
    
    // Методы для показа уведомлений
    showInfo,
    showSuccess,
    showError, 
    showWarning,
    
    // Вспомогательные методы для обработки типичных ситуаций
    notifyLoginSuccess: (username: string) => {
      showSuccess(`Добро пожаловать, ${username}!`, 3);
    },
    
    notifyLogout: () => {
      showInfo('Вы успешно вышли из системы', 3);
    },
    
    notifyOperationSuccess: (operation: string) => {
      showSuccess(`Операция "${operation}" успешно выполнена`, 3);
    },
    
    notifyApiError: (error: any, fallbackMessage = 'Произошла ошибка при выполнении запроса') => {
      let errorMessage = fallbackMessage;
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError(errorMessage, 5);
      console.error('API Error:', error);
      
      return errorMessage;
    },
    
    notifyValidationError: (message: string) => {
      showWarning(message, 4);
    }
  };
};

export default useNotifications; 