import { UserProfile } from "@/types/userType";
import { apiSlide } from "../apiSlice/apiSlice";

export const usersApi = apiSlide.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<UserProfile[], void>({
      query: () => ({
        url: "/auth/users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: [{ type: "User" }],
    }),
    getUserById: builder.query<UserProfile, string>({
      query: (id) => `auth/user/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
  }),
});

export const { useGetAllUsersQuery, useGetUserByIdQuery } = usersApi;
