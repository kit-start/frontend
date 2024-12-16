import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getToken } from "../../../../utils/token-utils";

import type { Field } from "./fieldsApiSlice";

export interface Project {
	id: string;
	name: string;
	field: Field;
	created_at: string;
	edited_at: string;
	progress: number;
}

export enum ActionType {
	CONTENT = "content",
	QUERY = "query",
	DOCUMENT = "document",
}

export interface Action {
	id: number;
	name: string;
	info: string;
	type: ActionType;
	prev_action_id?: string;
	done: boolean;
}

export interface Section {
	id: number;
	name: string;
	progress: number;
	actions: Action[];
}

export interface ProjectInfoField extends Field {
	sections: Section[];
}

export interface ProjectInfoApiResponse extends Project {
	field: ProjectInfoField;
}

export interface CreateProjectProps {
	name: string;
	field_id: string;
	description: string;
}

type ProjectsApiResponse = Project[];

export const projectsApiSlice = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: "https://kitstart.ismit.ru/api/",
		headers: { Authorization: `Bearer ${getToken()}` },
	}),
	reducerPath: "projectsApi",
	endpoints: (build) => ({
		getProjects: build.query<ProjectsApiResponse, void>({
			query: () => "/projects",
		}),
		getProject: build.query<ProjectInfoApiResponse, string>({
			query: (project_id) => `/projects/${project_id}`,
		}),
		createProject: build.mutation<ProjectInfoApiResponse, CreateProjectProps>({
			query: (body) => ({
				url: `/projects`,
				method: 'POST',
				body
			}),
		}),
	}),
});

export const { useGetProjectsQuery, useGetProjectQuery, useCreateProjectMutation } = projectsApiSlice;
