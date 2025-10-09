import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

interface Star {
  paperUuid: string;
  userUuid: string;
}

const publicBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

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
    getAllUserStarredPapers: builder.query<Star[], string>({
      queryFn: async (userUuid, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await publicBaseQuery(
          `/stars/user/${userUuid}`,
          _queryApi,
          _extraOptions
        );
        return result as { data: Star[] };
      },
    }),
  }),
});

export const { useGetAllStarOfPapersQuery, useGetAllUserStarredPapersQuery } =
  starSlice;

export default starSlice;
