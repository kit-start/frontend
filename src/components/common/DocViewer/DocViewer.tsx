import React, { useRef, useEffect, useState } from 'react';
import { Button, Space, Typography, Spin, Alert, Upload, message, Input } from 'antd';
import { UploadOutlined, DownloadOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { 
  getDocumentType, 
  DocumentType, 
  base64ToBlob, 
  previewDocx, 
  previewDoc, 
  downloadDocument 
} from '../../../utils/document-utils';
import { useNotificationContext } from '../../../contexts/NotificationContext';

import styles from './DocViewer.module.scss';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

interface DocViewerProps {
  initialContent: string;  // base64 содержимое документа
  fileName: string;        // имя файла
  readOnly?: boolean;      // режим только для чтения
  onSave?: (content: string, fileName: string) => Promise<void>; // колбэк сохранения
  onDelete?: () => Promise<void>; // колбэк удаления
}

const DocViewer: React.FC<DocViewerProps> = ({
  initialContent,
  fileName,
  readOnly = false,
  onSave,
  onDelete
}) => {
  const { showError, showSuccess, showWarning } = useNotificationContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [fileContent, setFileContent] = useState<string>(initialContent);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [documentName, setDocumentName] = useState(fileName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editableContent, setEditableContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  // Функция для генерации демо-контента
  const generateDemoContent = (name: string) => {
    if (name.toLowerCase().includes('техническое задание')) {
      return `# Техническое задание на разработку веб-приложения

## 1. Общие сведения
### 1.1 Наименование системы
Веб-приложение для управления проектами "ProjectManager"

### 1.2 Назначение системы
Система предназначена для управления проектами, задачами и документами в рамках организации.

## 2. Требования к системе
### 2.1 Функциональные требования
- Управление проектами (создание, редактирование, удаление)
- Управление задачами (создание, назначение, отслеживание статуса)
- Управление документами (загрузка, просмотр, редактирование)
- Управление пользователями и ролями`;
    } else if (name.toLowerCase().includes('спецификация')) {
      return `# Спецификация проекта

## Основные компоненты
- Фронтенд: React, TypeScript, Ant Design
- Бэкенд: Node.js, Express, MongoDB
- Аутентификация: JWT

## Архитектура системы
Система построена на микросервисной архитектуре с отдельными сервисами для:
- Управления пользователями
- Управления проектами
- Управления документами
- Аналитики`;
    } else {
      return `# Документ: ${name}

## Содержание
Это демонстрационный документ, созданный для тестирования функционала просмотра и редактирования.

## Возможности
1. Просмотр документа
2. Редактирование содержимого
3. Загрузка нового файла
4. Сохранение изменений`;
    }
  };

  // Рендеринг документа при первой загрузке и при изменении контента
  useEffect(() => {
    const renderDocument = async () => {
      if (!containerRef.current) return;

      try {
        setLoading(true);
        setErrorMessage(null);
        
        // Проверяем, есть ли сохраненный текст для этого документа в localStorage
        const savedText = localStorage.getItem(`document_${fileName}`);
        if (savedText) {
          setEditableContent(savedText);
          if (!isEditing) {
            containerRef.current.innerHTML = savedText.replace(/\n/g, '<br>');
          }
          setLoading(false);
          return;
        }

        // В демо-режиме или при отсутствии контента используем моковые данные
        if (!fileContent || fileContent === 'demo') {
          const demoContent = generateDemoContent(fileName);
          setEditableContent(demoContent);
          if (!isEditing && containerRef.current) {
            containerRef.current.innerHTML = demoContent.replace(/\n/g, '<br>');
          }
          setLoading(false);
          return;
        }

        // Проверяем валидность base64 контента
        if (!fileContent.startsWith('data:') && !fileContent.includes('base64')) {
          throw new Error('Некорректный формат содержимого документа');
        }
        
        const documentType = getDocumentType(documentName);
        const blob = base64ToBlob(fileContent);
        
        // Очищаем контейнер перед рендерингом
        if (!isEditing) {
          containerRef.current.innerHTML = '';
        }
        
        let content: string;
        
        if (documentType === DocumentType.DOCX) {
          content = await previewDocx(blob, containerRef.current);
        } else if (documentType === DocumentType.DOC) {
          content = await previewDoc(blob, containerRef.current);
        } else {
          throw new Error(`Неподдерживаемый тип документа: ${documentType}`);
        }

        if (!content) {
          throw new Error('Не удалось извлечь текст из документа');
        }

        setEditableContent(content);
        if (!isEditing && containerRef.current) {
          containerRef.current.innerHTML = content.replace(/\n/g, '<br>');
        }
      } catch (error) {
        console.error('Ошибка при рендеринге документа:', error);
        
        // Генерируем демо-контент в случае ошибки
        const demoContent = generateDemoContent(fileName);
        setEditableContent(demoContent);
        if (!isEditing && containerRef.current) {
          containerRef.current.innerHTML = demoContent.replace(/\n/g, '<br>');
        }
        
        setErrorMessage('Используется демонстрационный контент, так как не удалось загрузить оригинальный документ');
      } finally {
        setLoading(false);
      }
    };

    renderDocument();
  }, [fileContent, fileName]);

  // Обработчик скачивания документа
  const handleDownload = () => {
    try {
      downloadDocument(fileContent, documentName);
      showSuccess('Документ подготовлен для скачивания');
    } catch (error) {
      console.error('Ошибка при скачивании документа:', error);
      showError('Не удалось скачать документ');
    }
  };

  // Обработчик удаления документа
  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      await onDelete();
    } catch (error) {
      console.error('Ошибка при удалении документа:', error);
      showError('Не удалось удалить документ');
    }
  };

  // Обработчик входа в режим редактирования
  const handleEdit = () => {
    setIsEditing(true);
    // При входе в режим редактирования используем сохраненный текст
    const savedText = localStorage.getItem(`document_${fileName}`) || editableContent;
    setEditableContent(savedText);
  };

  // Обработчик сохранения документа
  const handleSave = async () => {
    if (!onSave) {
      showWarning('Функция сохранения не предоставлена');
      return;
    }
    
    try {
      // Если есть загруженный файл, используем его
      if (fileList.length > 0) {
        const file = fileList[0].originFileObj;
        if (!file) {
          showWarning('Файл не найден');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target?.result as string;
          await onSave(content, file.name);
          setFileContent(content);
          setDocumentName(file.name);
          setIsEditing(false);
          setFileList([]);
          showSuccess('Документ успешно сохранен');
        };
        
        reader.readAsDataURL(file);
      } else {
        // Если нет загруженного файла, сохраняем отредактированный текст
        // Сохраняем текст в localStorage для демо-режима
        localStorage.setItem(`document_${fileName}`, editableContent);
        
        // В реальном приложении здесь должна быть конвертация текста в DOCX
        await onSave(editableContent, documentName);
        setIsEditing(false);
        showSuccess('Документ успешно сохранен');
      }
    } catch (error) {
      console.error('Ошибка при сохранении документа:', error);
      showError('Не удалось сохранить документ');
    }
  };

  // Обработчик отмены редактирования
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFileList([]);
  };

  // Обработчик загрузки файла
  const handleUploadChange = (info: any) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    newFileList = newFileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };

  // Проверка перед загрузкой файла
  const beforeUpload = (file: File) => {
    const isDocOrDocx = file.type === 'application/msword' || 
                        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (!isDocOrDocx) {
      message.error('Можно загружать только документы формата DOC или DOCX');
      return Upload.LIST_IGNORE;
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Размер файла не должен превышать 5MB');
      return Upload.LIST_IGNORE;
    }
    
    return false;
  };

  return (
    <div className={styles.docViewer}>
      <div className={styles.header}>
        <Title level={4}>{documentName}</Title>
        
        <Space>
          {!readOnly && !isEditing && (
            <>
              <Button 
                icon={<EditOutlined />} 
                onClick={handleEdit}
                disabled={loading}
              >
                Редактировать
              </Button>
              
              <Button 
                icon={<DownloadOutlined />} 
                onClick={handleDownload}
                disabled={loading}
              >
                Скачать
              </Button>
              
              {onDelete && (
                <Button 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Удалить
                </Button>
              )}
            </>
          )}
          
          {isEditing && (
            <>
              <Upload
                beforeUpload={beforeUpload}
                onChange={handleUploadChange}
                fileList={fileList}
                accept=".doc,.docx"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Загрузить новый файл</Button>
              </Upload>
              
              <Button 
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
              >
                Сохранить
              </Button>
              
              <Button onClick={handleCancelEdit}>
                Отмена
              </Button>
            </>
          )}
        </Space>
      </div>

      {loading && (
        <div className={styles.spinner}>
          <Spin size="large" />
        </div>
      )}

      {errorMessage && (
        <Alert
          className={styles.error}
          message="Ошибка"
          description={errorMessage}
          type="error"
          showIcon
        />
      )}

      {!loading && !errorMessage && (
        isEditing ? (
          <div className={styles.editorContainer}>
            <TextArea
              className={styles.editor}
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              autoSize={{ minRows: 10 }}
            />
          </div>
        ) : (
          <div className={styles.documentContainer} ref={containerRef} />
        )
      )}
    </div>
  );
};

export default DocViewer; 