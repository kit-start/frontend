import { Avatar, Menu, Popover } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Header.module.scss";

import type { MenuProps } from "antd";

const menuItems = [
	{
		label: "Главная",
		key: "home",
	},
	{
		label: "Мои проекты",
		key: "projects",
	},
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

	const onClick: MenuProps["onClick"] = (e) => {
		switch (e.key) {
			case "logout":
				// eslint-disable-next-line no-undef
				console.log("logout");
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
	const [current, setCurrent] = useState("home");

	const onClick: MenuProps["onClick"] = (e) => {
		setCurrent(e.key);
		navigate(`/${e.key}`);
	};

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
			<Popover content={<UserMenu />}>
				<Avatar />
			</Popover>
		</div>
	);
};

export default Header;
