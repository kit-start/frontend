import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Layout from "./components/common/Layout/Layout";
import HomePage from "./components/pages/HomePage/HomePage";
import ProjectsPage from "./components/pages/ProjectsPage/ProjectsPage";
import ProjectEditPage from "./components/pages/ProjectEditPage/ProjectEditPage";
import DocumentsPage from "./components/pages/DocumentsPage/DocumentsPage";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import { useDemoMode } from "./contexts/DemoContext";
import { useAuth } from "./contexts/AuthContext";
import StartupExchange from "./pages/StartupExchange";

const App = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const { isDemoMode } = useDemoMode();

	// Функция для логирования состояния авторизации
	useEffect(() => {
		if (!isDemoMode && !isAuthenticated && !isLoading) {
			console.log("Пользователь не авторизован");
		}
	}, [isAuthenticated, isLoading, isDemoMode]);

	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<HomePage />} />
				<Route path="exchange" element={<StartupExchange />} />
				<Route
					path="projects"
					element={
					<ProtectedRoute>
						<ProjectsPage />
					</ProtectedRoute>
					}
				/>
				<Route
					path="projects/:id"
					element={
					<ProtectedRoute>
						<ProjectEditPage />
					</ProtectedRoute>
					}
				/>
				<Route
					path="projects/:id/documents"
					element={
					<ProtectedRoute>
						<DocumentsPage />
					</ProtectedRoute>
					}
				/>
			</Route>
		</Routes>
	);
};

export default App;
