import React from "react";
import { Progress } from "antd";
import "./ProgressBar.css"; 

interface SimpleProgressBarProps {
  projectName: string;
  progress: number;
}

const SimpleProgressBar: React.FC<SimpleProgressBarProps> = ({ progress }) => {
  return (
    <div style={{ width: '100%', textAlign: 'center', margin: '10px 0' }}>
        <h3>Название проекта</h3>
      <Progress
        percent={progress}
        status="active"
        strokeColor={{ from: "#108ee9", to: "#87d068" }}
        style={{ width: '70%' }} 
      />
      <div style={{ fontSize: '12px', marginTop: '5px' }}>
        <p>ГОТОВНОСТЬ ПРОЕКТА</p>
      </div>
    </div>
  );
};

export default SimpleProgressBar;
