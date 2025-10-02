import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  AdviserDetail, 
  AdviserDetailRequest, 
  AdviserDetailResponse, 
  AdviserAssignmentResponse,
  UpdateAdviserDetailRequest 
} from '@/types/adviserType';

export const adviserDetailApi = createApi({
  reducerPath: 'adviserDetailApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AdviserDetail', 'AdviserAssignments'],
  endpoints: (builder) => ({
    getAllAdviserDetails: builder.query<AdviserDetailResponse[], void>({
      query: () => '/api/v1/adviser_details',
      providesTags: ['AdviserDetail'],
    }),
    
    getAdviserDetailByUuid: builder.query<AdviserDetailResponse, string>({
      query: (uuid) => `/api/v1/adviser_details/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: 'AdviserDetail', id: uuid }],
    }),
    
    createAdviserDetail: builder.mutation<AdviserDetailResponse, AdviserDetailRequest>({
      query: (adviserDetail) => ({
        url: '/api/v1/adviser_details',
        method: 'POST',
        body: adviserDetail,
      }),
      invalidatesTags: ['AdviserDetail'],
    }),
    
    updateAdviserDetailByUuid: builder.mutation<AdviserDetailResponse, { uuid: string; request: UpdateAdviserDetailRequest }>({
      query: ({ uuid, request }) => ({
        url: `/api/v1/adviser_details/${uuid}`,
        method: 'PUT',
        body: request,
      }),
      invalidatesTags: (result, error, { uuid }) => [{ type: 'AdviserDetail', id: uuid }, 'AdviserDetail'],
    }),
    
    updateAdviserDetailByToken: builder.mutation<AdviserDetailResponse, UpdateAdviserDetailRequest>({
      query: (request) => ({
        url: '/api/v1/adviser_details',
        method: 'PUT',
        body: request,
      }),
      invalidatesTags: ['AdviserDetail'],
    }),
    
    deleteAdviserDetail: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/api/v1/adviser_details/${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdviserDetail'],
    }),
    
    getAdviserAssignments: builder.query<AdviserAssignmentResponse, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => `/api/v1/adviser_details/assignments?page=${page}&size=${size}`,
      providesTags: ['AdviserAssignments'],
    }),
  }),
});

export const {
  useGetAllAdviserDetailsQuery,
  useGetAdviserDetailByUuidQuery,
  useCreateAdviserDetailMutation,
  useUpdateAdviserDetailByUuidMutation,
  useUpdateAdviserDetailByTokenMutation,
  useDeleteAdviserDetailMutation,
  useGetAdviserAssignmentsQuery,
} = adviserDetailApi;