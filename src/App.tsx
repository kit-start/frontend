import { Route, Routes } from "react-router-dom";

import Layout from "./components/common/Layout/Layout";
import HomePage from "./components/pages/HomePage/HomePage";
import ProjectsPage from "./components/pages/ProjectsPage/ProjectsPage";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="home" element={<HomePage />} />
				<Route path="projects" element={<ProjectsPage />} />
			</Route>
		</Routes>
	);
};

export default App;
