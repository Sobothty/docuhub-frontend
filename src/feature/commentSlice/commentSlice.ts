import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

// Define interfaces for comment data
export interface Comment {
  uuid: string;
  content: string;
  createdAt: string;
  userUuid: string;
  paperUuid: string;
  parentUuid: string | null;
  replies: Comment[];
  isDeleted: boolean;
}

export interface CommentsResponse {
  paperUuid: string;
  comments: Comment[];
}

export interface CreateCommentRequest {
  content: string;
  paperUuid: string;
  parentUuid?: string | null;
}

export interface UpdateCommentRequest {
  uuid: string;
  content: string;
}

// Public base query (no auth)
const publicBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Authenticated base query
const authenticatedBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: async (headers) => {
    const session = await getSession();
    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// API Slice
export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: publicBaseQuery, // Default to public
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    // Get all comments for a paper (PUBLIC - no auth)
    getCommentsByPaperUuid: builder.query<CommentsResponse, string>({
      query: (paperUuid) => `/comments/paper/${paperUuid}`,
      providesTags: (result, error, paperUuid) => [
        { type: "Comments", id: paperUuid },
      ],
    }),

    // Create a new comment (REQUIRES AUTH)
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      queryFn: async (body, api, extraOptions, baseQuery) => {
        const result = await authenticatedBaseQuery(
          {
            url: "/comments",
            method: "POST",
            body,
          },
          api,
          extraOptions
        );
        return result.data
          ? { data: result.data as Comment }
          : { error: result.error as any };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Comments", id: arg.paperUuid },
      ],
    }),

    // Update a comment (REQUIRES AUTH)
    updateComment: builder.mutation<Comment, UpdateCommentRequest>({
      queryFn: async ({ uuid, content }, api, extraOptions, baseQuery) => {
        const result = await authenticatedBaseQuery(
          {
            url: `/comments/${uuid}`,
            method: "PUT",
            body: { content },
          },
          api,
          extraOptions
        );
        return result.data
          ? { data: result.data as Comment }
          : { error: result.error as any };
      },
      invalidatesTags: (result) =>
        result ? [{ type: "Comments", id: result.paperUuid }] : [],
    }),

    // Delete a comment (REQUIRES AUTH)
    deleteComment: builder.mutation<{ message: string }, string>({
      queryFn: async (uuid, api, extraOptions, baseQuery) => {
        const result = await authenticatedBaseQuery(
          {
            url: `/comments/${uuid}`,
            method: "DELETE",
          },
          api,
          extraOptions
        );
        return result.data
          ? { data: result.data as { message: string } }
          : { error: result.error as any };
      },
      invalidatesTags: ["Comments"],
    }),
  }),
});

// Export hooks
export const {
  useGetCommentsByPaperUuidQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;

// Export reducer
export default commentsApi.reducer;
