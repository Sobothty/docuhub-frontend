import { apiSlide } from './apiSlice';
import {
  LoginRequest,
  UserCreateRequest,
  UpdateUserRequest,
  UpdateUserImageRequest,
  UserResponse,
  AuthResponse,
  TokenResponse,
  CurrentUser,
  UserProfileResponse,
  ApiResponse
} from '@/types/userAuthType';

export const userAuthApi = apiSlide.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['User'],
    }),

    register: builder.mutation<UserResponse, UserCreateRequest>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['User'],
    }),

    // Token management
    getTokens: builder.query<TokenResponse, void>({
      query: () => ({
        url: 'auth/tokens',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    refreshTokens: builder.query<TokenResponse, void>({
      query: () => ({
        url: 'auth/refreshTokens',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    checkAuthStatus: builder.query<any, void>({
      query: () => ({
        url: 'auth/protected-endpoint',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    refreshToken: builder.mutation<{ status: string }, { username: string }>({
      query: (data) => ({
        url: 'auth/refresh',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    // User management
    getCurrentUser: builder.query<CurrentUser, void>({
      query: () => ({
        url: 'auth/user/currentId',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    getUserProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: 'auth/user/profile',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    getUserById: builder.query<UserResponse, string>({
      query: (uuid) => ({
        url: `auth/user/${uuid}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, uuid) => [{ type: 'User', id: uuid }],
    }),

    getAllUsers: builder.query<UserResponse[], void>({
      query: () => ({
        url: 'auth/users',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    getAllUsersByPage: builder.query<ApiResponse<{
      content: UserResponse[];
      totalElements: number;
      totalPages: number;
      number: number;
    }>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => ({
        url: `auth/users/page?page=${page}&size=${size}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    searchUserByUsername: builder.query<UserResponse[], string>({
      query: (username) => ({
        url: `auth/slug?username=${username}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    // User updates
    updateUser: builder.mutation<void, { uuid: string; data: UpdateUserRequest }>({
      query: ({ uuid, data }) => ({
        url: `auth/user/${uuid}`,
        method: 'PATCH',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { uuid }) => [
        { type: 'User', id: uuid },
        'User'
      ],
    }),

    updateUserImage: builder.mutation<UpdateUserImageRequest, { uuid: string; data: UpdateUserImageRequest }>({
      query: ({ uuid, data }) => ({
        url: `auth/user/${uuid}`,
        method: 'PUT',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { uuid }) => [
        { type: 'User', id: uuid },
        'User'
      ],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `auth/user/${uuid}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),

    // Role-based endpoints
    getAllPublicUsers: builder.query<ApiResponse<any>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => ({
        url: `auth/user?page=${page}&size=${size}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    getAllStudents: builder.query<ApiResponse<any>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => ({
        url: `auth/user/student?page=${page}&size=${size}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    getAllMentors: builder.query<ApiResponse<any>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => ({
        url: `auth/user/mentor?page=${page}&size=${size}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    // User promotion
    promoteToStudent: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `auth/user/student/${uuid}`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),

    promoteToMentor: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `auth/user/mentor/${uuid}`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useGetTokensQuery,
  useRefreshTokensQuery,
  useCheckAuthStatusQuery,
  useRefreshTokenMutation,
  
  // User data
  useGetCurrentUserQuery,
  useGetUserProfileQuery,
  useGetUserByIdQuery,
  useGetAllUsersQuery,
  useGetAllUsersByPageQuery,
  useSearchUserByUsernameQuery,
  
  // User management
  useUpdateUserMutation,
  useUpdateUserImageMutation,
  useDeleteUserMutation,
  
  // Role-based
  useGetAllPublicUsersQuery,
  useGetAllStudentsQuery,
  useGetAllMentorsQuery,
  
  // Promotion
  usePromoteToStudentMutation,
  usePromoteToMentorMutation,
} = userAuthApi;