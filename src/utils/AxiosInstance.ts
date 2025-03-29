import { clearToken } from "./token-utils";
// Типизация для auth объекта
type AuthObject = {
  signOutRedirect: (options: { post_logout_redirect_uri: string }) => void;
};

/**
 * Функция для выхода из системы
 * @param auth - объект аутентификации
 */
export const logout = (auth: AuthObject): void => {
  // Сначала очищаем токен, чтобы даже при ошибке редиректа пользователь был разлогинен
  clearToken();
  
  try {
    // Перенаправляем пользователя на страницу logout в Keycloak
    auth.signOutRedirect({
      post_logout_redirect_uri: `${window.location.origin}${window.location.pathname}`,
    });
  } catch (error) {
    // В случае ошибки выводим сообщение и перенаправляем на главную страницу
    console.error("Ошибка при выходе из системы:", error);
    window.location.href = `${window.location.origin}${window.location.pathname}`;
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