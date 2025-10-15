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
  status: string;
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
      console.log("=== FEEDBACK API HEADERS ===");
      console.log("Base URL:", process.env.NEXT_PUBLIC_BASE_URL);
      console.log("Token exists:", !!token);
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
        console.log("=== FEEDBACK MUTATION QUERY ===");
        console.log("Request URL: /feedback");
        console.log("Request method: POST");
        console.log("Request body:", JSON.stringify(body, null, 2));
        console.log("Body keys:", Object.keys(body));
        console.log("Body values:", Object.values(body));

        return {
          url: "/feedback",
          method: "POST",
          body,
        };
      },
      transformResponse: (response: any) => {
        console.log("=== FEEDBACK MUTATION SUCCESS ===");
        console.log("Response:", response);
        return response;
      },
      transformErrorResponse: (response: any, meta: any, arg: any) => {
        console.error("=== FEEDBACK MUTATION ERROR ===");
        console.error("Error response:", response);
        console.error("Meta:", meta);
        console.error("Original request body:", arg);

        // Log the exact request that was sent
        if (meta?.request) {
          console.error("Request URL:", meta.request.url);
          console.error("Request method:", meta.request.method);
        }

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
