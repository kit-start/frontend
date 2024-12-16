import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getToken } from "../../../../utils/token-utils";

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
		headers: { Authorization: `Bearer ${getToken()}` },
	}),
	reducerPath: "fieldsApi",
	endpoints: (build) => ({
		getFields: build.query<FieldsApiResponse, void>({
			query: () => "/fields",
		}),
	}),
});

export const { useGetFieldsQuery } = fieldsApiSlice;
