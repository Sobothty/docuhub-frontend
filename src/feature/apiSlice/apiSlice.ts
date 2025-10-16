import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlide = createApi({
  reducerPath: "apiSlide",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1", // Use internal Next.js API routes
  }),
  tagTypes: ["Paper", "User", "StudentDetail", "Profile"],
  endpoints: () => ({}),
});