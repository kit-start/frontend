import React, { useEffect, useState } from "react";
import { Layout, Button } from "antd";
import { Link } from "react-router-dom";
import ProjectCard from "../ProjectsPage/ProjectCard";

const { Content } = Layout;

interface ProjectType {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  progress: number;
  image: string;
}

const ProjecsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('src/components/pages/ProjectsPage/projects.json'); 
        const data: ProjectType[] = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Ошибка при загрузке проектов:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        <h1>Список проектов</h1>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div style={{ position: 'fixed', bottom: '300px', right: '600px' }}>
          <Link to="/project-edit"> 
            <Button
              type="primary"
              shape="circle"
              size="large"
              style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
            >
              <span style={{ fontSize: '50px', color: 'white', transform: 'translate(0px, -6px)' }}>+</span>
            </Button>
          </Link>
        </div>
      </Content>
    </Layout>
  );
};

export default ProjecsPage;