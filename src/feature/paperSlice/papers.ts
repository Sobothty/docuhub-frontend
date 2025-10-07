import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { url } from "inspector";
import { getSession } from "next-auth/react";

// Define interfaces
export interface Paper {
  uuid: string;
  title: string;
  abstractText: string;
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
  downloads: number;
}

interface PaperCreateRequest {
  title: string;
  abstractText?: string;
  fileUrl: string;
  thumbnailUrl: string;
  categoryNames: string[];
}

interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: string;
}

export interface PapersResponse {
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

interface PaperCreateResponse {
  message: string;
}

export interface Assignment {
  uuid: string;
  paperUuid: string;
  adviserUuid: string;
  adminUuid: string;
  deadline: string;
  status: string;
  assignedDate: string;
  updateDate: string | null;
}

// Custom base query to handle text responses
const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const result = await fetchBaseQuery({
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
  })(args, api, extraOptions);

  // Handle PARSING_ERROR when backend returns plain text with success status
  if (result.error && result.error.status === "PARSING_ERROR") {
    const textMessage = result.error.data as string;
    console.log("Backend returned text response:", textMessage);

    // Convert to successful response
    return {
      data: { message: textMessage },
    };
  }

  return result;
};

const publicBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Create API slice
export const papersApi = createApi({
  reducerPath: "papersApi",
  baseQuery: customBaseQuery,
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
    createPaper: builder.mutation<PaperCreateResponse, PaperCreateRequest>({
      query: (paperData) => ({
        url: "/papers",
        method: "POST",
        body: paperData,
      }),
      invalidatesTags: ["Papers"],
    }),
    getAllPublishedPapers: builder.query<ApiResponse, PaginationParams>({
      query: ({
        page = 0,
        size = 10,
        sortBy = "publishedAt",
        direction = "desc",
      }) => ({
        url: `/papers/published?page=${page}&size=${size}$sortBy=${sortBy}&direction=${direction}`,
        params: { page, size, sortBy, direction },
        queryFn: async (
          arg: {
            page?: 0 | undefined;
            size?: 10 | undefined;
            sortBy?: "publishedAt" | undefined;
            direction?: "desc" | undefined;
          },
          api: BaseQueryApi,
          extraOptions: {}
        ) => {
          const {
            page = 0,
            size = 10,
            sortBy = "publishedAt",
            direction = "desc",
          } = arg;
          const result = await publicBaseQuery(
            `/papers?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
            api,
            extraOptions
          );
          return result.data
            ? { data: result.data as ApiResponse }
            : { error: result.error };
        },
        providesTags: ["Papers"],
      }),
    }),
    getAllAssignments: builder.query<Assignment[], void>({
      query: () => ({
        url: "/paper/assignments/author",
      }),
      providesTags: ["Papers"],
    }),
    getPaperByUuid: builder.query<Paper, string>({
      query: (uuid) => `/papers/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Papers", id: uuid }],
    })
  }),
});

// Export hooks
export const {
  useGetPapersByAuthorQuery,
  useCreatePaperMutation,
  useGetAllPublishedPapersQuery,
  useGetAllAssignmentsQuery,
  useGetPaperByUuidQuery,
} = papersApi;

// Export reducer
export default papersApi.reducer;
