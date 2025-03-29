import { Avatar, Flex, Progress } from "antd";
import { FundProjectionScreenOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import styles from "./ProjectsPage.module.scss";

import type { FC } from "react";

// Определяем интерфейс для пропсов компонента
interface ProjectCardProps {
	id: string;
	name: string;
	progress: number;
	date: string;
	field?: { name: string; info?: string; };
}

const ProjectCard: FC<ProjectCardProps> = ({ id, name, progress, date, field }) => {
	return (
		<Link to={`/projects/${id}`} style={{ width: "100%" }}>
			<Flex className={styles.card}>
				<Avatar
					shape="square"
					size={100}
					icon={<FundProjectionScreenOutlined />}
				/>
				<Flex vertical justify="space-between">
					<h3 className={styles.cardTitle}>{name}</h3>
					{field && <p className={styles.cardDate}>Сфера: {field.name}</p>}
					<Flex vertical>
						<p className={styles.cardDate}>
							Дата: {new Date(date).toLocaleDateString()}
						</p>
					</Flex>
				</Flex>
				<Flex justify="center" className={styles.cardProgress}>
					<span className={styles.cardProgressTitle}>
						Прогресс: {progress || 0}%
					</span>
					<Progress
						percent={progress || 0}
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
