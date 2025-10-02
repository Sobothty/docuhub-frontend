import { apiSlide } from './apiSlice';
import { 
  Paper, 
  GetPapersResponse, 
  PaperRequest, 
  AdminPaperRequest, 
  PaperResponse,
  PaginationParams 
} from '@/types/paperType';

export interface User {
  uuid: string;
  // Some endpoints may return different name fields; keep them optional
  name?: string;
  fullName?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  imageUrl?: string | null;
}

export const paperApi = apiSlide.injectEndpoints({
  endpoints: (builder) => ({
    // PUBLIC ENDPOINTS
    getPapers: builder.query<GetPapersResponse, void>({
      query: () => "papers",
      providesTags: ['Paper'],
    }),
    
    getPapersWithPagination: builder.query<
      GetPapersResponse,
      PaginationParams
    >({
      query: ({ page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' }) => ({
        url: `papers/published?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: [{ type: "Paper" }],
    }),
    
    getPaperById: builder.query<{ paper: PaperResponse; message: string }, string>({
      query: (uuid) => `papers/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: 'Paper', id: uuid }],
    }),
    
    getUserById: builder.query<User, string>({
      query: (uuid) => `users/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: 'User', id: uuid }],
    }),
    
    // AUTHOR ENDPOINTS (Protected)
    getPapersByAuthor: builder.query<GetPapersResponse, PaginationParams>({
      query: ({ page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' }) => ({
        url: `papers/author?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      }),
      providesTags: ['Paper'],
    }),
    
    getApprovedPapersByAuthor: builder.query<GetPapersResponse, PaginationParams>({
      query: ({ page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' }) => ({
        url: `papers/author/approved?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      }),
      providesTags: ['Paper'],
    }),
    
    createPaper: builder.mutation<{ message: string }, PaperRequest>({
      query: (paper) => ({
        url: 'papers',
        method: 'POST',
        body: paper,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      }),
      invalidatesTags: ['Paper'],
    }),
    
    updatePaperByAuthor: builder.mutation<
      { paper: PaperResponse; message: string }, 
      { uuid: string; data: PaperRequest }
    >({
      query: ({ uuid, data }) => ({
        url: `papers/author/${uuid}`,
        method: 'PUT',
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { uuid }) => [{ type: 'Paper', id: uuid }],
    }),
    
    deletePaperByAuthor: builder.mutation<{ message: string }, string>({
      query: (uuid) => ({
        url: `papers/author/${uuid}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Paper'],
    }),
    
    // ADMIN ENDPOINTS (Protected)
    getAllPapersForAdmin: builder.query<GetPapersResponse, PaginationParams>({
      query: ({ page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' }) => ({
        url: `admin/papers?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      }),
      providesTags: ['Paper'],
    }),
    
    getAllApprovedPapersForAdmin: builder.query<GetPapersResponse, PaginationParams>({
      query: ({ page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' }) => ({
        url: `admin/papers/approved?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      }),
      providesTags: ['Paper'],
    }),
    
    getAllPendingPapersForAdmin: builder.query<GetPapersResponse, PaginationParams>({
      query: ({ page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' }) => ({
        url: `admin/papers/pending?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      }),
      providesTags: ['Paper'],
    }),
    
    updatePaperByAdmin: builder.mutation<
      { message: string }, 
      { uuid: string; data: AdminPaperRequest }
    >({
      query: ({ uuid, data }) => ({
        url: `admin/papers/${uuid}`,
        method: 'PUT',
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { uuid }) => [{ type: 'Paper', id: uuid }],
    }),
    
    deletePaperByAdmin: builder.mutation<{ message: string }, string>({
      query: (uuid) => ({
        url: `admin/papers/${uuid}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Paper'],
    }),
  }),
});

export const {
  // Public endpoints
  useGetPapersQuery,
  useGetPapersWithPaginationQuery,
  useGetPaperByIdQuery,
  useGetUserByIdQuery,
  
  // Author endpoints
  useGetPapersByAuthorQuery,
  useGetApprovedPapersByAuthorQuery,
  useCreatePaperMutation,
  useUpdatePaperByAuthorMutation,
  useDeletePaperByAuthorMutation,
  
  // Admin endpoints
  useGetAllPapersForAdminQuery,
  useGetAllApprovedPapersForAdminQuery,
  useGetAllPendingPapersForAdminQuery,
  useUpdatePaperByAdminMutation,
  useDeletePaperByAdminMutation,
} = paperApi;
