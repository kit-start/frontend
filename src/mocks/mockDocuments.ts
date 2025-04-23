/**
 * Моковые данные документов для демонстрации компонента DocViewer
 * 
 * Примечание: В реальном приложении base64 содержимое будет приходить с сервера
 * Здесь представлены короткие строки в качестве примера, в реальности base64 будет длиннее
 */

// Интерфейс документа
export interface MockDocument {
  id: string;
  name: string;
  content: string; // base64 содержимое
  createdAt: Date;
  updatedAt: Date;
  size: number; // размер в байтах
}

/**
 * Создает моковую строку base64, имитирующую документ
 * Примечание: В реальном приложении, это будет актуальный base64 контент документа
 */
const createMockBase64 = (type: 'doc' | 'docx') => {
  // В реальном приложении эта строка будет очень длинной и содержать реальные закодированные данные
  // Эта заглушка используется только для демонстрации интерфейса
  const prefix = type === 'docx' 
    ? 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' 
    : 'data:application/msword;base64,';
  
  // В реальности, здесь будет длинная base64 строка
  return `${prefix}bW9ja0RvY3VtZW50Q29udGVudA==`;
};

/**
 * Моковые документы
 */
export const mockDocuments: MockDocument[] = [
  {
    id: '1',
    name: 'Отчет за первый квартал.docx',
    content: createMockBase64('docx'),
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-15'),
    size: 1024 * 45 // 45 KB
  },
  {
    id: '2',
    name: 'Инструкция по эксплуатации.doc',
    content: createMockBase64('doc'),
    createdAt: new Date('2023-02-23'),
    updatedAt: new Date('2023-03-10'),
    size: 1024 * 120 // 120 KB
  },
  {
    id: '3',
    name: 'Договор с поставщиком.docx',
    content: createMockBase64('docx'),
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2023-05-20'),
    size: 1024 * 75 // 75 KB
  },
  {
    id: '4',
    name: 'Техническая спецификация.doc',
    content: createMockBase64('doc'),
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-04-30'),
    size: 1024 * 210 // 210 KB
  },
  {
    id: '5',
    name: 'Презентация проекта.docx',
    content: createMockBase64('docx'),
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2023-06-07'),
    size: 1024 * 320 // 320 KB
  }
];

/**
 * Получение документа по ID
 */
export const getMockDocumentById = (id: string): MockDocument | undefined => {
  return mockDocuments.find(doc => doc.id === id);
};

/**
 * Форматирование размера файла в удобочитаемом виде
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' байт';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
  return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
};

/**
 * Форматирование даты
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}; 