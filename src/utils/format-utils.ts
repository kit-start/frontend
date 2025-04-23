/**
 * Форматирует размер файла в удобочитаемый вид
 * @param bytes - размер в байтах
 * @returns отформатированный размер с единицами измерения
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 байт';
  if (bytes < 1024) return bytes + ' байт';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' ГБ';
};

/**
 * Форматирует дату в локализованный формат
 * @param date - объект даты
 * @returns отформатированная дата в формате DD.MM.YYYY
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Форматирует дату и время в локализованный формат
 * @param date - объект даты
 * @returns отформатированная дата и время в формате DD.MM.YYYY HH:MM
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Возвращает относительное время (например, "5 минут назад")
 * @param date - объект даты
 * @returns строка с относительным временем
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) return 'только что';
  if (diffMin < 60) return `${diffMin} ${pluralize(diffMin, 'минуту', 'минуты', 'минут')} назад`;
  if (diffHour < 24) return `${diffHour} ${pluralize(diffHour, 'час', 'часа', 'часов')} назад`;
  if (diffDay < 7) return `${diffDay} ${pluralize(diffDay, 'день', 'дня', 'дней')} назад`;
  
  return formatDate(date);
};

/**
 * Вспомогательная функция для склонения слов
 * @param number - число для которого нужно выбрать форму
 * @param one - форма для 1
 * @param few - форма для 2-4
 * @param many - форма для 5-20, 0
 */
function pluralize(number: number, one: string, few: string, many: string): string {
  const mod10 = number % 10;
  const mod100 = number % 100;

  if (mod100 >= 11 && mod100 <= 19) {
    return many;
  }

  if (mod10 === 1) {
    return one;
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return few;
  }

  return many;
} 