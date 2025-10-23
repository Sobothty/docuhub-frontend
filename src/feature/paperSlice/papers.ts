import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryApi,
} from "@reduxjs/toolkit/query/react";
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

interface SinglePaperResponse {
  message: string;
  paper: Paper;
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

export interface updatePaperRequest{
  title: string;
  abstractText?: string;
  fileUrl: string;
  thumbnailUrl: string;
  categoryNames: string[];
}

// Custom base query to handle text responses
const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>
) => {
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
    updatePaper: builder.mutation<PaperCreateResponse, {uuid: string, paperData: updatePaperRequest}>({
      query: ({uuid, paperData}) => ({
        url: `/papers/author/${uuid}`,
        method: "PUT",
        body: paperData,
      }),
    }),
    getAllPublishedPapers: builder.query<ApiResponse, PaginationParams>({
      queryFn: async (arg, api, extraOptions) => {
        const {
          page = 0,
          size = 10,
          sortBy = "publishedAt",
          direction = "desc",
        } = arg;

        const result = await publicBaseQuery(
          `/papers/published?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
          api,
          extraOptions
        );
        if (result.data) {
          return { data: result.data as ApiResponse };
        } else {
          return {
            error: result.error || {
              status: "FETCH_ERROR",
              error: "Unknown error occurred",
            },
          };
        }
      },
      providesTags: ["Papers"],
    }),
    createPublicDownload: builder.mutation<void, string>({
      async queryFn(paperUuid, api, extraOptions) {
        const result = await publicBaseQuery(
          {
            url: `/papers/download/${paperUuid}`,
            method: "POST",
          },
          api,
          extraOptions
        );
        if (result.error) {
          return { error: result.error };
        }
        return { data: result.data as void };
      },
    }),
    
    getAllAssignments: builder.query<Assignment[], void>({
      query: () => ({
        url: "/paper/assignments/author",
      }),
      providesTags: ["Papers"],
    }),
    getAllAdviserAssignments: builder.query<Assignment[], string>({
      query: (adviserUuid) => `/paper/assignments/adviser/${adviserUuid}`,
      providesTags: ["Papers"],
    }),
    getPaperByUuid: builder.query<SinglePaperResponse, string>({
      query: (uuid) => `/papers/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Papers", id: uuid }],
    }),
    deletePaper: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/papers/author/${uuid}`,
        method: "DELETE",
      }),
    })
  }),
});

// Export hooks
export const {
  useGetPapersByAuthorQuery,
  useCreatePaperMutation,
  useGetAllPublishedPapersQuery,
  useGetAllAssignmentsQuery,
  useGetAllAdviserAssignmentsQuery,
  useGetPaperByUuidQuery,
  useDeletePaperMutation,
  useUpdatePaperMutation,
  useCreatePublicDownloadMutation,
} = papersApi;

// Export reducer
export default papersApi.reducer;
