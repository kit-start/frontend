# Компонент просмотра документов

Демонстрационный проект для компонента просмотра и редактирования документов, созданный с использованием React, TypeScript и Ant Design.

## Возможности

- Просмотр документов в форматах DOC и DOCX
- Скачивание документов
- Загрузка и обновление документов
- Удаление документов
- Адаптивный дизайн для мобильных устройств

## Структура проекта

```
src/
├── components/
│   ├── common/
│   │   └── DocViewer/
│   │       ├── DocViewer.tsx           # Основной компонент просмотра документов
│   │       └── DocViewer.module.scss   # Стили компонента
│   └── DocumentsDemo/
│       ├── DocumentsDemo.tsx           # Демонстрационная страница с таблицей документов
│       └── DocumentsDemo.module.scss   # Стили для демонстрационной страницы
├── contexts/
│   └── NotificationContext.tsx         # Контекст для отображения уведомлений
├── mocks/
│   └── mockDocuments.ts                # Моковые данные для демонстрации
├── utils/
│   └── document-utils.ts               # Утилиты для работы с документами
├── App.tsx                             # Основной компонент приложения
├── App.css                             # Глобальные стили приложения
└── index.tsx                           # Точка входа в приложение
```

## Используемые технологии

- React 18
- TypeScript
- Ant Design 5
- Sass для стилизации
- Библиотеки для работы с документами:
  - mammoth.js: преобразование DOC в HTML
  - docx-preview: просмотр DOCX документов
  - file-saver: скачивание файлов

## Как запустить проект

1. Установите зависимости:
   ```
   npm install
   ```

2. Запустите проект:
   ```
   npm start
   ```

3. Откройте браузер и перейдите по адресу:
   ```
   http://localhost:3000
   ```

## Использование компонента DocViewer

Компонент DocViewer может быть легко интегрирован в любое React-приложение:

```jsx
import DocViewer from './components/common/DocViewer/DocViewer';

// В вашем компоненте
<DocViewer
  initialContent={base64Content}
  fileName="document.docx"
  readOnly={false}
  onSave={handleSaveDocument}
  onDelete={handleDeleteDocument}
/>
```

## Лицензия

MIT
