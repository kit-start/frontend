import { clearToken } from "./token-utils";
import keycloak from "./keycloak";
// Типизация для auth объекта
type AuthObject = {
  signOutRedirect: (options: { post_logout_redirect_uri: string }) => void;
};

/**
 * Функция для выхода из системы
 */
export const logout = (): void => {
  // Сначала очищаем токен
  clearToken();
  
  try {
    // Выполняем выход через Keycloak
    keycloak.logout({
      redirectUri: window.location.origin + window.location.pathname
    });
  } catch (error) {
    console.error("Ошибка при выходе из системы:", error);
    window.location.href = window.location.origin + window.location.pathname;
  }
};

// Закомментированный код для будущего использования
// import axios from "axios";
// import { getToken, setToken } from "./token-utils";
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