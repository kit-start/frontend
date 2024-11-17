import { Layout as LayoutBase } from "antd";
import { Outlet } from "react-router-dom";

import Header from "../Header/Header";

const layoutStyle = {
	borderRadius: 8,
	overflow: 'hidden',
	width: '100vw',
	height: '100vh',
	padding: '0 100px',
	backgroundColor: '#fff',
};

const Layout = () => {
	return (
		<LayoutBase style={layoutStyle}>
			<Header/>
			<Outlet/>
		</LayoutBase>
	);
};

export default Layout;
