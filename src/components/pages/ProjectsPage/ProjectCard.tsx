import { Avatar, Flex, Progress } from "antd";
import { FundProjectionScreenOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import styles from "./ProjectsPage.module.scss";

import type { FC } from "react";

import type { Project } from "./model/projectsApiSlice";

interface ProjectCardProps {
	project: Project;
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
	return (
		<Link to={`/project/${project.id}`} style={{ width: "100%" }}>
			<Flex className={styles.card}>
				<Avatar
					shape="square"
					size={100}
					icon={<FundProjectionScreenOutlined />}
				/>
				<Flex vertical justify="space-between">
					<h3 className={styles.cardTitle}>{project.name}</h3>
					<p className={styles.cardDate}>Сфера: {project.field.name}</p>
					<Flex vertical>
						<p className={styles.cardDate}>
							Дата создания: {new Date(project.created_at).toLocaleDateString()}
						</p>
						<p className={styles.cardDate}>
							Дата редактирования:{" "}
							{project.edited_at ? new Date(project.edited_at).toLocaleDateString() : "Не редактировано"}
						</p>
					</Flex>
				</Flex>
				<Flex justify="center" className={styles.cardProgress}>
					<span className={styles.cardProgressTitle}>
						Прогресс: {project.progress || 0}%
					</span>
					<Progress
						percent={project.progress || 0}
						type="circle"
						status="active"
						size={20}
					/>
				</Flex>
			</Flex>
		</Link>
	);
};

export default ProjectCard;
