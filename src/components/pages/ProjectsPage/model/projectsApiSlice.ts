import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getToken } from "../../../../utils/token-utils";

export interface Project {
	project_id: number;
	name: string;
	field_name: string;
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
	action_id: number;
	action_name: string;
	type: ActionType;
	prev_action?: number;
	done: boolean;
}

export interface Section {
	section_id: number;
	section_name: string;
	section_progress: number;
	actions: Action[];
}

export interface ProjectInfoApiResponse extends Project {
	documents_done: number;
	sections: Section[];
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
		getProject: build.query<ProjectInfoApiResponse, number>({
			query: (project_id) => `/project/${project_id}.json`,
		}),
	}),
});

export const { useGetProjectsQuery, useGetProjectQuery } = projectsApiSlice;
