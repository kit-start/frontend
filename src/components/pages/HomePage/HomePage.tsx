import { useAuth } from "oidc-react";
import { Flex } from "antd";

const HomePage = () => {
	const auth = useAuth();

	return (
		<Flex>
			{auth.userData ? (
				<span>Привет, {auth.userData?.profile.preferred_username}!</span>
			) : (
				<span>Вам надо залогиниться или зарегистрироваться!</span>
			)}
		</Flex>
	);
};

export default HomePage;
