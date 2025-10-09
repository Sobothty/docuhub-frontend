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

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await getSession();
      if (token) {
        headers.set("authorization", `Bearer ${token.accessToken}`);
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
  }),
});

export const { useGetAllAdvisersQuery } = studentApi;
export default studentApi.reducer;
