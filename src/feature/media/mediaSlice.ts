import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

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

export interface DeleteMediaResponse {
  message: string;
}

// Create the API slice
export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
      // Get token from session
      const session = await getSession();
      if (session?.accessToken) {
        headers.set("Authorization", `Bearer ${session.accessToken}`);
      }
      // Don't set Content-Type for FormData - let the browser set it with boundary
      return headers;
    },
  }),
  tagTypes: ["Media"],
  endpoints: (builder) => ({
    // GET single media by ID
    getMediaById: builder.query<MediaResponse, string>({
      query: (id) => `/media/${id}`,
      providesTags: (result, error, id) => [{ type: "Media", id }],
    }),

    // POST - Create/upload media
    createMedia: builder.mutation<MediaResponse, FormData>({
      query: (formData) => ({
        url: "/media",
        method: "POST",
        body: formData,
        // Let the browser set the Content-Type with multipart boundary
      }),
      invalidatesTags: ["Media"],
    }),

    // DELETE media
    deleteMedia: builder.mutation<DeleteMediaResponse, string>({
      query: (mediaId) => ({
        url: `/media/${mediaId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, mediaId) => [
        { type: "Media", id: mediaId },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetMediaByIdQuery,
  useCreateMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;

export default mediaApi.reducer;
