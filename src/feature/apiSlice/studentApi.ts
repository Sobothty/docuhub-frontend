import { apiSlide } from './apiSlice';
import {
  StudentRequest,
  StudentResponse,
  UpdateStudentRequest,
  RejectStudentRequest,
  StudentApproveRequest,
  GetPendingStudentsResponse,
  PaginationParams,
  StudentDetailApiResponse
} from '@/types/studentType';

export const studentApi = apiSlide.injectEndpoints({
  endpoints: (builder) => ({
    // Create student detail (for user promotion to student)
    createStudentDetail: builder.mutation<{ message: string }, StudentRequest>({
      query: (studentData) => ({
        url: 'user-promote/create-student-detail',
        method: 'POST',
        body: studentData,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
      invalidatesTags: ['StudentDetail'],
    }),

    // Get student detail by user UUID
    getStudentDetailByUserUuid: builder.query<StudentDetailApiResponse, string>({
      query: (userUuid) => ({
        url: `user-promote/student-detail/${userUuid}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
      providesTags: (result, error, userUuid) => [
        { type: 'StudentDetail', id: userUuid }
      ],
    }),

    // Update student detail by user UUID
    updateStudentDetailByUserUuid: builder.mutation<
      StudentDetailApiResponse,
      { userUuid: string; data: UpdateStudentRequest }
    >({
      query: ({ userUuid, data }) => ({
        url: `user-promote/student-detail/${userUuid}`,
        method: 'PUT',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { userUuid }) => [
        { type: 'StudentDetail', id: userUuid }
      ],
    }),

    // Get pending students (for admin)
    getPendingStudents: builder.query<
      GetPendingStudentsResponse,
      PaginationParams
    >({
      query: ({ page = 0, size = 10 }) => ({
        url: `admin/user-promote/pending-students?page=${page}&size=${size}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
      providesTags: ['StudentDetail'],
    }),

    // Approve student (admin only)
    approveStudent: builder.mutation<{ message: string }, StudentApproveRequest>({
      query: (approveData) => ({
        url: 'admin/user-promote/approve-student',
        method: 'POST',
        body: approveData,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
      invalidatesTags: ['StudentDetail'],
    }),

    // Reject student (admin only)
    rejectStudent: builder.mutation<{ message: string }, RejectStudentRequest>({
      query: (rejectData) => ({
        url: 'admin/user-promote/reject-student',
        method: 'POST',
        body: rejectData,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
      invalidatesTags: ['StudentDetail'],
    }),
  }),
});

export const {
  useCreateStudentDetailMutation,
  useGetStudentDetailByUserUuidQuery,
  useUpdateStudentDetailByUserUuidMutation,
  useGetPendingStudentsQuery,
  useApproveStudentMutation,
  useRejectStudentMutation,
} = studentApi;