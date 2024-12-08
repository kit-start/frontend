import React from "react";
import SimpleProgressBar from "../../common/Progress/SimpleProgressBar";
import { Card } from "antd";

interface ProjectType {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  progress: number;
  image: string;
}

interface ProjectCardProps {
  project: ProjectType;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card
      style={{ width: 300, margin: "16px" }}
      cover={
        <img
          alt={project.title}
          src={project.image}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      }
    >
      <Card.Meta
        title={project.title}
        description={project.description}
      />
      <div style={{ textAlign: 'center' }}>
        <SimpleProgressBar progress={project.progress} projectName={""} />
      </div>
      <p style={{ textAlign: 'left' }}>
        Дата создания: {new Date(project.createdAt).toLocaleDateString()}
      </p>
    </Card>
  );
};

export default ProjectCard;
