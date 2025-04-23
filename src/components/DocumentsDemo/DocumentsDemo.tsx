import React, { useState } from 'react';
import { Table, Button, Space, Typography, Modal } from 'antd';
import { FileOutlined, EyeOutlined } from '@ant-design/icons';
import DocViewer from '../common/DocViewer/DocViewer';
import { mockDocuments, MockDocument, formatFileSize, formatDate } from '../../mocks/mockDocuments';

import styles from './DocumentsDemo.module.scss';

const { Title } = Typography;

const DocumentsDemo: React.FC = () => {
  const [documents, setDocuments] = useState<MockDocument[]>(mockDocuments);
  const [selectedDocument, setSelectedDocument] = useState<MockDocument | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Обработчик просмотра документа
  const handleViewDocument = (document: MockDocument) => {
    setSelectedDocument(document);
    setIsModalVisible(true);
  };

  // Обработчик удаления документа
  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;
    
    // Фильтруем массив документов, исключая выбранный
    const updatedDocuments = documents.filter(doc => doc.id !== selectedDocument.id);
    setDocuments(updatedDocuments);
    
    // Закрываем модальное окно
    setIsModalVisible(false);
    setSelectedDocument(null);
  };

  // Обработчик сохранения документа
  const handleSaveDocument = async (content: string, fileName: string) => {
    if (!selectedDocument) return;
    
    // Обновляем существующий документ
    const updatedDocuments = documents.map(doc => {
      if (doc.id === selectedDocument.id) {
        return {
          ...doc,
          name: fileName,
          content,
          updatedAt: new Date(),
          size: Math.floor(Math.random() * 1024 * 500) // Имитируем новый размер файла
        };
      }
      return doc;
    });
    
    setDocuments(updatedDocuments);
    
    // Обновляем выбранный документ
    const updatedDocument = updatedDocuments.find(doc => doc.id === selectedDocument.id);
    if (updatedDocument) {
      setSelectedDocument(updatedDocument);
    }
  };

  // Колонки для таблицы документов
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
      render: (date: Date) => formatDate(date)
    },
    {
      title: 'Последнее изменение',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: Date) => formatDate(date)
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: MockDocument) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewDocument(record)}
        >
          Просмотреть
        </Button>
      )
    }
  ];

  return (
    <div className={styles.documentsDemo}>
      <Title level={2}>Демо просмотра документов</Title>
      
      <Table 
        dataSource={documents} 
        columns={columns} 
        rowKey="id"
        pagination={false}
        className={styles.documentsTable}
      />
      
      <Modal
        title="Просмотр документа"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1000}
        destroyOnClose
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
    </div>
  );
};

export default DocumentsDemo; 