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

export interface UpdateStudentDetailRequest {
  studentCardUrl?: string;
  university?: string;
  major?: string;
  yearsOfStudy?: string;
  userUuid: string;
}

export interface StudentDetailResponse {
  id: string;
  studentCardUrl: string;
  university: string;
  major: string;
  yearsOfStudy: string;
  userUuid: string;
  status: string;
  createDate: string;
  updateDate: string;
}

export const studentApi = createApi({
  reducerPath: "studentApi",
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
  tagTypes: ["Advisers", "StudentDetail"],
  endpoints: (builder) => ({
    getAllAdvisers: builder.query<Adviser[], void>({
      query: () => "/auth/user/adviser",
      providesTags: ["Advisers"],
    }),
    
    createStudentDetail: builder.mutation<
      { message: string },
      CreateStudentDetailRequest
    >({
      query: (body) => ({
        url: "/user-promote/create-student-detail",
        method: "POST",
        body,
        responseHandler: async (response) => {
          const text = await response.text();
          try {
            return JSON.parse(text);
          } catch {
            // If response is plain text, wrap it in an object
            return { message: text };
          }
        },
      }),
      invalidatesTags: ["Advisers", "StudentDetail"],
    }),

    // Updated: Use PATCH method for update with UUID in URL
    updateStudentDetail: builder.mutation<
      { message: string },
      { uuid: string; data: UpdateStudentDetailRequest }
    >({
      query: ({ uuid, data }) => ({
        url: `/user-promote/student/${uuid}`,
        method: "PATCH",
        body: data,
        responseHandler: async (response) => {
          const text = await response.text();
          try {
            return JSON.parse(text);
          } catch {
            return { message: text };
          }
        },
      }),
      invalidatesTags: ["Advisers", "StudentDetail"],
    }),

    // Get student detail by user UUID
    getStudentDetailByUser: builder.query<StudentDetailResponse, string>({
      query: (userUuid) => `/user-promote/student-detail/${userUuid}`,
      providesTags: ["StudentDetail"],
    }),

    // New: Get student detail by student UUID (for update)
    getStudentDetail: builder.query<StudentDetailResponse, string>({
      query: (uuid) => `/user-promote/student/${uuid}`,
      providesTags: ["StudentDetail"],
    }),
  }),
});

export const { 
  useGetAllAdvisersQuery, 
  useCreateStudentDetailMutation,
  useUpdateStudentDetailMutation,
  useGetStudentDetailByUserQuery,
  useGetStudentDetailQuery
} = studentApi;

export default studentApi.reducer;