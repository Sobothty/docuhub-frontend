import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

interface Star {
  paperUuid : string;
  userUuid : string;
}

const starSlice = createApi({
  reducerPath: "starSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await getSession();
      if (session?.accessToken) {
        headers.set("Authorization", `Bearer ${session.accessToken}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["starSlice"],
  endpoints: (builder) => ({
    getAllStarOfPapers: builder.query<Star[], void>({
      query: () => "/papers/author/papers/stars",
      providesTags: ["starSlice"],
    }),
  }),
});

export const { useGetAllStarOfPapersQuery } = starSlice;

export default starSlice;
