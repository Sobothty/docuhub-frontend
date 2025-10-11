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
  tagTypes: ["Advisers"],
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
      invalidatesTags: ["Advisers"],
    }),
  }),
});

export const { useGetAllAdvisersQuery, useCreateStudentDetailMutation } =
  studentApi;
export default studentApi.reducer;
