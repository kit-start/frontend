import { Flex } from "antd";

import SimpleProgressBar from "./SimpleProgressBar";
import StepProgressBar from "./StepProgressBar";

import type { FC } from "react";

import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
	name: string;
	progress: number;
	step: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ name, progress, step }) => {
	return (
		<Flex
			justify="space-between"
			align="flex-start"
			className={styles.container}
		>
			<SimpleProgressBar projectName={name} progress={progress} />
			<StepProgressBar currentStep={step} />
		</Flex>
	);
};

export default ProgressBar;
