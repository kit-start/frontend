import { message, notification, Modal } from 'antd';
import type { ArgsProps } from 'antd/es/notification/interface';
import type { MessageInstance } from 'antd/es/message/interface';

let messageApi: MessageInstance | null = null;

/**
 * Инициализирует сервис уведомлений
 * @param api - экземпляр message API из Ant Design
 */
export const initNotificationService = (api: MessageInstance) => {
  messageApi = api;
};

/**
 * Показывает информационное сообщение
 * @param content - текст сообщения
 * @param duration - длительность показа в секундах
 */
export const showInfo = (content: string, duration = 3) => {
  if (messageApi) {
    messageApi.info(content, duration);
  } else {
    message.info(content, duration);
  }
};

/**
 * Показывает сообщение об успехе
 * @param content - текст сообщения
 * @param duration - длительность показа в секундах
 */
export const showSuccess = (content: string, duration = 3) => {
  if (messageApi) {
    messageApi.success(content, duration);
  } else {
    message.success(content, duration);
  }
};

/**
 * Показывает предупреждение
 * @param content - текст предупреждения
 * @param duration - длительность показа в секундах
 */
export const showWarning = (content: string, duration = 4) => {
  if (messageApi) {
    messageApi.warning(content, duration);
  } else {
    message.warning(content, duration);
  }
};

/**
 * Показывает сообщение об ошибке
 * @param content - текст ошибки
 * @param duration - длительность показа в секундах
 */
export const showError = (content: string, duration = 4) => {
  if (messageApi) {
    messageApi.error(content, duration);
  } else {
    message.error(content, duration);
  }
};

/**
 * Показывает уведомление
 * @param config - конфигурация уведомления
 */
export const showNotification = (config: ArgsProps) => {
  notification.open(config);
};

/**
 * Показывает модальное окно с ошибкой
 * @param title - заголовок окна
 * @param content - содержимое окна
 */
export const showErrorModal = (title: string, content: string) => {
  Modal.error({
    title,
    content,
  });
};

/**
 * Обрабатывает ошибку API и показывает соответствующее уведомление
 * @param error - объект ошибки
 * @param fallbackMessage - сообщение по умолчанию, если ошибка не содержит сообщения
 * @returns сообщение об ошибке
 */
export const handleApiError = (error: any, fallbackMessage = 'Произошла ошибка при обработке запроса'): string => {
  console.error('API Error:', error);
  
  // Определяем сообщение об ошибке
  let errorMessage = fallbackMessage;
  
  if (error.response) {
    // Ошибка от сервера с ответом
    const status = error.response.status;
    const data = error.response.data;
    
    if (data && data.message) {
      errorMessage = data.message;
    } else if (status === 401) {
      errorMessage = 'Необходима авторизация для доступа к этому ресурсу';
    } else if (status === 403) {
      errorMessage = 'У вас нет доступа к этому ресурсу';
    } else if (status === 404) {
      errorMessage = 'Запрашиваемый ресурс не найден';
    } else if (status === 500) {
      errorMessage = 'Внутренняя ошибка сервера';
    }
  } else if (error.request) {
    // Запрос был сделан, но ответ не получен
    errorMessage = 'Сервер не отвечает. Проверьте подключение к интернету.';
  } else if (error.message) {
    // Ошибка при настройке запроса
    errorMessage = error.message;
  }
  
  // Показываем ошибку пользователю
  showError(errorMessage);
  
  return errorMessage;
}; 