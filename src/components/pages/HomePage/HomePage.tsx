import { Flex, Alert, Button, Space } from "antd";
import { useEffect, useState } from "react";
import { LoginOutlined, ExperimentOutlined } from "@ant-design/icons";

import { useAuth } from "../../../contexts/AuthContext";
import { useDemoMode } from "../../../contexts/DemoContext";

const HomePage = () => {
	const { isAuthenticated, isLoading, userData, signIn } = useAuth();
	const [authError, setAuthError] = useState<string | null>(null);
	const { isDemoMode } = useDemoMode();

	useEffect(() => {
		// Проверяем наличие ошибок с сервером аутентификации только если не в демо-режиме
		if (!isDemoMode) {
			const checkAuthServer = async () => {
				try {
					const response = await fetch("https://keycloak.ismit.ru/realms/ISM/.well-known/openid-configuration", { 
						method: 'GET',
						mode: 'no-cors' // Используем no-cors для проверки доступности
					});
					setAuthError(null);
				} catch (error) {
					setAuthError("Сервер аутентификации временно недоступен. Некоторые функции могут быть ограничены.");
				}
			};

			checkAuthServer();
		} else {
			// В демо-режиме сбрасываем ошибку
			setAuthError(null);
		}
	}, [isDemoMode]);

	// Обработчик для входа в систему
	const handleLogin = () => {
		console.log("Инициирован вход через HomePage");
		signIn();
	};

	return (
		<Flex vertical gap={16}>
			{/* Показываем сообщение о демо-режиме */}
			{isDemoMode && (
				<Alert
					message="Демо-режим активен"
					description="Приложение работает в демонстрационном режиме с моковыми данными. Авторизация не требуется."
					type="info"
					showIcon
					icon={<ExperimentOutlined />}
				/>
			)}
			
			{/* Показываем ошибку подключения только если не в демо-режиме */}
			{authError && !isDemoMode && (
				<Alert
					message="Проблема с подключением"
					description={authError}
					type="warning"
					showIcon
				/>
			)}
			
			{/* Приветствие зависит от статуса авторизации и демо-режима */}
			{isDemoMode ? (
				<Flex vertical gap={8}>
					<h2>Добро пожаловать в Kit-start!</h2>
					<p>Вы работаете в демонстрационном режиме. Все функции доступны без авторизации.</p>
					<p>Данные сохраняются только локально в вашем браузере.</p>
				</Flex>
			) : isAuthenticated && userData ? (
				<Flex vertical gap={8}>
					<h2>Привет, {userData?.profile.preferred_username}!</h2>
					<p>Вы успешно вошли в систему. Теперь у вас есть доступ к полному функционалу платформы.</p>
				</Flex>
			) : (
				<Flex vertical gap={8}>
					<h2>Добро пожаловать в Kit-start!</h2>
					<p>Вам необходимо войти в систему для доступа ко всем функциям.</p>
					<Space>
						<Button 
							type="primary" 
							icon={<LoginOutlined />} 
							onClick={handleLogin}
							loading={isLoading}
						>
							Войти в систему
						</Button>
					</Space>
				</Flex>
			)}
		</Flex>
	);
};

export default HomePage;
