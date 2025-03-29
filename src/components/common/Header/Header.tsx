import { Avatar, Menu, Popover, Button, Spin, Badge, Tooltip } from "antd";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginOutlined, ExperimentOutlined } from "@ant-design/icons";

import { useAuth } from "../../../contexts/AuthContext";
import { useDemoMode } from "../../../contexts/DemoContext";

import styles from "./Header.module.scss";

import type { MenuProps } from "antd";

// Пункты меню доступные всем пользователям
const publicMenuItems = [
	{
		label: "Главная",
		key: "home",
	}
];

// Пункты меню доступные только авторизованным пользователям
const protectedMenuItems = [
	{
		label: "Мои проекты",
		key: "projects",
	}
];

const userMenuItems = [
	{
		label: "Настройки",
		key: "settings",
	},
	{
		label: "Выход",
		key: "logout",
	},
];

const UserMenu = () => {
	const navigate = useNavigate();
	const { signOut } = useAuth();

	const onClick: MenuProps["onClick"] = (e) => {
		switch (e.key) {
			case "logout":
				signOut();
				break;
			case "settings":
				navigate(`/settings`);
		}
	};

	return (
		<Menu items={userMenuItems} onClick={onClick} className={styles.userMenu} />
	);
};

const Header = () => {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading, userData, signIn } = useAuth();
	const [current, setCurrent] = useState("");
	const { isDemoMode, toggleDemoMode } = useDemoMode();

	// Обработчик для входа в систему
	const handleLogin = () => {
		console.log("Инициирован вход через Header");
		signIn();
	};

	const onClick: MenuProps["onClick"] = (e) => {
		setCurrent(e.key);
		navigate(`/${e.key}`);
	};

	// Объединяем пункты меню в зависимости от состояния аутентификации
	// Если включен демо-режим или пользователь авторизован, то показываем все пункты меню
	const menuItems = isDemoMode || isAuthenticated 
		? [...publicMenuItems, ...protectedMenuItems] 
		: publicMenuItems;

	return (
		<div className={styles.header}>
			<span className={styles.logo}>Kit-start</span>
			<Menu
				onClick={onClick}
				selectedKeys={[current]}
				mode="horizontal"
				items={menuItems}
				className={styles.menu}
			/>
			
			{/* Кнопка Демо режима */}
			<Tooltip title={isDemoMode ? "Выключить демо-режим" : "Включить демо-режим"}>
				<Badge dot={isDemoMode} color="blue">
					<Button 
						type={isDemoMode ? "primary" : "default"}
						icon={<ExperimentOutlined />} 
						onClick={toggleDemoMode}
						className={styles.demoButton}
					>
						Демо
					</Button>
				</Badge>
			</Tooltip>
			
			{/* Аутентификация (скрыта в демо-режиме) */}
			{!isDemoMode && (
				isLoading ? (
					<Spin className={styles.authLoader} />
				) : isAuthenticated && userData ? (
					<Popover content={<UserMenu />}>
						<Avatar
							className={styles.avatar}
							icon={
								<span className={styles.icon}>
									{userData.profile.preferred_username?.[0]}
								</span>
							}
						/>
					</Popover>
				) : (
					<Button 
						type="primary" 
						icon={<LoginOutlined />} 
						onClick={handleLogin}
						className={styles.loginButton}
					>
						Войти
					</Button>
				)
			)}
			
			{/* В демо-режиме вместо аватара показываем демо-индикатор */}
			{isDemoMode && (
				<Tooltip title="Приложение работает в демо-режиме">
					<Avatar
						className={styles.avatar}
						style={{ backgroundColor: '#1890ff' }}
						icon={<ExperimentOutlined />}
					/>
				</Tooltip>
			)}
		</div>
	);
};

export default Header;
