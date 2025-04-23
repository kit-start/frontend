import { getToken } from '../utils/token-utils';

// Базовый URL API
const API_URL = 'https://kitstart.ismit.ru/api';

// Интерфейсы для работы с документами
export interface Document {
  id: string;
  name: string;
  content: string; // base64 encoded document
  createdAt: string;
  updatedAt: string;
  projectId: string;
  size?: number; // Размер документа в байтах
}

// Типы запросов для документов
export interface CreateDocumentRequest {
  name: string;
  content: string; // base64 encoded document
  projectId: string;
}

export interface UpdateDocumentRequest {
  id: string;
  name?: string;
  content?: string; // base64 encoded document
}

// Локальное хранилище для демо-режима
const DEMO_DOCUMENTS_KEY = 'kitstart_demo_documents';
// Ключ для localStorage, хранящий состояние демо-режима
const DEMO_MODE_KEY = 'kitstart_demo_mode';

// Функция для проверки демо-режима без использования хука
const isDemoModeEnabled = (): boolean => {
  return localStorage.getItem(DEMO_MODE_KEY) === 'true';
};

// Получить документы проекта
export const getProjectDocuments = async (projectId: string): Promise<Document[]> => {
  // Проверка демо-режима без использования хука
  if (isDemoModeEnabled()) {
    return getDemoDocuments(projectId);
  }
  
  try {
    const response = await fetch(`${API_URL}/projects/${projectId}/documents`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка при получении документов: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении документов:', error);
    return getDemoDocuments(projectId); // Используем демо в случае ошибки
  }
};

// Получить документ по ID
export const getDocument = async (id: string): Promise<Document> => {
  // Проверка демо-режима без использования хука
  if (isDemoModeEnabled()) {
    const doc = await getDemoDocument(id);
    if (!doc) {
      throw new Error('Документ не найден');
    }
    return doc;
  }
  
  try {
    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка при получении документа: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении документа:', error);
    const doc = await getDemoDocument(id);
    if (!doc) {
      throw new Error('Документ не найден');
    }
    return doc;
  }
};

// Создать новый документ
export const createDocument = async (document: CreateDocumentRequest): Promise<Document> => {
  // Проверка демо-режима без использования хука
  if (isDemoModeEnabled()) {
    return createDemoDocument(document);
  }
  
  try {
    const response = await fetch(`${API_URL}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(document)
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка при создании документа: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при создании документа:', error);
    return createDemoDocument(document);
  }
};

// Обновить документ
export const updateDocument = async (document: UpdateDocumentRequest): Promise<Document> => {
  // Проверка демо-режима без использования хука
  if (isDemoModeEnabled()) {
    return updateDemoDocument(document);
  }
  
  try {
    const response = await fetch(`${API_URL}/documents/${document.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(document)
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка при обновлении документа: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при обновлении документа:', error);
    return updateDemoDocument(document);
  }
};

// Удалить документ
export const deleteDocument = async (id: string): Promise<void> => {
  // Проверка демо-режима без использования хука
  if (isDemoModeEnabled()) {
    return deleteDemoDocument(id);
  }
  
  try {
    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка при удалении документа: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Ошибка при удалении документа:', error);
    return deleteDemoDocument(id);
  }
};

// ===== ДЕМО ФУНКЦИИ =====

// Получить все демо-документы из localStorage
const getDemoDocuments = async (projectId: string): Promise<Document[]> => {
  const demoDocumentsStr = localStorage.getItem(DEMO_DOCUMENTS_KEY);
  const demoDocuments: Document[] = demoDocumentsStr ? JSON.parse(demoDocumentsStr) : [];
  
  // Фильтрация по projectId
  return demoDocuments.filter(doc => doc.projectId === projectId);
};

// Получить один демо-документ по ID
const getDemoDocument = async (id: string): Promise<Document | null> => {
  const demoDocumentsStr = localStorage.getItem(DEMO_DOCUMENTS_KEY);
  const demoDocuments: Document[] = demoDocumentsStr ? JSON.parse(demoDocumentsStr) : [];
  
  return demoDocuments.find(doc => doc.id === id) || null;
};

// Создать демо-документ
const createDemoDocument = async (document: CreateDocumentRequest): Promise<Document> => {
  const demoDocumentsStr = localStorage.getItem(DEMO_DOCUMENTS_KEY);
  const demoDocuments: Document[] = demoDocumentsStr ? JSON.parse(demoDocumentsStr) : [];
  
  // Генерация нового ID
  const newId = Date.now().toString();
  const now = new Date().toISOString();
  
  // Создание нового документа
  const newDocument: Document = {
    id: newId,
    name: document.name,
    content: document.content,
    createdAt: now,
    updatedAt: now,
    projectId: document.projectId
  };
  
  // Добавление в список
  demoDocuments.push(newDocument);
  localStorage.setItem(DEMO_DOCUMENTS_KEY, JSON.stringify(demoDocuments));
  
  return newDocument;
};

// Обновить демо-документ
const updateDemoDocument = async (document: UpdateDocumentRequest): Promise<Document> => {
  const demoDocumentsStr = localStorage.getItem(DEMO_DOCUMENTS_KEY);
  const demoDocuments: Document[] = demoDocumentsStr ? JSON.parse(demoDocumentsStr) : [];
  
  // Поиск документа для обновления
  const index = demoDocuments.findIndex(doc => doc.id === document.id);
  if (index === -1) {
    throw new Error('Документ не найден');
  }
  
  // Обновление документа
  const updatedDocument: Document = {
    ...demoDocuments[index],
    ...document,
    updatedAt: new Date().toISOString()
  };
  
  demoDocuments[index] = updatedDocument;
  localStorage.setItem(DEMO_DOCUMENTS_KEY, JSON.stringify(demoDocuments));
  
  return updatedDocument;
};

// Удалить демо-документ
const deleteDemoDocument = async (id: string): Promise<void> => {
  const demoDocumentsStr = localStorage.getItem(DEMO_DOCUMENTS_KEY);
  const demoDocuments: Document[] = demoDocumentsStr ? JSON.parse(demoDocumentsStr) : [];
  
  // Фильтрация документов
  const updatedDocuments = demoDocuments.filter(doc => doc.id !== id);
  localStorage.setItem(DEMO_DOCUMENTS_KEY, JSON.stringify(updatedDocuments));
}; 