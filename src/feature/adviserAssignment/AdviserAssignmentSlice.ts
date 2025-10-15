import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AssignmentsResponse,
  AssignmentQueryParams,
} from "./adviserAssignmentType";
import { getSession } from "next-auth/react";

export const assignmentApi = createApi({
  reducerPath: "assignmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
      // adjust to how you store token (localStorage / cookie / redux)
      const token = await getSession();
      if (token) {
        headers.set("Authorization", `Bearer ${token.accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Assignments"],
  endpoints: (builder) => ({
    // Get all assignments without pagination
    getAssignmentByAdviser: builder.query<AssignmentsResponse, void>({
      query: () => "/paper/assignments/adviser",
      providesTags: ["Assignments"],
      transformResponse: (
        response: AssignmentsResponse
      ): AssignmentsResponse => {
        try {
          if (response?.data?.content) {
            response.data.content = response.data.content.map((item) => ({
              ...item,
              paper: {
                ...item.paper,
                // map thumbnailUr -> thumbnailUrl for easier use in UI
                thumbnailUrl:
                  item.paper?.thumbnailUr ?? item.paper?.thumbnailUrl ?? null,
              },
            }));
          }
        } catch (e) {
          // if transform fails, just return original response
          console.warn("assignmentApi.transformResponse error", e);
        }
        return response;
      },
    }),

    // Get assignments with pagination
    getAssignmentByAdviserWithPagination: builder.query<
      AssignmentsResponse,
      AssignmentQueryParams
    >({
      query: ({ page = 0, size = 20, sortBy, direction = "asc" } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", size.toString());

        if (sortBy) {
          params.append("sortBy", sortBy);
          params.append("direction", direction);
        }

        return `/paper/assignments/adviser?${params.toString()}`;
      },
      providesTags: ["Assignments"],
      transformResponse: (
        response: AssignmentsResponse
      ): AssignmentsResponse => {
        try {
          if (response?.data?.content) {
            response.data.content = response.data.content.map((item) => ({
              ...item,
              paper: {
                ...item.paper,
                thumbnailUrl:
                  item.paper?.thumbnailUr ?? item.paper?.thumbnailUrl ?? null,
              },
            }));
          }
        } catch (e) {
          // if transform fails, just return original response
          console.warn("assignmentApi.transformResponse error", e);
        }
        return response;
      },
    }),
  }),
});

export const {
  useGetAssignmentByAdviserQuery,
  useGetAssignmentByAdviserWithPaginationQuery,
} = assignmentApi;

export default assignmentApi;
