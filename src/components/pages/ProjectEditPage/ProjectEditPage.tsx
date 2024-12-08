import { useState } from "react";
import { Breadcrumb, Input, Layout, Menu, theme } from "antd";
import { useParams } from "react-router-dom";

import ProgressBar from "../../common/Progress/ProgressBar";
import {
	ActionType,
	useGetProjectQuery,
} from "../ProjectsPage/model/projectsApiSlice";

import type { Action, Section } from "../ProjectsPage/model/projectsApiSlice";

const { Content, Sider } = Layout;

// TODO: Выпилить после интеграции
const DEFAULT_PROJECT_ID = 1;

const ProjectEditPage = () => {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	const { id } = useParams();
	const [breadcrumbItems, setBreadcrumbItems] = useState<{ title: string }[]>(
		[],
	);
	const [documentText, setDocumentText] = useState("");
	const [activeSection, setActiveSection] = useState<Section>();
	const [activeAction, setActiveAction] = useState<Action>();
	const { data } = useGetProjectQuery(id ? parseInt(id) : DEFAULT_PROJECT_ID);

	const handleMenuClick = (section: Section, action: Action) => {
		setBreadcrumbItems([
			{ title: section.section_name },
			{ title: action.action_name },
		]);
		setActiveSection(section);
		setActiveAction(action);
	};

	return (
		<Layout>
			{data && activeSection && activeAction && (
				<ProgressBar
					name={data.name}
					progress={data.progress}
					step={activeSection.actions.findIndex(
						({ action_id }) => action_id === activeAction.action_id,
					)}
				/>
			)}
			<Layout>
				<Sider width={300} style={{ background: colorBgContainer }}>
					<Menu
						mode="inline"
						defaultSelectedKeys={["1"]}
						defaultOpenKeys={["sub1"]}
						style={{ height: "100%", borderRight: 0 }}
						items={data?.sections.map((section) => ({
							key: section.section_id,
							label: section.section_name,
							children: section.actions.map((action) => ({
								key: action.action_id,
								label: action.action_name,
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
								onChange={(e) => setDocumentText(e.target.value)}
								rows={10}
								placeholder="Введите текст документа..."
							/>
						) : (
							<div>
								<h3>Выберите шаг проекта</h3>
							</div>
						)}
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default ProjectEditPage;
