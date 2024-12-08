import { Steps } from "antd";

import styles from "./ProgressBar.module.scss";

import type { FC } from "react";

const { Step } = Steps;

interface StepProgressBarProps {
  currentStep: number;
}

const StepProgressBar: FC<StepProgressBarProps> = ({ currentStep }) => {
  return (
    <div className={styles.stepContainer}>
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
