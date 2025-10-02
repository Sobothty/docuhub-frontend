import { apiSlide } from "../apiSlice/apiSlice";
import { UserProfileResponse } from "@/types/authTypes";

export const authApi = apiSlide.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: "/auth/user/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserProfileQuery } = authApi;
