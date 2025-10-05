import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

// Define types for media
export interface Media {
  name: string;
  uri: string;
  size: number;
  created_date: string;
}

export interface MediaResponse {
  data: Media;
  message: string;
}

export interface CreateMediaRequest {
  file: File;
  name?: string;
}

// Create the API slice
export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
      // Get token from localStorage or your auth state
      const token = await getSession();
      if (token) {
        headers.set('Authorization', `Bearer ${token.accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Media'],
  endpoints: (builder) => ({
    // GET single media by ID
    getMediaById: builder.query<MediaResponse, string>({
      query: (id) => `/media/${id}`,
      providesTags: ['Media'],
    }),
    
    // POST - Create/upload media
    createMedia: builder.mutation<MediaResponse, FormData>({
      query: (formData) => ({
        url: '/media',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Media'],
    }),
    
    // DELETE media
    deleteMedia: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/media/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Media'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetMediaByIdQuery,
  useCreateMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
