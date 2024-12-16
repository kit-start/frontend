import { useState } from "react";
import { Breadcrumb, Input, Layout, Menu, theme, Typography } from "antd";
import { useParams } from "react-router-dom";

import {
	ActionType,
	useGetProjectQuery,
} from "../ProjectsPage/model/projectsApiSlice";
import SimpleProgressBar from "../../common/Progress/SimpleProgressBar";

import type { Action, Section } from "../ProjectsPage/model/projectsApiSlice";

const { Content, Sider } = Layout;

// TODO: Выпилить после интеграции
const DEFAULT_PROJECT_ID = '1';

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
	const { data } = useGetProjectQuery(id ? id : DEFAULT_PROJECT_ID);

	const handleMenuClick = (section: Section, action: Action) => {
		setBreadcrumbItems([
			{ title: section.name },
			{ title: action.name },
		]);
		setActiveSection(section);
		setActiveAction(action);
	};

	return (
		<Layout>
			<SimpleProgressBar projectName={data?.name || ""} progress={data?.progress || 0} />
			{/*{data && activeSection && activeAction && (*/}
			{/*	<ProgressBar*/}
			{/*		name={data.name}*/}
			{/*		progress={data.progress}*/}
			{/*		step={activeSection.actions.findIndex(*/}
			{/*			({ id }) => id === activeAction.id,*/}
			{/*		)}*/}
			{/*	/>*/}
			{/*)}*/}
			<Layout>
				<Sider width={300} style={{ background: colorBgContainer }}>
					<Menu
						mode="inline"
						defaultSelectedKeys={["1"]}
						defaultOpenKeys={["sub1"]}
						style={{ height: "100%", borderRight: 0 }}
						items={data?.field.sections.map((section) => ({
							key: section.id,
							label: section.name,
							children: section.actions.map((action) => ({
								key: action.id,
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
								onChange={(e) => setDocumentText(e.target.value)}
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
							</div>
						)}
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default ProjectEditPage;
