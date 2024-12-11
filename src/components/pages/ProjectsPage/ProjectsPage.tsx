import { Layout, Button } from "antd";
import { Link } from "react-router-dom";

import ProjectCard from "../ProjectsPage/ProjectCard";
import { useGetProjectsQuery } from "./model/projectsApiSlice";

import type { FC } from "react";

const { Content } = Layout;

const ProjectsPage: FC = () => {
	const { data } = useGetProjectsQuery();

	return (
		<Layout>
			<Content style={{ padding: "24px" }}>
				<h1>Список проектов</h1>
				<div style={{ display: "flex", flexWrap: "wrap" }}>
					{data?.map((project) => (
						<ProjectCard key={project.project_id} project={project} />
					))}
				</div>
				<div style={{ position: "fixed", bottom: "300px", right: "600px" }}>
					<Link to="/project-edit">
						<Button
							type="primary"
							shape="circle"
							size="large"
							style={{
								width: "60px",
								height: "60px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<span
								style={{
									fontSize: "50px",
									color: "white",
									transform: "translate(0px, -6px)",
								}}
							>
								+
							</span>
						</Button>
					</Link>
				</div>
			</Content>
		</Layout>
	);
};

export default ProjectsPage;
