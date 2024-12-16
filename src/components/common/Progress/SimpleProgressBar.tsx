import { Progress } from "antd";

import styles from "./ProgressBar.module.scss";

import type { FC } from "react";

interface SimpleProgressBarProps {
  projectName: string;
  progress: number;
}

const SimpleProgressBar: FC<SimpleProgressBarProps> = ({ progress, projectName }) => {
  return (
    <div className={styles.simpleContainer}>
        <h3 className={styles.title}>{projectName}</h3>
      <Progress
        percent={progress}
        status="active"
        strokeColor={{ from: "#108ee9", to: "#87d068" }}
        className={styles.progress}
      />
      <div style={{ fontSize: '12px', marginTop: '5px' }}>
        <span className={styles.progressTitle}>Прогресс проекта</span>
      </div>
    </div>
  );
};

export default SimpleProgressBar;
