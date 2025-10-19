import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  UserResponse, 
  UpdateUserDto, 
  UpdateUserImageDto,
  CurrentUser,
  UserProfileResponse,
} from '@/types/userType';
import { UserQueryParams } from '@/types/authTypes';

// ===============================
// 🔐 AUTH API SLICE CONFIGURATION
// ===============================
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    // ✅ Use your environment variable
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/auth`,
    prepareHeaders: (headers) => {
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Student', 'Mentor', 'Admin'],

  endpoints: (builder) => ({

    // =========================
    // USER MANAGEMENT ENDPOINTS
    // =========================
    getAllUsers: builder.query<UserResponse[], UserQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());
        if (params?.search) queryParams.append('search', params.search);
        const queryString = queryParams.toString();
        return queryString ? `users?${queryString}` : 'users';
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

    // ✅ NEW FEATURE — get student profile by UUID
    getStudentProfile: builder.query<UserProfileResponse, string>({
      query: (uuid) => ({
        url: `user/profile/${uuid}`,
        // ❌ No need for credentials since backend doesn’t require token
      }),
      providesTags: (result, error, uuid) => [{ type: 'User', id: uuid }],
    }),

    // =========================
    // ROLE-BASED QUERIES
    // =========================
    getPublicUsers: builder.query<UserResponse, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => `user?page=${page}&size=${size}`,
      providesTags: ['User'],
    }),

    getAllStudents: builder.query<UserResponse, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => `user/student?page=${page}&size=${size}`,
      providesTags: ['Student'],
    }),

    getAllMentors: builder.query<UserResponse, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => `user/mentor?page=${page}&size=${size}`,
      providesTags: ['Mentor'],
    }),

    // =========================
    // USER CRUD OPERATIONS
    // =========================
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

    // =========================
    // ROLE PROMOTION
    // =========================
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

// ===============================
// EXPORT HOOKS
// ===============================
export const {
  // User
  useGetAllUsersQuery,
  useGetAllUsersByPageQuery,
  useGetUserByIdQuery,
  useSearchUserBySlugQuery,
  useGetCurrentUserIdQuery,
  useGetUserProfileQuery,
  useGetStudentProfileQuery,

  // Role-based
  useGetPublicUsersQuery,
  useGetAllStudentsQuery,
  useGetAllMentorsQuery,

  // CRUD
  useUpdateUserMutation,
  useUpdateUserImageMutation,
  useDeleteUserMutation,

  // Role promotion
  usePromoteToStudentMutation,
  usePromoteToMentorMutation,
} = authApi;

export default authApi.reducer;