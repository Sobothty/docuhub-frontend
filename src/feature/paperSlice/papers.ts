import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { getSession } from "next-auth/react";

// Define interfaces
interface Paper {
  uuid: string;
  title: string;
  abstractText?: string;
  fileUrl: string;
  thumbnailUrl: string;
  authorUuid: string;
  categoryNames: string[];
  status: string;
  isApproved: boolean;
  submittedAt: string;
  createdAt: string;
  isPublished: boolean;
  publishedAt: string;
}

interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: string;
}

interface PapersResponse {
  content: Paper[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

interface ApiResponse {
  message: string;
  papers: PapersResponse;
}

// Create API slice
export const papersApi = createApi({
  reducerPath: "papersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await getSession();
      if (token?.accessToken) {
        headers.set("Authorization", `Bearer ${token.accessToken}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Papers"],
  endpoints: (builder) => ({
    getPapersByAuthor: builder.query<ApiResponse, PaginationParams>({
      query: ({
        page = 0,
        size = 10,
        sortBy = "createdAt",
        direction = "desc",
      }) =>
        `/papers/author?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
      providesTags: ["Papers"],
    }),
  }),
});

// Export hooks
export const { useGetPapersByAuthorQuery } = papersApi;

// Export reducer
export default papersApi.reducer;
