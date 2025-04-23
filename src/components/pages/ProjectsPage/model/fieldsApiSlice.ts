import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import keycloak from "../../../../utils/keycloak";
import { getToken, setToken } from "../../../../utils/token-utils";

import type { Section } from "./projectsApiSlice";

export interface Field {
	id: string;
	name: string;
	info: string;
	sections?: Section[];
}

type FieldsApiResponse = Field[];

export const fieldsApiSlice = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: "https://kitstart.ismit.ru/api/",
		prepareHeaders: async (headers) => {
			// Проверяем срок действия токена
			if (keycloak.isTokenExpired()) {
				try {
					// Пытаемся обновить токен
					await keycloak.updateToken(70);
					setToken(keycloak.token!);
				} catch (error) {
					console.error('Ошибка обновления токена:', error);
					// Если не удалось обновить токен, перенаправляем на страницу входа
					keycloak.login();
					return headers;
				}
			}

			const token = getToken();
			if (token) {
				headers.set('Authorization', `Bearer ${token}`);
			}
			return headers;
		},
		responseHandler: async (response) => {
			if (!response.ok) {
				if (response.status === 401 || response.status === 403) {
					console.error('Ошибка авторизации при запросе к API:', response.statusText);
				} else if (response.status === 404) {
					console.error('Ресурс не найден:', response.url);
				} else if (response.status >= 500) {
					console.error('Ошибка сервера:', response.statusText);
				}
				
				try {
					const errorData = await response.json();
					return Promise.reject(errorData);
				} catch (e) {
					return Promise.reject({ message: response.statusText });
				}
			}
			return response.json();
		}
	}),
	reducerPath: "fieldsApi",
	endpoints: (build) => ({
		getFields: build.query<FieldsApiResponse, void>({
			query: () => "/fields",
		}),
	}),
});

export const { useGetFieldsQuery } = fieldsApiSlice;
