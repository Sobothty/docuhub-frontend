import { apiSlide } from "../apiSlice/apiSlice";

export interface RegisterRequest {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmedPassword: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export const authSlice = apiSlide.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<{ message: string; user?: { slug: string; uuid: string; userName: string } }, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = authSlice;
