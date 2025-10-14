import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  UserCreateDto, 
  UserResponse, 
  UpdateUserDto, 
  UpdateUserImageDto,
  LoginDto,
  TokenResponseRecord,
  CurrentUser,
  UserProfileResponse,
  AuthTokenResponse
} from '@/types/userType';
import { User, Student, Mentor, UserQueryParams } from '@/types/authTypes';
import { useSession } from 'next-auth/react';

// Create the auth API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/auth',
    prepareHeaders: (headers) => {
      // Add any auth headers here if needed
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Student', 'Mentor', 'Admin'],
  endpoints: (builder) => ({
    // AUTHENTICATION ENDPOINTS
    register: builder.mutation<UserResponse, UserCreateDto>({
      query: (userData) => ({
        url: 'register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    login: builder.mutation<any, LoginDto>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    getTokens: builder.query<TokenResponseRecord, void>({
      query: () => ({
        url: 'tokens',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),
    
    refreshTokens: builder.query<TokenResponseRecord, void>({
      query: () => ({
        url: 'refreshTokens',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),
    
    getProtectedEndpoint: builder.query<AuthTokenResponse, void>({
      query: () => ({
        url: 'protected-endpoint',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),
    
    refreshToken: builder.mutation<{ status: string }, string>({
      query: (username) => ({
        url: `refresh?username=${username}`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),
    
    // USER MANAGEMENT ENDPOINTS
    getAllUsers: builder.query<UserResponse[], UserQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());
        if (params?.search) queryParams.append('search', params.search);
        
        const queryString = queryParams.toString();
        return queryString ? `/users?${queryString}` : '/users';
      },
      providesTags: ['User'],
    }),
    
    getAllUsersByPage: builder.query<UserResponse, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => `users/page?page=${page}&size=${size}`,
      providesTags: ['User'],
    }),

    getUserById: builder.query<UserResponse, string>({
      query: (uuid) => `user/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: 'User', id: uuid }],
    }),
    
    searchUserBySlug: builder.query<UserResponse[], string>({
      query: (username) => `slug?username=${username}`,
      providesTags: ['User'],
    }),
    
    getCurrentUserId: builder.query<CurrentUser, void>({
      query: () => ({
        url: 'user/currentId',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),
    
    getUserProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: 'user/profile',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    // Get all public users
    getPublicUsers: builder.query<UserResponse, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => `user?page=${page}&size=${size}`,
      providesTags: ['User'],
    }),

    // Get all students
    getAllStudents: builder.query<UserResponse, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => `user/student?page=${page}&size=${size}`,
      providesTags: ['Student'],
    }),

    // Get all mentors/advisors
    getAllMentors: builder.query<UserResponse, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => `user/mentor?page=${page}&size=${size}`,
      providesTags: ['Mentor'],
    }),
    
    // USER CRUD OPERATIONS
    updateUser: builder.mutation<void, { uuid: string; data: UpdateUserDto }>({
      query: ({ uuid, data }) => ({
        url: `user/${uuid}`,
        method: 'PATCH',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { uuid }) => [{ type: 'User', id: uuid }],
    }),
    
    updateUserImage: builder.mutation<UpdateUserImageDto, { uuid: string; data: UpdateUserImageDto }>({
      query: ({ uuid, data }) => ({
        url: `user/${uuid}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { uuid }) => [{ type: 'User', id: uuid }],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `user/${uuid}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['User', 'Student', 'Mentor'],
    }),
    
    // ROLE PROMOTION ENDPOINTS
    promoteToStudent: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `user/student/${uuid}`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['User', 'Student'],
    }),
    
    promoteToMentor: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `user/mentor/${uuid}`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['User', 'Mentor'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Authentication hooks
  useRegisterMutation,
  useLoginMutation,
  useGetTokensQuery,
  useRefreshTokensQuery,
  useGetProtectedEndpointQuery,
  useRefreshTokenMutation,
  
  // User management hooks
  useGetAllUsersQuery,
  useGetAllUsersByPageQuery,
  useGetUserByIdQuery,
  useSearchUserBySlugQuery,
  useGetCurrentUserIdQuery,
  useGetUserProfileQuery,
  
  // User role-based queries
  useGetPublicUsersQuery,
  useGetAllStudentsQuery,
  useGetAllMentorsQuery,
  
  // User CRUD operations
  useUpdateUserMutation,
  useUpdateUserImageMutation,
  useDeleteUserMutation,
  
  // Role promotion
  usePromoteToStudentMutation,
  usePromoteToMentorMutation,
} = authApi;

// Export the reducer
export default authApi.reducer;