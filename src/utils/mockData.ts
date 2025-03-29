/**
 * Моковые данные для использования, когда API сервер недоступен
 */

import { ActionType, ProjectInfoApiResponse, Project } from "../components/pages/ProjectsPage/model/projectsApiSlice";
import type { Field } from "../components/pages/ProjectsPage/model/fieldsApiSlice";

// Моковые проекты для демонстрационного режима
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Демо-проект 1',
    progress: 35,
    created_at: new Date().toISOString(),
    edited_at: new Date().toISOString(),
    field: { id: "1", name: "Индустриальный проект", info: "Проекты промышленного сектора" }
  },
  {
    id: '2',
    name: 'Демо-проект 2',
    progress: 75,
    created_at: new Date(Date.now() - 86400000).toISOString(), // Вчера
    edited_at: new Date(Date.now() - 86400000).toISOString(),
    field: { id: "2", name: "Исследовательский проект", info: "Научно-исследовательские проекты" }
  },
  {
    id: '3',
    name: 'Демо-проект 3',
    progress: 10,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // Позавчера
    edited_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    field: { id: "3", name: "Образовательный проект", info: "Образовательные проекты" }
  },
  {
    id: '4',
    name: 'Демо-проект 4',
    progress: 0,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 дней назад
    edited_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    field: { id: "4", name: "Инфраструктурный проект", info: "Инфраструктурные проекты" }
  },
];

// Моковые поля для создания проектов
const mockFields = [
  {
    id: "1",
    name: 'Индустриальный проект',
    info: 'Проекты промышленного сектора'
  },
  {
    id: "2",
    name: 'Исследовательский проект',
    info: 'Научно-исследовательские проекты'
  },
  {
    id: "3",
    name: 'Образовательный проект',
    info: 'Образовательные проекты'
  },
  {
    id: "4",
    name: 'Инфраструктурный проект',
    info: 'Инфраструктурные проекты'
  },
];

/**
 * Получить моковый список проектов
 */
export const getMockProjects = (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockProjects]);
    }, 300); // Имитация задержки сети
  });
};

/**
 * Получить моковые поля для создания проектов
 */
export const getMockFields = (): Promise<{ id: string; name: string; info: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockFields]);
    }, 200); // Имитация задержки сети
  });
};

/**
 * Получить детальную информацию о моковом проекте по ID
 */
export const getMockProject = (id: string): Promise<ProjectInfoApiResponse | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = mockProjects.find((p) => p.id === id);
      
      if (!project) {
        resolve(null);
        return;
      }
      
      // Создаем расширенную информацию о проекте
      const projectInfo: ProjectInfoApiResponse = {
        ...project,
        field: {
          ...project.field,
          sections: [
            {
              id: 1,
              name: "Основная информация",
              progress: 0,
              actions: [
                {
                  id: 1,
                  name: "Описание проекта",
                  info: "Здесь должно быть описание проекта",
                  type: ActionType.CONTENT,
                  done: false
                },
                {
                  id: 2,
                  name: "Документация",
                  info: "Здесь можно вводить документацию проекта",
                  type: ActionType.DOCUMENT,
                  done: false
                }
              ]
            }
          ]
        }
      };
      
      resolve(projectInfo);
    }, 500); // Имитация задержки сети
  });
};

/**
 * Добавить новый демо-проект в моковые данные
 */
export const addMockProject = (
  name: string, 
  fieldId: string
): Promise<Project> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const field = mockFields.find(f => f.id === fieldId);
      if (!field) {
        throw new Error('Поле не найдено');
      }
      
      const newId = String(mockProjects.length + 1);
      const newProject: Project = {
        id: newId,
        name,
        progress: 0,
        created_at: new Date().toISOString(),
        edited_at: new Date().toISOString(),
        field: field
      };
      
      mockProjects.unshift(newProject); // Добавляем в начало списка
      
      resolve(newProject);
    }, 300); // Имитация задержки сети
  });
};

// Моковые данные для документов
export interface MockDocument {
  id: string;
  name: string;
  content: string; // base64 закодированное содержимое
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

// Пример base64-encoded документа (короткий для примера)
const demoDocBase64 = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAIAAAAIQA=';

// Моковые документы для проектов
const mockDocuments: MockDocument[] = [
  {
    id: 'd1',
    name: 'Техническое задание.docx',
    content: demoDocBase64,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 дней назад
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 дня назад
    projectId: '1'
  },
  {
    id: 'd2',
    name: 'План работ.doc',
    content: demoDocBase64,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 дня назад
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 день назад
    projectId: '1'
  },
  {
    id: 'd3',
    name: 'Презентация проекта.docx',
    content: demoDocBase64,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 дня назад
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 день назад
    projectId: '2'
  }
];

/**
 * Получить моковые документы для проекта
 */
export const getMockDocuments = (projectId: string): Promise<MockDocument[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDocuments.filter(doc => doc.projectId === projectId));
    }, 300); // Имитация задержки сети
  });
};

/**
 * Получить моковый документ по ID
 */
export const getMockDocument = (id: string): Promise<MockDocument | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDocuments.find(doc => doc.id === id) || null);
    }, 300); // Имитация задержки сети
  });
};

/**
 * Создать новый моковый документ
 */
export const createMockDocument = (
  name: string, 
  content: string, 
  projectId: string
): Promise<MockDocument> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date().toISOString();
      const newDoc: MockDocument = {
        id: `d${mockDocuments.length + 1}`,
        name,
        content,
        createdAt: now,
        updatedAt: now,
        projectId
      };
      
      mockDocuments.push(newDoc);
      resolve(newDoc);
    }, 300); // Имитация задержки сети
  });
};

/**
 * Обновить моковый документ
 */
export const updateMockDocument = (
  id: string,
  updates: Partial<MockDocument>
): Promise<MockDocument> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDocuments.findIndex(doc => doc.id === id);
      if (index === -1) {
        reject(new Error('Документ не найден'));
        return;
      }
      
      const updatedDoc = {
        ...mockDocuments[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      mockDocuments[index] = updatedDoc;
      resolve(updatedDoc);
    }, 300); // Имитация задержки сети
  });
};

/**
 * Удалить моковый документ
 */
export const deleteMockDocument = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDocuments.findIndex(doc => doc.id === id);
      if (index === -1) {
        reject(new Error('Документ не найден'));
        return;
      }
      
      mockDocuments.splice(index, 1);
      resolve();
    }, 300); // Имитация задержки сети
  });
}; 