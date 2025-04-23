import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Button, 
  Table, 
  Space, 
  Modal, 
  Input, 
  message, 
  Typography, 
  Breadcrumb,
  Tooltip,
  Upload,
  Empty,
  Spin,
  Alert,
  Card
} from 'antd';
import { 
  FileAddOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UploadOutlined,
  ExperimentOutlined,
  FileOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Document, getProjectDocuments, createDocument, deleteDocument } from '../../../services/documentService';
import DocViewer from '../../common/DocViewer/DocViewer';
import { useDemoMode } from '../../../contexts/DemoContext';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { 
  useGetProjectDocumentsQuery, 
  useDeleteDocumentMutation, 
  useUpdateDocumentMutation,
  useUploadDocumentMutation 
} from '../../../services/documentsApi';
import { formatFileSize, formatDate } from '../../../utils/format-utils';
import { base64ToBlob } from '../../../utils/document-utils';

import styles from './DocumentsPage.module.scss';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Dragger } = Upload;

enum ModalType {
  NONE,
  VIEW,
  EDIT,
  CREATE,
  DELETE
}

const DocumentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDemoMode } = useDemoMode();
  const { showSuccess, showError } = useNotificationContext();
  
  // Состояния
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newDocumentName, setNewDocumentName] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<{ content: string; name: string } | null>(null);
  
  // RTK Query хуки
  const { data: documentsData = [], isLoading, refetch } = useGetProjectDocumentsQuery(
    id || '', 
    { skip: !id || isDemoMode }
  );
  const [deleteDocument] = useDeleteDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();
  const [uploadDocument] = useUploadDocumentMutation();
  
  // Загрузка списка документов проекта
  useEffect(() => {
    if (!id) return;
    
    loadDocuments();
  }, [id]);
  
  // Проверяем, находимся ли мы на странице загрузки документа
  useEffect(() => {
    const path = window.location.pathname;
    if (path.endsWith('/upload')) {
      // Если мы на странице загрузки, открываем модальное окно создания документа
      openModal(ModalType.CREATE).catch(error => {
        console.error('Ошибка при открытии модального окна:', error);
        showError('Не удалось открыть модальное окно');
      });
    }
  }, [window.location.pathname]);
  
  // Загрузка документов
  const loadDocuments = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Проверка на демо-режим
      if (isDemoMode) {
        // В демо-режиме используем моковые данные
        const mockDocuments: Document[] = [
          {
            id: '1',
            name: 'Техническое задание.docx',
            content: '',
            size: 1024 * 25, // 25 KB
            projectId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Спецификация.docx',
            content: '',
            size: 1024 * 15, // 15 KB
            projectId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        // Получаем сохраненные документы из localStorage
        const savedDocumentsStr = localStorage.getItem('kitstart_demo_documents');
        if (savedDocumentsStr) {
          const savedDocuments = JSON.parse(savedDocumentsStr);
          // Фильтруем документы по projectId
          const projectDocuments = savedDocuments.filter((doc: Document) => doc.projectId === id);
          if (projectDocuments.length > 0) {
            setDocuments(projectDocuments);
            setLoading(false);
            return;
          }
        }
        
        setDocuments(mockDocuments);
        setLoading(false);
        return;
      }
      
      // Только если не в демо-режиме, делаем реальный запрос
      const projectDocuments = await getProjectDocuments(id);
      setDocuments(projectDocuments);
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке документов');
      console.error('Ошибка при загрузке документов:', err);
      
      // В случае ошибки в реальном режиме, используем моковые данные
      if (!isDemoMode) {
        const mockDocuments: Document[] = [
          {
            id: '1',
            name: 'Техническое задание.docx',
            content: '',
            size: 1024 * 25, // 25 KB
            projectId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setDocuments(mockDocuments);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Открытие модального окна
  const openModal = async (type: ModalType, document?: Document) => {
    console.log('Opening modal:', { type, document });
    
    if (document) {
      console.log('Loading document content');
      setSelectedDocument(document);
      setLoading(true);

      try {
        if (isDemoMode) {
          console.log('Demo mode: loading from localStorage');
          const savedContent = localStorage.getItem(`document_${document.id}`);
          console.log('Saved content found:', !!savedContent);
          
          if (savedContent) {
            // Проверяем, что сохраненное содержимое имеет правильный формат
            if (!savedContent.startsWith('data:')) {
              // Если это чистый base64, добавляем правильный MIME-тип
              const mimeType = document.name.toLowerCase().endsWith('.docx') 
                ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                : 'application/msword';
              const contentWithMime = `data:${mimeType};base64,${savedContent}`;
              console.log('Adding MIME type to content:', { mimeType });
              setSelectedDocument(prev => ({
                ...prev!,
                content: contentWithMime
              }));
            } else {
              console.log('Content already has MIME type');
              setSelectedDocument(prev => ({
                ...prev!,
                content: savedContent
              }));
            }
          } else {
            console.log('No saved content, using mock content');
            const mockContent = document.name.includes('Техническое задание') 
              ? `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAIAAAAIQAkYYV7CwEAABICAAALAAAAX3JlbHMvLnJlbHOkkMFqwzAMhu+DvYPRfXGawxijTi+j0GvpHhbJBh24kUy2qN2D3GsvqKV5YW4gtuAkTF7p/vz8nl7D9ZZQAk3hN4fQ61t2CbXFSYBB5044DHDKkv8U1uXHk1w5GKXHWiulLSUEBb6YxHy2dKbq4MZ/r8X8vvV9SADMCCnjY7uhIGw0lF73hM6RCwTCjN/WVV3ZPVWEFzJHmxbGKfNj45wVMFM2DXY0OWQwX6jCs/L9i5nKhmn24zRkwA8+ydSlH/8ZH1X1nQAAAA==`
              : `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAIAAAAIQAkYYV7CwEAABICAAALAAAAX3JlbHMvLnJlbHOkkMFqwzAMhu+DvYPRfXGawxijTi+j0GvpHhbJBh24kUy2qN2D3GsvqKV5YW4gtuAkTF7p/vz8nl7D9ZZQAk3hN4fQ61t2CbXFSYBB5044DHDKkv8U1uXHk1w5GKXHWiulLSUEBr6YxHy2dKbq4MZ/r8X8vvV9SADMCCnjY7uhIGw0lF73hM6RCwTCjN/WVV3ZPVWEFzJHmxbGKfNj45wVMFM2DXY0OWQwX6jCs/L9i5nKhmn24zRkwA8+ydSlH/8ZH1X1nQAAAA==`;
            
            console.log('Using mock content for document:', {
              documentId: document.id,
              documentName: document.name,
              mockContent,
              type
            });
            
            const documentWithMockContent = {
              ...document,
              content: mockContent
            };
            console.log('Setting selected document with mock content:', documentWithMockContent);
            setSelectedDocument(documentWithMockContent);
          }
        } else {
          // В реальном режиме загружаем содержимое с сервера
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}/documents/${document.id}/content`);
          if (!response.ok) {
              throw new Error('Failed to fetch document content');
          }
          const content = await response.text();
            console.log('Fetched document content:', { contentLength: content.length });
            setSelectedDocument(prev => ({
              ...prev!,
            content
            }));
          } catch (error) {
            console.error('Error fetching document content:', error);
            setError('Не удалось загрузить содержимое документа');
          }
        }
      } catch (error) {
        console.error('Error loading document content:', error);
        setError('Не удалось загрузить содержимое документа');
      } finally {
        setLoading(false);
      }
    }
    
    setModalType(type);
    if (type === ModalType.CREATE) {
      setNewDocumentName('');
    }
  };
  
  // Закрытие модального окна
  const closeModal = () => {
    setModalType(ModalType.NONE);
    setSelectedDocument(null);
    setNewDocumentName('');
    setUploadedFile(null);
    
    // Если мы на странице загрузки, перенаправляем обратно на страницу документов
    const path = window.location.pathname;
    if (path.endsWith('/upload')) {
      navigate(`/projects/${id}`);
    }
  };
  
  // Обработка загрузки файла
  const handleFileUpload = (info: any) => {
    console.log('File upload started', info);
    
    // Проверяем, что у нас есть файл
    if (!info.file || !info.file.originFileObj) {
      console.log('No file selected');
      setError('Файл не выбран');
      return;
    }
    
    const file = info.file.originFileObj;
    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Проверяем тип файла
    if (!file.type.includes('word') && !file.name.toLowerCase().endsWith('.doc') && !file.name.toLowerCase().endsWith('.docx')) {
      console.error('Invalid file type');
      setError('Поддерживаются только файлы формата DOC и DOCX');
      return;
    }

      const reader = new FileReader();
      reader.onload = (e) => {
      console.log('File read completed');
        const content = e.target?.result as string;
      console.log('File content length:', content.length);
      
      // Проверяем, что содержимое файла корректно
      if (!content || content.length === 0) {
        console.error('Empty file content');
        setError('Ошибка при чтении файла: пустое содержимое');
        return;
      }

      // Проверяем формат base64
      if (!content.startsWith('data:') || !content.includes('base64')) {
        console.error('Invalid file format');
        setError('Ошибка при чтении файла: неверный формат');
        return;
      }

      // Проверяем размер base64 данных
      const base64Data = content.split(',')[1];
      if (!base64Data || base64Data.length === 0) {
        console.error('Empty base64 data');
        setError('Ошибка при чтении файла: пустые данные');
        return;
      }

      console.log('Setting uploaded file:', {
        name: file.name,
        contentLength: content.length,
        base64Length: base64Data.length
      });
      
        setUploadedFile({
        name: file.name,
        content: content
      });
      setError(null);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setError('Ошибка при чтении файла');
    };

    console.log('Starting file read');
    reader.readAsDataURL(file);
  };
  
  // Создание нового документа
  const handleCreateDocument = async () => {
    console.log('Creating new document');
    
    if (!id) {
      console.error('Project ID is not defined');
      setError('ID проекта не определен');
      return;
    }

    if (!newDocumentName) {
      console.error('Document name is not defined');
      setError('Название документа не указано');
      return;
    }
    
    if (!uploadedFile) {
      console.error('No file uploaded');
      setError('Файл не загружен');
      return;
    }

    // Проверяем содержимое файла перед созданием документа
    if (!uploadedFile.content || uploadedFile.content.length === 0) {
      console.error('Empty file content');
      setError('Ошибка: пустое содержимое файла');
      return;
    }

    // Проверяем формат base64
    if (!uploadedFile.content.startsWith('data:') || !uploadedFile.content.includes('base64')) {
      console.error('Invalid file format');
      setError('Ошибка: неверный формат файла');
      return;
    }

    console.log('Creating document with data:', {
      name: newDocumentName,
      projectId: id,
      contentLength: uploadedFile.content.length,
      base64Length: uploadedFile.content.split(',')[1].length
    });

    try {
      if (isDemoMode) {
        // В демо-режиме создаем документ локально
        const newDoc: Document = {
          id: Date.now().toString(),
          name: newDocumentName,
          content: uploadedFile.content,
          projectId: id,
          size: uploadedFile.content.length * 0.75, // Примерный размер в байтах (base64 занимает ~1.33 байта на символ)
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Очищаем localStorage перед сохранением
        console.log('Cleaning up localStorage');
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
          if (key.startsWith('document_') || key === 'kitstart_demo_documents') {
            localStorage.removeItem(key);
          }
        });
        
        // Создаем новый список документов только с текущим документом
        const demoDocuments: Document[] = [newDoc];
        
        try {
          // Сохраняем список документов
          localStorage.setItem('kitstart_demo_documents', JSON.stringify(demoDocuments));
          
          // Сохраняем содержимое документа с правильным MIME-типом
          const mimeType = uploadedFile.content.split(';')[0].split(':')[1];
          localStorage.setItem(`document_${newDoc.id}`, uploadedFile.content);
          
          console.log('Document saved successfully');
        } catch (error) {
          console.error('Error saving to localStorage:', error);
          // Если все еще не удается сохранить, пробуем сохранить только метаданные
          const docWithoutContent = { ...newDoc, content: '' };
          localStorage.setItem('kitstart_demo_documents', JSON.stringify([docWithoutContent]));
        }
        
        setDocuments(prev => [...prev, newDoc]);
        showSuccess('Документ успешно создан');
        closeModal();
      } else {
        // В реальном режиме отправляем запрос через RTK Query
        await uploadDocument({
          projectId: id,
          content: uploadedFile.content,
          fileName: newDocumentName
        }).unwrap();
        
        showSuccess('Документ успешно создан');
        closeModal();
        await refetch();
      }
    } catch (err: any) {
      showError(err.message || 'Ошибка при создании документа');
      console.error('Ошибка при создании документа:', err);
    }
  };
  
  // Удаление документа
  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;
    
    try {
      if (isDemoMode) {
        // В демо-режиме удаляем документ локально
        // Удаляем документ из списка
        setDocuments(prev => prev.filter(doc => doc.id !== selectedDocument.id));
        
        // Удаляем документ из localStorage
        const demoDocumentsStr = localStorage.getItem('kitstart_demo_documents');
        if (demoDocumentsStr) {
          const demoDocuments = JSON.parse(demoDocumentsStr);
          const updatedDocuments = demoDocuments.filter((doc: Document) => doc.id !== selectedDocument.id);
          localStorage.setItem('kitstart_demo_documents', JSON.stringify(updatedDocuments));
        }
        
        // Удаляем содержимое документа из localStorage
        localStorage.removeItem(`document_${selectedDocument.id}`);
        
        showSuccess('Документ успешно удален');
        closeModal();
        setSelectedDocument(null);
      } else {
        // В реальном режиме отправляем запрос
        await deleteDocument({
          projectId: id || '',
          documentId: selectedDocument.id
        }).unwrap();
        
        showSuccess('Документ успешно удален');
        closeModal();
        setSelectedDocument(null);
        refetch();
      }
    } catch (error) {
      console.error('Ошибка при удалении документа:', error);
      showError('Не удалось удалить документ');
    }
  };
  
  // Сохранение изменений документа
  const handleSaveDocument = async (content: string, fileName: string) => {
    if (!selectedDocument || !id) return;
    
    try {
      if (isDemoMode) {
        // В демо-режиме обновляем документ локально
        const updatedDocument = {
          ...selectedDocument,
          name: fileName,
          content,
          updatedAt: new Date().toISOString()
        };
        
        setDocuments(prev => 
          prev.map(doc => doc.id === selectedDocument.id ? updatedDocument : doc)
        );
        
        setSelectedDocument(updatedDocument);
        showSuccess('Документ успешно обновлен');
      } else {
        // В реальном режиме отправляем запрос
        await updateDocument({
          projectId: id,
          documentId: selectedDocument.id,
          content,
          fileName
        }).unwrap();
        
        showSuccess('Документ успешно обновлен');
        refetch();
        
        const updatedDocument = {
          ...selectedDocument,
          name: fileName,
          content
        };
        setSelectedDocument(updatedDocument);
      }
    } catch (error) {
      console.error('Ошибка при обновлении документа:', error);
      showError('Не удалось обновить документ');
    }
  };
  
  // Колонки таблицы документов
  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <FileOutlined />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: 'Размер',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => formatFileSize(size)
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(new Date(date))
    },
    {
      title: 'Последнее изменение',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => formatDate(new Date(date))
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Document) => (
        <Space size="small">
          <Tooltip title="Просмотреть">
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => {
                openModal(ModalType.VIEW, record).catch(error => {
                  console.error('Ошибка при открытии документа:', error);
                  showError('Не удалось открыть документ');
                });
              }}
            />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => {
                openModal(ModalType.EDIT, record).catch(error => {
                  console.error('Ошибка при открытии документа:', error);
                  showError('Не удалось открыть документ');
                });
              }}
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => {
                openModal(ModalType.DELETE, record).catch(error => {
                  console.error('Ошибка при открытии документа:', error);
                  showError('Не удалось открыть документ');
                });
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ];
  
  // Рендер загрузчика файлов
  const renderUploader = () => (
    <Dragger
      name="file"
      multiple={false}
      showUploadList={false}
      customRequest={({ onSuccess }) => setTimeout(() => onSuccess?.('ok'), 0)}
      onChange={handleFileUpload}
      accept=".doc,.docx"
    >
      <p className="ant-upload-drag-icon">
        <UploadOutlined />
      </p>
      <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
      <p className="ant-upload-hint">
        Поддерживаются файлы в формате DOC и DOCX
      </p>
    </Dragger>
  );
  
  // Возврат к списку проектов
  const handleBackToProjects = () => {
    navigate('/projects');
  };
  
  // Обработчик для открытия модального окна загрузки документа
  const handleUploadClick = () => {
    if (!id) {
      showError('ID проекта не определен');
      return;
    }
    openModal(ModalType.CREATE);
  };
  
  // Показываем индикатор загрузки только если загружаем данные и не в демо-режиме
  if (isLoading && !isDemoMode) {
    return (
      <div className={styles.spinnerContainer}>
        <Spin size="large">
          <div className={styles.spinContainer}>
            <div>Загрузка документов...</div>
          </div>
        </Spin>
      </div>
    );
  }
  
  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Breadcrumb 
          items={[
            { title: <a onClick={() => navigate('/projects')}>Проекты</a> },
            { title: <a onClick={() => navigate(`/projects/${id}`)}>Проект</a> },
            { title: 'Документы' }
          ]} 
          style={{ marginBottom: '16px' }}
        />
        
        {isDemoMode && (
          <Alert
            message="Демо-режим"
            description="Вы работаете в демонстрационном режиме. Все изменения сохраняются только локально."
            type="info"
            showIcon
            icon={<ExperimentOutlined />}
            style={{ marginBottom: 16 }}
          />
        )}
        
        <div className={styles.header}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToProjects}
            className={styles.backButton}
          >
            Вернуться к проектам
          </Button>
          <Title level={2}>Документы проекта</Title>
          <Button
            type="primary"
            icon={<FileAddOutlined />}
            onClick={() => {
              openModal(ModalType.CREATE).catch(error => {
                console.error('Ошибка при открытии модального окна:', error);
                showError('Не удалось открыть модальное окно');
              });
            }}
          >
            Добавить документ
          </Button>
        </div>
        
        {error && (
          <Alert
            message="Ошибка"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}
        
        <Card className={styles.documentsList}>
          <div className={styles.actionsBar}>
            <Button 
              type="primary" 
              icon={<UploadOutlined />}
              onClick={handleUploadClick}
            >
              Загрузить документ
            </Button>
          </div>
          
          {documentsData.length > 0 || documents.length > 0 ? (
            <Table
              columns={columns}
              dataSource={isDemoMode ? documents : documentsData}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              className={styles.documentsTable}
              loading={isLoading && !isDemoMode}
            />
          ) : (
            <div className={styles.emptyState}>
              <p>У этого проекта пока нет документов</p>
              <Button 
                type="primary"
                onClick={handleUploadClick}
              >
                Загрузить первый документ
              </Button>
            </div>
          )}
        </Card>
        
        {/* Модальное окно просмотра документа */}
        <Modal
          title={selectedDocument?.name || 'Просмотр документа'}
          open={modalType === ModalType.VIEW}
          onCancel={closeModal}
          footer={null}
          width={1000}
        >
          {selectedDocument && (
            <DocViewer
              initialContent={selectedDocument.content || ''}
              fileName={selectedDocument.name}
              onSave={handleSaveDocument}
              onDelete={handleDeleteDocument}
            />
          )}
        </Modal>
        
        {/* Модальное окно редактирования документа */}
        <Modal
          title={selectedDocument?.name || 'Редактирование документа'}
          open={modalType === ModalType.EDIT}
          onCancel={closeModal}
          footer={null}
          width={1000}
        >
          {selectedDocument && (
            <DocViewer
              initialContent={selectedDocument.content || ''}
              fileName={selectedDocument.name}
              onSave={handleSaveDocument}
              onDelete={
                async () => {
                  setSelectedDocument(selectedDocument);
                  setModalType(ModalType.DELETE);
                  return Promise.resolve();
                }
              }
            />
          )}
        </Modal>
        
        {/* Модальное окно создания документа */}
        <Modal
          title="Добавить новый документ"
          open={modalType === ModalType.CREATE}
          onCancel={closeModal}
          footer={[
            <Button key="cancel" onClick={closeModal}>
              Отмена
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleCreateDocument}
              disabled={!uploadedFile || !newDocumentName}
            >
              Создать
            </Button>
          ]}
        >
          <div style={{ marginBottom: '16px' }}>
            <Text strong>Название документа</Text>
            <Input
              placeholder="Введите название документа"
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
              style={{ marginTop: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Text strong>Загрузите документ</Text>
            <div style={{ marginTop: '8px' }}>
              {renderUploader()}
            </div>
          </div>
          
          {uploadedFile && (
            <Alert
              message="Файл загружен"
              description={`Файл "${uploadedFile.name}" готов к созданию`}
              type="success"
              showIcon
            />
          )}
        </Modal>
        
        {/* Модальное окно подтверждения удаления */}
        <Modal
          title="Подтверждение удаления"
          open={modalType === ModalType.DELETE}
          onCancel={closeModal}
          footer={[
            <Button key="cancel" onClick={closeModal}>
              Отмена
            </Button>,
            <Button
              key="submit"
              danger
              type="primary"
              onClick={handleDeleteDocument}
            >
              Удалить
            </Button>
          ]}
        >
          <p>Вы уверены, что хотите удалить документ "{selectedDocument?.name}"?</p>
          <p>Это действие невозможно отменить.</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default DocumentsPage; 