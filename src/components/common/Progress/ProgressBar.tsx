import React from "react";
import SimpleProgressBar from "./SimpleProgressBar"; 
import StepProgressBar from "./StepProgressBar"; 
import "./ProgressBar.css"; 

const ProgressBar: React.FC = () => {
  const projectName = "Название проекта"; 
  const progressPercent = 50;
  const currentStep = 2; 

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '20px 0' }}>
      <SimpleProgressBar projectName={projectName} progressPercent={progressPercent} />
      <StepProgressBar currentStep={currentStep} />
    </div>
  );
};

export default ProgressBar;