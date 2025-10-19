import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

// Define the feedback response type
interface Feedback {
  feedbackText: string;
  status: string;
  paperUuid: string;
  fileUrl: string;
  deadline: string | null;
  adviserImageUrl: string | null;
  advisorName: string;
  receiverName: string;
  createdAt: string;
  updatedAt: string | null;
}

interface FeedbackResponse {
  data: Feedback;
  message: string;
  status: string | number;
}

// For the /feedback/author endpoint which returns an array directly
type AllFeedbackResponse = Feedback[];

// Request type for creating feedback
interface CreateFeedbackRequest {
  paperUuid: string;
  feedbackText: string;
  fileUrl: string;
  status: string;
  advisorUuid: string;
  deadline: string; // Made required, not optional
}

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await getSession();
      console.log("Base URL:", process.env.NEXT_PUBLIC_BASE_URL);
      if (token) {
        headers.set("authorization", `Bearer ${token.accessToken}`);
        console.log("Authorization header set");
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Feedback"],
  endpoints: (builder) => ({
    getFeedbackByPaperUuid: builder.query<Feedback, string>({
      query: (paperUuid) => `/feedback/${paperUuid}`,
      providesTags: (result, error, paperUuid) => [
        { type: "Feedback", id: paperUuid },
      ],
    }),
    getAllFeedbackByAuthor: builder.query<AllFeedbackResponse, void>({
      query: () => `/feedback/author`,
      providesTags: ["Feedback"],
    }),
    createFeedback: builder.mutation<FeedbackResponse, CreateFeedbackRequest>({
      query: (body) => {
        return {
          url: "/feedback",
          method: "POST",
          body,
        };
      },
      transformResponse: (response: FeedbackResponse) => {
        return response;
      },
      transformErrorResponse: (response) => {
        return response;
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Feedback", id: arg.paperUuid },
        "Feedback",
      ],
    }),
  }),
});

export const {
  useGetFeedbackByPaperUuidQuery,
  useGetAllFeedbackByAuthorQuery,
  useCreateFeedbackMutation,
} = feedbackApi;
export default feedbackApi.reducerPath;
