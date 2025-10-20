// mediaSlice.ts - Fixed version for image upload
import {  UserResponse } from "@/types/userType";
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
      const session = await getSession();
      if (session?.accessToken) {
        headers.set("Authorization", `Bearer ${session.accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Media", "Profile"],
  endpoints: (builder) => ({
    // 🧾 GET single media by ID
    getMediaById: builder.query<MediaResponse, string>({
      query: (id) => `/media/${id}`,
      providesTags: (result, error, id) => [{ type: "Media", id }],
    }),

    // 📤 POST - Upload file to /media endpoint
    createMedia: builder.mutation<MediaResponse, FormData>({
      query: (formData) => ({
        url: "/media",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Media"],
    }),

    // 🖼️ UPDATE user profile image - CORRECTED: Use PUT with imageUrl
    updateProfileImage: builder.mutation<UserResponse, { uuid: string; imageUrl: string }>({
      query: ({ uuid, imageUrl }) => ({
        url: `/auth/user/${uuid}`,
        method: "PUT", // Changed from PATCH to PUT
        body: { imageUrl }, // Send as JSON with imageUrl field
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ["Media", "Profile"],
    }),

    // ❌ DELETE media
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

export const {
  useGetMediaByIdQuery,
  useCreateMediaMutation, // Renamed from useCreateMediaMutation
  useUpdateProfileImageMutation,
  useDeleteMediaMutation,
} = mediaApi;

export default mediaApi.reducer;