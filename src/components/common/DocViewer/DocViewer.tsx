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
  isDemoMode?: boolean;    // режим демонстрации
}

const DocViewer: React.FC<DocViewerProps> = ({
  initialContent,
  fileName,
  readOnly = false,
  onSave,
  onDelete,
  isDemoMode = false
}) => {
  const { showError, showSuccess, showWarning } = useNotificationContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [documentName, setDocumentName] = useState(fileName);
  const [editableContent, setEditableContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isContainerReady, setIsContainerReady] = useState(false);
  const [selectionState, setSelectionState] = useState<{
    start: number;
    isDeletion: boolean;
  } | null>(null);

  // Эффект для монтирования компонента
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      setIsContainerReady(false);
    };
  }, []);

  // Эффект для проверки готовности контейнера
  useEffect(() => {
    if (isMounted && containerRef.current) {
      setIsContainerReady(true);
    }
  }, [isMounted, containerRef.current]);

  // Эффект для обработки initialContent
  useEffect(() => {
    if (!containerRef.current) return;

    setFileContent(initialContent);
    setError(null);

    // Проверяем наличие сохраненного текста
    const savedText = localStorage.getItem(`document_${documentName}`);
    if (savedText) {
      console.log('Using saved content from localStorage');
      setEditableContent(savedText);
      containerRef.current.innerHTML = savedText;
      return;
    }

    if (!initialContent) {
      console.log('No content, using demo content');
      const demoContent = generateDemoContent(documentName);
      setEditableContent(demoContent);
      containerRef.current.innerHTML = demoContent;
      return;
    }

    // Если есть initialContent, сразу отображаем его
    try {
      const blob = base64ToBlob(initialContent);
      const section = document.createElement('section');
      section.className = 'docx-preview';
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(section);

      if (documentName.toLowerCase().endsWith('.docx')) {
        previewDocx(blob, section).then(htmlContent => {
          setEditableContent(htmlContent);
          localStorage.setItem(`document_${documentName}`, htmlContent);
        });
      } else {
        previewDoc(blob, section).then(htmlContent => {
          setEditableContent(htmlContent);
          localStorage.setItem(`document_${documentName}`, htmlContent);
        });
      }
    } catch (error) {
      console.error('Error rendering document:', error);
      setError('Ошибка при отображении документа');
      const demoContent = generateDemoContent(documentName);
      setEditableContent(demoContent);
      containerRef.current.innerHTML = demoContent;
    }
  }, [initialContent, documentName]);

  // Обновляем documentName при изменении fileName
  useEffect(() => {
    setDocumentName(fileName);
  }, [fileName]);

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
    if (containerRef.current) {
      const currentContent = containerRef.current.innerHTML;
      setEditableContent(currentContent);
    }
  };

  // Сохранение состояния выделения
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const editableDiv = document.querySelector('[contenteditable="true"]');
      
      if (editableDiv) {
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editableDiv);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        
        setSelectionState({
          start: preCaretRange.toString().length,
          isDeletion: false
        });
      }
    }
  };

  // Обработчик нажатия клавиш
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const editableDiv = document.querySelector('[contenteditable="true"]');
      
      if (editableDiv) {
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editableDiv);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        
        setSelectionState({
          start: preCaretRange.toString().length,
          isDeletion: e.key === 'Backspace' || e.key === 'Delete'
        });
      }
    }
  };

  // Восстановление состояния выделения
  const restoreSelection = () => {
    if (!selectionState) return;

    const selection = window.getSelection();
    if (!selection) return;

    const editableDiv = document.querySelector('[contenteditable="true"]');
    if (!editableDiv) return;

    try {
      const range = document.createRange();
      const textLength = editableDiv.textContent?.length || 0;
      
      const start = selectionState.isDeletion 
        ? Math.min(selectionState.start - 1, textLength)
        : Math.min(selectionState.start + 1, textLength);
      
      let pos = 0;
      let found = false;
      
      const walker = document.createTreeWalker(
        editableDiv,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let node;
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent?.length || 0;
        
        if (!found && pos + nodeLength >= start) {
          range.setStart(node, start - pos);
          range.collapse(true);
          found = true;
          break;
        }
        
        pos += nodeLength;
      }
      
      if (!found) {
        range.selectNodeContents(editableDiv);
        range.collapse(false);
      }
      
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (error) {
      console.warn('Ошибка при восстановлении позиции курсора:', error);
      const range = document.createRange();
      range.selectNodeContents(editableDiv);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Обработчик сохранения документа
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (editableContent) {
        // Сохраняем текст в localStorage
        localStorage.setItem(`document_${documentName}`, editableContent);
        
        // Обновляем содержимое документа
        if (containerRef.current) {
          containerRef.current.innerHTML = editableContent;
        }
        
        // Вызываем onSave с новым содержимым
        if (onSave) {
          await onSave(editableContent, documentName);
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при сохранении документа:', error);
      setError('Не удалось сохранить документ');
    } finally {
      setLoading(false);
    }
  };

  // Обработчик отмены редактирования
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Восстанавливаем оригинальное содержимое
    if (containerRef.current) {
      const currentContent = containerRef.current.innerHTML;
      containerRef.current.innerHTML = currentContent;
    }
  };

  // Обработчик загрузки файла
  const handleFileUpload = async (info: any) => {
    try {
      setLoading(true);
      setError(null);

      if (!info.file) {
        console.error('No file object found');
        setError('Ошибка при загрузке файла');
        return;
      }

      const file = info.file.originFileObj;
      if (!file) {
        console.error('No file object found');
        setError('Ошибка при загрузке файла');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          if (content) {
            setFileContent(content);
            setFileList([info.file]);
            setError(null);
          }
        } catch (error) {
          console.error('Error processing file:', error);
          setError('Ошибка при обработке файла');
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setError('Ошибка при чтении файла');
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      setError('Ошибка при загрузке файла');
    } finally {
      setLoading(false);
    }
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
                onChange={handleFileUpload}
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
          <Spin size="large">
            <div style={{ 
              padding: '20px', 
              textAlign: 'center',
              color: '#1890ff'
            }}>
              Загрузка документа...
            </div>
          </Spin>
        </div>
      )}

      {error && (
        <Alert
          className={styles.error}
          message="Ошибка"
          description={error}
          type="error"
          showIcon
        />
      )}

      {!loading && !error && (
        <>
          {isEditing ? (
            <div 
              contentEditable={true}
              dangerouslySetInnerHTML={{ __html: editableContent }}
              onKeyDown={(e) => {
                handleKeyDown(e);
              }}
              onMouseUp={saveSelection}
              onInput={(e) => {
                const newContent = e.currentTarget.innerHTML;
                setEditableContent(newContent);
                
                requestAnimationFrame(() => {
                  restoreSelection();
                });
              }}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '500px',
                overflow: 'auto',
                backgroundColor: '#fff',
                padding: '20px',
                border: '1px solid #f0f0f0',
                borderRadius: '4px'
              }}
            />
          ) : (
            <div 
              ref={containerRef}
              className="document-container"
              style={{
                width: '100%',
                height: '100%',
                minHeight: '500px',
                overflow: 'auto',
                backgroundColor: '#fff',
                padding: '20px',
                border: '1px solid #f0f0f0',
                borderRadius: '4px'
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DocViewer; 