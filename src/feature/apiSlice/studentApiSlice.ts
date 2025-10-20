// features/users/studentSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export interface Adviser {
  slug: string;
  uuid: string;
  gender: string | null;
  fullName: string;
  imageUrl: string | null;
  status: string | null;
  createDate: string;
  updateDate: string;
  bio: string | null;
  isUser: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isAdvisor: boolean;
}

export interface CreateStudentDetailRequest {
  studentCardUrl: string;
  university: string;
  major: string;
  yearsOfStudy: string;
  userUuid: string;
}

export interface UpdateProfileRequest {
  userName?: string;
  gender?: string;
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  status?: boolean;
  bio?: string;
  address?: string;
  contactNumber?: string;
  telegramId?: string;
  imageUrl?: string;
}

export interface ApiResponse {
  message: string;
}

export interface MediaUploadResponse {
  url: string;
  message: string;
}

export const studentApi = createApi({
  reducerPath: "studentApi", // This must match what's in your store
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
  tagTypes: ["Advisers", "Profile"],
  endpoints: (builder) => ({
    getAllAdvisers: builder.query<Adviser[], void>({
      query: () => "/auth/user/adviser",
      providesTags: ["Advisers"],
    }),
    createStudentDetail: builder.mutation<
      ApiResponse,
      CreateStudentDetailRequest
    >({
      query: (body) => ({
        url: "/user-promote/create-student-detail",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Advisers"],
    }),
    
    updateProfile: builder.mutation<
      ApiResponse,
      { uuid: string; data: UpdateProfileRequest }
    >({
      query: ({ uuid, data }) => ({
        url: `/auth/user/${uuid}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    uploadMedia: builder.mutation<
      MediaUploadResponse,
      FormData
    >({
      query: (formData) => ({
        url: "/media",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { 
  useGetAllAdvisersQuery, 
  useCreateStudentDetailMutation,
  useUpdateProfileMutation,
  useUploadMediaMutation
} = studentApi;
