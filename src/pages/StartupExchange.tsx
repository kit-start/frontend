import React, { useState } from 'react';
import { Table, Modal, Button, Tag, Space } from 'antd';

interface Project {
  id: string;
  name: string;
  date: string;
  author: string;
  stage: string;
  description: string;
  authors: string;
  contacts: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'FoodWise',
    date: '2025-06-02',
    author: 'Топорков Александр',
    stage: 'MVP',
    description: 'FoodWise — это умный гид по здоровому питанию, который помогает пользователям выбирать продукты и составлять рацион.',
    authors: 'Топорков Александр',
    contacts: 'foodwise@example.com, +7 900 123-45-67'
  },
  {
    id: '2',
    name: 'EduTech',
    date: '2025-05-20',
    author: 'Шарифуллин Ильдан',
    stage: 'Прототип',
    description: 'EduTech — образовательная платформа для интерактивного обучения школьников и студентов.',
    authors: 'Шарифуллин Ильдан',
    contacts: 'edutech@example.com, +7 900 765-43-21'
  }
];

const StartupExchange: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const columns = [
    {
      title: 'Название проекта',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <b>{text}</b>
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Автор',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Стадия',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => <Tag color={stage === 'MVP' ? 'green' : 'blue'}>{stage}</Tag>
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: Project) => (
        <Button type="link" onClick={() => { setSelectedProject(record); setModalVisible(true); }}>
          Подробнее
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Биржа стартапов</h1>
      <Table
        dataSource={mockProjects}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
      <Modal
        open={modalVisible}
        title={selectedProject?.name}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Закрыть
          </Button>,
          <Button
            key="contact"
            type="primary"
            href={`mailto:${selectedProject?.contacts.split(',')[0]}`}
          >
            Связаться
          </Button>
        ]}
      >
        <p><b>Описание:</b> {selectedProject?.description}</p>
        <p><b>Авторы:</b> {selectedProject?.authors}</p>
        <p><b>Контакты:</b> {selectedProject?.contacts}</p>
      </Modal>
    </div>
  );
};

export default StartupExchange; 