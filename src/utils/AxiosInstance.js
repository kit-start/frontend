import { clearToken } from "./token-utils.js";
import { useAuth } from "oidc-react";

export const logout = () => {
	const auth = useAuth();

	clearToken();
	auth.signOutRedirect({
		post_logout_redirect_uri: `${window.location.origin}${window.location.pathname}`,
	});
};
//
// export const axiosInstance = axios.create({
// 	headers: { Authorization: `Bearer ${getToken()}` },
// });
//
// axiosInstance.interceptors.response.use(
// 	(response) => {
// 		if (response?.headers?.authorization) {
// 			setToken(response.headers.authorization);
// 		}
// 		return response;
// 	},
// 	(error) => {
// 		if (error?.response?.status === 401) {
// 			logout();
// 		}
// 		return Promise.reject(error);
// 	},
// );
//
// export const axiosInstanceDefault = axios.create();
