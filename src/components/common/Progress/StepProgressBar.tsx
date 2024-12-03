import React from "react";
import { Steps } from "antd";
import "./ProgressBar.css";

const { Step } = Steps;

interface StepProgressBarProps {
  currentStep: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep }) => {
  return (
    <div style={{ width: '1400px', textAlign: 'center', marginRight: '120px' }}>
      <h3>Шаги проекта</h3>
      <Steps current={currentStep}>
        <Step title="Шаг 1" description="Идея и цель" />
        <Step title="Шаг 2" description="Опрос" />
        <Step title="Шаг 3" description="Документация" />
        <Step title="Шаг 4" description="Редактирование" />
      </Steps>
    </div>
  );
};

export default StepProgressBar;
