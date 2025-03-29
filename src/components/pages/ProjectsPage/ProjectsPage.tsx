import { Layout, Button, Modal, Form, Input, Select, Typography, Alert, Empty, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined, ExperimentOutlined } from "@ant-design/icons";
import { useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";

import ProjectCard from "../ProjectsPage/ProjectCard";
import { useCreateProjectMutation, useGetProjectsQuery, Project } from "./model/projectsApiSlice";
import { useGetFieldsQuery, Field } from "./model/fieldsApiSlice";
import { getMockProjects, getMockFields, addMockProject } from "../../../utils/mockData";
import { useDemoMode } from "../../../contexts/DemoContext";

import styles from "./ProjectsPage.module.scss";

const { Title } = Typography;
const { Content } = Layout;

// Тип для значений формы
interface ProjectFormValues {
	name: string;
	field_id: string;
	description: string;
}

const ProjectsPage: FC = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const { data, isError: isProjectsError } = useGetProjectsQuery();
	const { data: fields, isError: isFieldsError } = useGetFieldsQuery();
	const [createProject] = useCreateProjectMutation();
	const [isModalActive, setIsModalActive] = useState(false);
	const { isDemoMode } = useDemoMode();

	// Состояние для моковых данных
	const [mockProjectsData, setMockProjectsData] = useState<Project[]>([]);
	const [mockFieldsData, setMockFieldsData] = useState<Field[]>([]);
	const [isUsingMock, setIsUsingMock] = useState(false);

	// Загружаем моки при ошибке API или в демо-режиме
	useEffect(() => {
		if (isProjectsError || isDemoMode) {
			getMockProjects().then(data => {
				setMockProjectsData(data);
				setIsUsingMock(true);
			});
		} else {
			setIsUsingMock(false);
		}
	}, [isProjectsError, isDemoMode]);

	useEffect(() => {
		if (isFieldsError || isDemoMode) {
			getMockFields().then(data => {
				setMockFieldsData(data);
			});
		}
	}, [isFieldsError, isDemoMode]);

	const handleChangeModalActive = () => setIsModalActive((prev) => !prev);

	const handleCreateProject = async (values: ProjectFormValues) => {
		try {
			// В демо-режиме используем мок-функцию
			if (isUsingMock) {
				const newProject = await addMockProject(values.name, values.field_id);
				// Обновляем список проектов с новым проектом
				setMockProjectsData(prevData => [newProject, ...prevData]);
				notification.success({
					message: 'Проект создан',
					description: `Проект "${values.name}" успешно создан в демо-режиме`,
					placement: 'topRight',
				});
			} else {
				// В обычном режиме используем API
				const result = await createProject(values).unwrap();
				notification.success({
					message: 'Проект создан',
					description: `Проект "${values.name}" успешно создан`,
					placement: 'topRight',
				});
				// После успешного создания перенаправляем на страницу проекта
				navigate(`/projects/${result.id}`);
			}
			
			handleChangeModalActive();
			form.resetFields(); // Сбрасываем поля формы после создания
		} catch (error: any) { // Используем 'any' для обработки различных типов ошибок
			notification.error({
				message: 'Ошибка создания проекта',
				description: error?.message || 'Произошла неизвестная ошибка при создании проекта',
				placement: 'topRight',
			});
		}
	};

	// Определяем данные для отображения
	const projectsToDisplay = isUsingMock ? mockProjectsData : data;
	const fieldsToDisplay = isUsingMock ? mockFieldsData : fields;

	return (
		<Layout>
			<Content style={{ padding: "2rem" }} className={styles.contentWrapper}>
				{isUsingMock && (
					<Alert
						message={isDemoMode ? "Демо-режим" : "Работа в автономном режиме"}
						description={
							isDemoMode 
								? "Вы работаете в демонстрационном режиме. Все изменения сохраняются только локально." 
								: "Сервер API недоступен. Приложение работает с локальными данными."
						}
						type={isDemoMode ? "info" : "warning"}
						showIcon
						icon={isDemoMode ? <ExperimentOutlined /> : undefined}
						style={{ marginBottom: 16 }}
					/>
				)}
				
				<div className={styles.projectsHeader}>
					<Title level={2}>Проекты</Title>
					<Button size="large" type="primary" icon={<PlusOutlined />} onClick={handleChangeModalActive}>
						Создать проект
					</Button>
				</div>

				{projectsToDisplay && projectsToDisplay.length > 0 ? (
					<div className={styles.projectsContainer}>
						{projectsToDisplay.map((project) => (
							<ProjectCard
								key={project.id}
								id={project.id}
								name={project.name}
								progress={project.progress}
								date={project.edited_at || project.created_at}
								field={project.field}
							/>
						))}
					</div>
				) : (
					<Empty
						description={
							isUsingMock
								? "В демо-режиме нет проектов. Создайте новый проект."
								: "У вас пока нет проектов. Создайте новый проект."
						}
					/>
				)}

				<Modal
					title="Создать проект"
					open={isModalActive}
					onCancel={handleChangeModalActive}
					footer={null}
				>
					<Form
						form={form}
						layout="vertical"
						onFinish={handleCreateProject}
						initialValues={{ description: "" }}
					>
						<Form.Item
							name="name"
							label="Название"
							rules={[{ required: true, message: 'Пожалуйста, введите название проекта' }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							name="field_id"
							label="Направление"
							rules={[{ required: true, message: 'Пожалуйста, выберите направление' }]}
						>
							<Select>
								{fieldsToDisplay?.map((field) => (
									<Select.Option key={field.id} value={field.id}>
										{field.name}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							name="description"
							label="Описание"
						>
							<TextArea rows={4} />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" block>
								Создать проект
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			</Content>
		</Layout>
	);
};

export default ProjectsPage;
