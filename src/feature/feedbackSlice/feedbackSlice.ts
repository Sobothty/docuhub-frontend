import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

// Define the feedback response type
interface Feedback {
  feedbackText: string;
  status: string;
  paperUuid: string;
  fileUrl: string;
  deadline: string | null;
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

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
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
  tagTypes: ["Feedback"],
  endpoints: (builder) => ({
    getFeedbackByPaperUuid: builder.query<FeedbackResponse, string>({
      query: (paperUuid) => `/feedback/${paperUuid}`,
      providesTags: (result, error, paperUuid) => [
        { type: "Feedback", id: paperUuid },
      ],
    }),
  }),
});

export const { useGetFeedbackByPaperUuidQuery } = feedbackApi;
export default feedbackApi.reducerPath;
