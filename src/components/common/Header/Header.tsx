import { Avatar, Menu, Popover } from "antd";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "oidc-react";

import { clearToken } from "../../../utils/token-utils";

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
	const auth = useAuth();

	const handleLogout = useCallback(() => {
		clearToken();
		auth.signOutRedirect({
			post_logout_redirect_uri: `${window.location.origin}${window.location.pathname}`,
		});
	}, [auth]);

	const onClick: MenuProps["onClick"] = (e) => {
		switch (e.key) {
			case "logout":
				handleLogout();
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
	const auth = useAuth();
	const [current, setCurrent] = useState("");

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
				{auth.userData && (
					<Avatar
						className={styles.avatar}
						icon={
							<span className={styles.icon}>
								{auth.userData.profile.preferred_username?.[0]}
							</span>
						}
					/>
				)}
			</Popover>
		</div>
	);
};

export default Header;
