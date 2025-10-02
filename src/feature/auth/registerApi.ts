import { apiSlide } from "../apiSlice/apiSlice";

export interface RegisterRequest {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmedPassword: string;
}

interface UserResponse {
  slug: string;
  uuid: string;
  userName: string;
  gender?: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  status?: boolean;
  createDate: string;
  updateDate: string;
  bio?: string;
  address?: string;
  contactNumber?: string;
  telegramId?: string;
  isUser: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isAdvisor: boolean;
}

export const RegisterApi = apiSlide.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<UserResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useRegisterUserMutation } = RegisterApi;
