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
import { useGetProjectDocumentsQuery, useDeleteDocumentMutation, useUpdateDocumentMutation } from '../../../services/documentsApi';
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
  const { projectId } = useParams<{ projectId: string }>();
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
    projectId || '', 
    { skip: !projectId || isDemoMode }
  );
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  const [updateDocument, { isLoading: isUpdating }] = useUpdateDocumentMutation();
  
  // Загрузка списка документов проекта
  useEffect(() => {
    if (!projectId) return;
    
    loadDocuments();
  }, [projectId]);
  
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
    if (!projectId) return;
    
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
            projectId: projectId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Спецификация.docx',
            content: '',
            size: 1024 * 15, // 15 KB
            projectId: projectId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setDocuments(mockDocuments);
        setLoading(false);
        return;
      }
      
      // Только если не в демо-режиме, делаем реальный запрос
      const projectDocuments = await getProjectDocuments(projectId);
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
            projectId: projectId,
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
    if (document && (type === ModalType.VIEW || type === ModalType.EDIT)) {
      try {
        setLoading(true);
        // В демо-режиме используем моковое содержимое
        if (isDemoMode) {
          // Используем более полное моковое содержимое для демонстрации
          const mockContent = document.name.includes('Техническое задание') 
            ? `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAIAAAAIQAkYYV7CwEAABICAAALAAAAX3JlbHMvLnJlbHOkkMFqwzAMhu+DvYPRfXGawxijTi+j0GvpHhbJBh24kUy2qN2D3GsvqKV5YW4gtuAkTF7p/vz8nl7D9ZZQAk3hN4fQ61t2CbXFSYBB5044DHDKkv8U1uXHk1w5GKXHWiulLSUEBb6YxHy2dKbq4MZ/r8X8vvV9SADMCCnjY7uhIGw0lF73hM6RCwTCjN/WVV3ZPVWEFzJHmxbGKfNj45wVMFM2DXY0OWQwX6jCs/L9i5nKhmn24zRkwA8+ydSlH/8ZH1X1nQAAAA==`
            : `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAIAAAAIQAkYYV7CwEAABICAAALAAAAX3JlbHMvLnJlbHOkkMFqwzAMhu+DvYPRfXGawxijTi+j0GvpHhbJBh24kUy2qN2D3GsvqKV5YW4gtuAkTF7p/vz8nl7D9ZZQAk3hN4fQ61t2CbXFSYBB5044DHDKkv8U1uXHk1w5GKXHWiulLSUEBr6YxHy2dKbq4MZ/r8X8vvV9SADMCCnjY7uhIGw0lF73hM6RCwTCjN/WVV3ZPVWEFzJHmxbGKfNj45wVMFM2DXY0OWQwX6jCs/L9i5nKhmn24zRkwA8+ydSlH/8ZH1X1nQAAAA==`;
          
          // Определяем тип документа и извлекаем текст
          let mockText = '';
          if (document.name.endsWith('.docx')) {
            mockText = document.name.includes('Техническое задание') 
              ? `# Техническое задание на разработку веб-приложения

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
- Управление пользователями и ролями

### 2.2 Нефункциональные требования
- Высокая производительность
- Безопасность данных
- Масштабируемость
- Удобный пользовательский интерфейс

## 3. Сроки реализации
- Начало проекта: 01.01.2023
- Окончание проекта: 01.06.2023`
              : `# Спецификация проекта

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
            mockText = `Документ в формате DOC
            
Содержимое документа для демонстрации.
            
Этот текст используется для тестирования функциональности просмотра и редактирования документов.`;
          }
          
          setSelectedDocument({
            ...document,
            content: mockContent
          });
          
          // Сохраняем моковый текст для редактирования
          localStorage.setItem(`document_${document.id}_text`, mockText);
        } else {
          // В реальном режиме загружаем содержимое документа
          const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/documents/${document.id}/content`);
          if (!response.ok) {
            throw new Error('Не удалось загрузить содержимое документа');
          }
          const content = await response.text();
          setSelectedDocument({
            ...document,
            content
          });
        }
      } catch (error) {
        console.error('Ошибка при загрузке содержимого документа:', error);
        showError('Не удалось загрузить содержимое документа');
        return;
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedDocument(document || null);
    }
    
    setModalType(type);
    if (document && type === ModalType.CREATE) {
      setNewDocumentName(document.name);
    } else {
      setNewDocumentName('');
      setUploadedFile(null);
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
      navigate(`/projects/${projectId}/documents`);
    }
  };
  
  // Обработка загрузки файла
  const handleFileUpload: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setUploadedFile({
          content,
          name: info.file.name
        });
        setNewDocumentName(info.file.name);
        message.success(`${info.file.name} успешно загружен`);
      };
      
      // @ts-ignore - для демонстрации
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}: ошибка загрузки`);
    }
  };
  
  // Создание нового документа
  const handleCreateDocument = async () => {
    if (!projectId || !uploadedFile) {
      message.error('Необходимо загрузить файл документа');
      return;
    }
    
    if (!newDocumentName.trim()) {
      message.error('Необходимо указать имя документа');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isDemoMode) {
        // В демо-режиме создаем документ локально
        const newDoc: Document = {
          id: Date.now().toString(),
          name: newDocumentName,
          content: uploadedFile.content,
          projectId: projectId,
          size: Math.floor(Math.random() * 1024 * 50), // Случайный размер до 50KB
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setDocuments(prev => [...prev, newDoc]);
        showSuccess('Документ успешно создан');
        closeModal();
      } else {
        // В реальном режиме отправляем запрос
        await createDocument({
          name: newDocumentName,
          content: uploadedFile.content,
          projectId
        });
        
        message.success('Документ успешно создан');
        closeModal();
        await loadDocuments();
      }
    } catch (err: any) {
      message.error(err.message || 'Ошибка при создании документа');
      console.error('Ошибка при создании документа:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Удаление документа
  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;
    
    try {
      if (isDemoMode) {
        // В демо-режиме удаляем документ локально
        setDocuments(prev => prev.filter(doc => doc.id !== selectedDocument.id));
        showSuccess('Документ успешно удален');
        closeModal();
        setSelectedDocument(null);
      } else {
        // В реальном режиме отправляем запрос
        await deleteDocument({
          projectId: projectId || '',
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
    if (!selectedDocument || !projectId) return;
    
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
          projectId,
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
            { title: <a onClick={() => navigate(`/projects/${projectId}`)}>Проект</a> },
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
              onClick={() => navigate(`/projects/${projectId}/documents/upload`)}
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
                onClick={() => navigate(`/projects/${projectId}/documents/upload`)}
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
              initialContent={selectedDocument.content}
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
              initialContent={selectedDocument.content}
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