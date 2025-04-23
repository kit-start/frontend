import { useState, useEffect } from "react";
import { Breadcrumb, Input, Layout, Menu, theme, Typography, Alert, Button, Space } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { ExperimentOutlined, FileTextOutlined } from "@ant-design/icons";

import {
	ActionType,
	useGetProjectQuery,
} from "../ProjectsPage/model/projectsApiSlice";
import SimpleProgressBar from "../../common/Progress/SimpleProgressBar";
import { getMockProject } from "../../../utils/mockData";
import { useDemoMode } from "../../../contexts/DemoContext";

import type { Action, Section, ProjectInfoApiResponse } from "../ProjectsPage/model/projectsApiSlice";

const { Content, Sider } = Layout;

// TODO: Выпилить после интеграции
const DEFAULT_PROJECT_ID = '1';

const ProjectEditPage = () => {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	const { id } = useParams();
	const navigate = useNavigate();
	const [breadcrumbItems, setBreadcrumbItems] = useState<{ title: string }[]>([]);
	const [documentText, setDocumentText] = useState("");
	const [activeSection, setActiveSection] = useState<Section>();
	const [activeAction, setActiveAction] = useState<Action>();
	const { data, isError } = useGetProjectQuery(id ? id : DEFAULT_PROJECT_ID);
	
	// Получаем состояние демо-режима
	const { isDemoMode } = useDemoMode();
	
	// Состояние для моковых данных
	const [mockProjectData, setMockProjectData] = useState<ProjectInfoApiResponse | null>(null);
	
	// Флаг, указывающий использовать ли мок-данные
	const [isUsingMock, setIsUsingMock] = useState(false);

	// Загружаем моковые данные при ошибке API или в демо-режиме
	useEffect(() => {
		if (isError || isDemoMode) {
			setIsUsingMock(true);
			getMockProject(id ? id : DEFAULT_PROJECT_ID).then((project) => {
				if (project) {
					// Добавляем дополнительные данные для имитации ProjectInfoApiResponse
					setMockProjectData({
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
								},
								{
									id: 2,
									name: "Дополнительные материалы",
									progress: 0,
									actions: [
										{
											id: 3,
											name: "Заметки",
											info: "Заметки по проекту",
											type: ActionType.DOCUMENT,
											done: false
										}
									]
								}
							]
						}
					});
				}
			});
		} else {
			setIsUsingMock(false);
		}
	}, [isError, id, isDemoMode]);

	// Функция для сохранения текста документа (в демо-режиме)
	const handleDocumentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newText = e.target.value;
		setDocumentText(newText);
		
		// В реальном приложении здесь был бы API запрос для сохранения документа
		console.log(`Документ ${activeAction?.name} сохранен в демо-режиме:`, newText);
	};

	const handleMenuClick = (section: Section, action: Action) => {
		setBreadcrumbItems([
			{ title: section.name },
			{ title: action.name },
		]);
		setActiveSection(section);
		setActiveAction(action);
		
		// Если это действие типа документ, сбрасываем текст (в реальном приложении здесь был бы запрос к API)
		if (action.type === ActionType.DOCUMENT) {
			setDocumentText(""); // В реальном приложении здесь загружался бы существующий документ
		}
	};

	// Определяем данные для отображения
	const projectToDisplay = isUsingMock ? mockProjectData : data;

	return (
		<Layout>
			<SimpleProgressBar projectName={projectToDisplay?.name || ""} progress={projectToDisplay?.progress || 0} />
			
			{isUsingMock && (
				<Alert
					message={isDemoMode ? "Демо-режим" : "Работа в автономном режиме"}
					description={
						isDemoMode 
							? "Редактирование проекта в демонстрационном режиме. Все изменения сохраняются только локально." 
							: "Сервер API недоступен. Приложение работает с локальными данными."
					}
					type={isDemoMode ? "info" : "warning"}
					showIcon
					icon={isDemoMode ? <ExperimentOutlined /> : undefined}
					style={{ margin: '0 24px 16px 24px' }}
				/>
			)}
			
			{/* Кнопка для перехода к документам проекта */}
			<div style={{ padding: '0 24px 16px 24px' }}>
				<Button 
					type="primary" 
					icon={<FileTextOutlined />}
					onClick={() => navigate(`/projects/${id}/documents`)}
				>
					Документы проекта
				</Button>
			</div>
			
			<Layout>
				<Sider width={300} style={{ background: colorBgContainer }}>
					<Menu
						mode="inline"
						defaultSelectedKeys={["1"]}
						defaultOpenKeys={["sub1"]}
						style={{ height: "100%", borderRight: 0 }}
						items={projectToDisplay?.field.sections.map((section) => ({
							key: `section-${section.id}`,
							label: section.name,
							children: section.actions.map((action) => ({
								key: `action-${action.id}`,
								label: action.name,
								onClick: () => handleMenuClick(section, action),
							})),
						}))}
					/>
				</Sider>
				<Layout style={{ padding: "0 24px 24px" }}>
					<Breadcrumb items={breadcrumbItems} style={{ margin: "16px 0" }} />
					<Content
						style={{
							padding: 24,
							margin: 0,
							minHeight: 280,
							background: colorBgContainer,
							borderRadius: borderRadiusLG,
						}}
					>
						{activeAction?.type === ActionType.DOCUMENT ? (
							<Input.TextArea
								value={documentText}
								onChange={handleDocumentChange}
								rows={10}
								placeholder="Введите текст документа..."
							/>
						) : activeAction?.type === ActionType.CONTENT ? (
							<Typography>
								{activeAction.info}
							</Typography>
						) : (
							<div>
								<h3>Выберите шаг проекта</h3>
								<p>Чтобы начать работу, выберите раздел и действие в меню слева.</p>
							</div>
						)}
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default ProjectEditPage;
