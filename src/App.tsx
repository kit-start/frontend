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

const App = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const { isDemoMode } = useDemoMode();

	// Функция для логирования состояния авторизации
	useEffect(() => {
		// В демо-режиме не пытаемся автоматически авторизовать пользователя
		if (!isDemoMode && !isAuthenticated && !isLoading) {
			// Даем небольшую задержку для инициализации
			const timer = setTimeout(() => {
				console.log("Пользователь не авторизован, но находится на главной странице");
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [isAuthenticated, isLoading, isDemoMode]);

	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Navigate to="/home" replace />} />
				<Route path="home" element={<HomePage />} />
				
				{/* Защищенные маршруты - требуют авторизации */}
				<Route path="projects" element={
					<ProtectedRoute>
						<ProjectsPage />
					</ProtectedRoute>
				} />
				<Route path="projects/:id" element={
					<ProtectedRoute>
						<ProjectEditPage />
					</ProtectedRoute>
				} />
				
				{/* Маршруты для страницы документов */}
				<Route path="projects/:projectId/documents" element={
					<ProtectedRoute>
						<DocumentsPage />
					</ProtectedRoute>
				} />
				<Route path="projects/:projectId/documents/upload" element={
					<ProtectedRoute>
						<DocumentsPage />
					</ProtectedRoute>
				} />
			</Route>
		</Routes>
	);
};

export default App;
