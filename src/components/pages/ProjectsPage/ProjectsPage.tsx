import { Layout, Button, Modal, Form, Input, Select, Typography,  } from "antd";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

import ProjectCard from "../ProjectsPage/ProjectCard";
import { useCreateProjectMutation, useGetProjectsQuery } from "./model/projectsApiSlice";
import { useGetFieldsQuery } from "./model/fieldsApiSlice";

import type { FC } from "react";

import styles from "./ProjectsPage.module.scss";

const { Content } = Layout;

const ProjectsPage: FC = () => {
	const [form] = Form.useForm();
	const { data } = useGetProjectsQuery();
	const { data: options } = useGetFieldsQuery();
	const [createProject] = useCreateProjectMutation()
	const [isModalActive, setIsModalActive] = useState(false);

	const handleChangeModalActive = () => setIsModalActive((prev) => !prev);

	const handleCreateProject = () => {
		const formData = form.getFieldsValue();
		createProject(formData)
		handleChangeModalActive();
	};

	return (
		<Layout>
			<Content style={{ padding: "24px" }} className={styles.contentWrapper}>
				<h1>Список проектов</h1>
				<div style={{ display: "flex", flexWrap: "wrap" }}>
					{data?.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
				<div className={styles.addProject}>
					<Button
						type="primary"
						shape="circle"
						size="middle"
						icon={<PlusOutlined />}
						onClick={handleChangeModalActive}
					/>
				</div>
				<Modal open={isModalActive} onCancel={handleChangeModalActive}>
					<Form form={form}>
						<Typography.Title level={5}>Название проекта</Typography.Title>
						<Form.Item name="name">
							<Input />
						</Form.Item>
						<Typography.Title level={5}>Описание проекта</Typography.Title>
						<Form.Item name="description">
							<TextArea />
						</Form.Item>
						<Typography.Title level={5}>Сфера проекта</Typography.Title>
						<Form.Item name="field_id">
							<Select>
								{options?.map((field) => (
									<Select.Option key={field.id} value={field.id}>
										{field.name} ({field.info})
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Button onClick={handleCreateProject}>Создать проект</Button>
					</Form>
				</Modal>
			</Content>
		</Layout>
	);
};

export default ProjectsPage;
