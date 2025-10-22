// profileApi.ts - Fully typed version with student details support
"use client";

import { 
  UserProfileResponse, 
  UserResponse, 
  AdviserDetailResponse, 
  StudentResponse 
} from "@/types/userType";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

// Updated DTO interfaces to match backend
export interface UpdateUserDto {
  userName?: string;
  gender?: string;
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  status?: boolean;
  bio?: string;
  address?: string;
  contactNumber?: string;
  telegramId?: string;
}

export interface UpdateAdviserDetailsDto {
  experienceYears?: number;
  linkedinUrl?: string;
  office?: string;
  socialLinks?: string;
  status?: string;
}

export interface UpdateStudentDetailsDto {
  studentCardUrl?: string;
  university?: string;
  major?: string;
  yearsOfStudy?: string;
  status?: string;
}

// Type for the input data from the frontend
interface FrontendUserData {
  userName?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
  bio?: string;
  telegramId?: string;
}
 export interface PendingStudentResponse {
  isStudent: boolean;
}
// Helper function to transform frontend data to backend format
const transformUserDataForBackend = (data: FrontendUserData): UpdateUserDto => {
  const transformed: UpdateUserDto = {};
  
  // Map ALL frontend fields to backend fields including userName
  if (data.userName !== undefined) transformed.userName = data.userName;
  if (data.firstName !== undefined) transformed.firstName = data.firstName;
  if (data.lastName !== undefined) transformed.lastName = data.lastName;
  if (data.gender !== undefined) transformed.gender = data.gender;
  if (data.email !== undefined) transformed.email = data.email;
  if (data.contactNumber !== undefined) transformed.contactNumber = data.contactNumber;
  if (data.address !== undefined) transformed.address = data.address;
  if (data.bio !== undefined) transformed.bio = data.bio;
  if (data.telegramId !== undefined) transformed.telegramId = data.telegramId;
  
  // Generate fullName from firstName and lastName if both are provided
  if (data.firstName && data.lastName) {
    transformed.fullName = `${data.firstName} ${data.lastName}`;
  } else if (data.firstName && !data.lastName) {
    transformed.fullName = data.firstName;
  } else if (!data.firstName && data.lastName) {
    transformed.fullName = data.lastName;
  }
  
  console.log("Transformed user data for backend:", transformed);
  
  return transformed;
};

// Type for API error responses
interface ApiErrorResponse {
  status: number;
  data?: {
    message?: string;
    error?: string;
    statusCode?: number;
  };
}

export const profileApi = createApi({
  reducerPath: "profileApi",
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
  }),
  tagTypes: ["Profile", "PendingStudent"],
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: "/auth/user/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
      transformResponse: (response: UserProfileResponse) => {
        console.log("Profile API Response:", response);
        return response;
      },
    }),

    // Now includes username transformation with proper typing
    updateUserProfile: builder.mutation<
      UserResponse, 
      { uuid: string; updateData: FrontendUserData }
    >({
      query: ({ uuid, updateData }) => {
        const transformedData = transformUserDataForBackend(updateData);
        console.log("Sending user update data to backend:", {
          uuid,
          transformedData,
          originalData: updateData
        });
        
        return {
          url: `/auth/user/${uuid}`,
          method: "PATCH",
          body: transformedData,
        };
      },
      invalidatesTags: ["Profile"],
      transformResponse: (response: UserResponse) => {
        console.log("User update successful:", response);
        return response;
      },
      transformErrorResponse: (error: ApiErrorResponse) => {
        console.log("User update failed:", error);
        return error;
      },
    }),

    updateAdviserDetails: builder.mutation<
      AdviserDetailResponse, 
      { uuid: string; updateData: UpdateAdviserDetailsDto }
    >({
      query: ({ uuid, updateData }) => {
        const cleanedData = { ...updateData };
        
        // Remove null/empty values
        (Object.keys(cleanedData) as Array<keyof UpdateAdviserDetailsDto>).forEach(key => {
          if (cleanedData[key] === null || 
              cleanedData[key] === '' || 
              cleanedData[key] === undefined) {
            delete cleanedData[key];
          }
        });
        
        console.log("Sending adviser update data:", cleanedData);
        
        return {
          url: `/adviser_details/${uuid}`,
          method: "PATCH",
          body: cleanedData,
        };
      },
      invalidatesTags: ["Profile"],
      transformErrorResponse: (error: ApiErrorResponse) => {
        console.log("Adviser update failed:", error);
        return error;
      },
    }),

    // Student details update endpoint with proper typing
    updateStudentDetails: builder.mutation<
      StudentResponse, 
      { uuid: string; updateData: UpdateStudentDetailsDto }
    >({
      query: ({ uuid, updateData }) => {
        const cleanedData = { ...updateData };
        
        // Remove null/empty values for partial updates
        (Object.keys(cleanedData) as Array<keyof UpdateStudentDetailsDto>).forEach(key => {
          if (cleanedData[key] === null || 
              cleanedData[key] === '' || 
              cleanedData[key] === undefined) {
            delete cleanedData[key];
          }
        });
        
        console.log("Sending student update data:", {
          uuid,
          cleanedData,
          endpoint: `/user-promote/student/${uuid}`
        });
        
        return {
          url: `/user-promote/student/${uuid}`,
          method: "PATCH",
          body: cleanedData,
        };
      },
      invalidatesTags: ["Profile"],
      transformResponse: (response: StudentResponse) => {
        console.log("Student update successful:", response);
        return response;
      },
      transformErrorResponse: (error: ApiErrorResponse) => {
        console.log("Student update failed:", error);
        return error;
      },
    }),

    // checkPendingStudent endpoint with proper typing
     checkPendingStudent: builder.query<PendingStudentResponse, string>({
      query: (userUuid) => ({
        url: `/user-promote/pending/student/${userUuid}`,
        method: "GET",
      }),
      providesTags: ["PendingStudent"],
      transformResponse: (response: PendingStudentResponse) => {
        console.log("Pending student check response:", response);
        return response;
      },
      transformErrorResponse: (error: ApiErrorResponse) => {
        console.log("Pending student check failed:", error);
        return error;
      },
    }),
  }),
});

export const { 
  useGetUserProfileQuery, 
  useUpdateUserProfileMutation,
  useUpdateAdviserDetailsMutation,
  useUpdateStudentDetailsMutation,
  useCheckPendingStudentQuery 
} = profileApi;