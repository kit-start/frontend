import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface DocumentDto {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  size: number;
  projectId: string;
}

interface DeleteDocumentParams {
  projectId: string;
  documentId: string;
}

interface UpdateDocumentParams {
  projectId: string;
  documentId: string;
  content: string;
  fileName: string;
}

interface UploadDocumentParams {
  projectId: string;
  content: string;
  fileName: string;
}

export const documentsApi = createApi({
  reducerPath: 'documentsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    prepareHeaders: (headers) => {
      // В демо-режиме не используем токен авторизации
      return headers;
    }
  }),
  tagTypes: ['Documents'],
  endpoints: (builder) => ({
    getProjectDocuments: builder.query<DocumentDto[], string>({
      query: (projectId) => `/projects/${projectId}/documents`,
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Documents' as const, id })),
              { type: 'Documents', id: 'LIST' },
            ]
          : [{ type: 'Documents', id: 'LIST' }],
    }),
    
    getDocument: builder.query<DocumentDto, { projectId: string; documentId: string }>({
      query: ({ projectId, documentId }) => `/projects/${projectId}/documents/${documentId}`,
      providesTags: (result, error, { documentId }) => [{ type: 'Documents', id: documentId }],
    }),
    
    uploadDocument: builder.mutation<DocumentDto, UploadDocumentParams>({
      query: ({ projectId, content, fileName }) => ({
        url: `/projects/${projectId}/documents`,
        method: 'POST',
        body: { content, fileName },
      }),
      invalidatesTags: [{ type: 'Documents', id: 'LIST' }],
    }),
    
    updateDocument: builder.mutation<DocumentDto, UpdateDocumentParams>({
      query: ({ projectId, documentId, content, fileName }) => ({
        url: `/projects/${projectId}/documents/${documentId}`,
        method: 'PUT',
        body: { content, fileName },
      }),
      invalidatesTags: (result, error, { documentId }) => [{ type: 'Documents', id: documentId }],
    }),
    
    deleteDocument: builder.mutation<void, DeleteDocumentParams>({
      query: ({ projectId, documentId }) => ({
        url: `/projects/${projectId}/documents/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Documents', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProjectDocumentsQuery,
  useGetDocumentQuery,
  useUploadDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = documentsApi; 