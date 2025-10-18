// profileApi.ts - Updated with correct adviser details endpoint
"use client";

import { UserProfileResponse, UserResponse, AdviserDetailResponse } from "@/types/userType";
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

// Helper function to transform frontend data to backend format
const transformUserDataForBackend = (data: any): UpdateUserDto => {
  const transformed: UpdateUserDto = {};
  
  // Map frontend fields to backend fields
  if (data.firstName !== undefined) transformed.firstName = data.firstName;
  if (data.lastName !== undefined) transformed.lastName = data.lastName;
  if (data.gender !== undefined) transformed.gender = data.gender;
  if (data.email !== undefined) transformed.email = data.email;
  if (data.contactNumber !== undefined) transformed.contactNumber = data.contactNumber;
  if (data.address !== undefined) transformed.address = data.address;
  if (data.bio !== undefined) transformed.bio = data.bio;
  if (data.telegramId !== undefined) transformed.telegramId = data.telegramId;
  
  // Generate fullName from firstName and lastName
  if (data.firstName && data.lastName) {
    transformed.fullName = `${data.firstName} ${data.lastName}`;
  }
  
  // Remove null/empty values
  Object.keys(transformed).forEach(key => {
    if (transformed[key as keyof UpdateUserDto] === null || 
        transformed[key as keyof UpdateUserDto] === '' || 
        transformed[key as keyof UpdateUserDto] === undefined) {
      delete transformed[key as keyof UpdateUserDto];
    }
  });
  
  return transformed;
};

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
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: "/auth/user/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    // Updated to transform data before sending
    updateUserProfile: builder.mutation<UserResponse, { uuid: string; updateData: any }>({
      query: ({ uuid, updateData }) => {
        const transformedData = transformUserDataForBackend(updateData);
        console.log("Transformed user update data:", transformedData);
        
        return {
          url: `/auth/user/${uuid}`,
          method: "PATCH",
          body: transformedData,
        };
      },
      invalidatesTags: ["Profile"],
    }),

    // UPDATED: Adviser details now requires UUID
    updateAdviserDetails: builder.mutation<AdviserDetailResponse, { uuid: string; updateData: UpdateAdviserDetailsDto }>({
      query: ({ uuid, updateData }) => {
        const cleanedData = { ...updateData };
        
        // Remove null/empty values
        Object.keys(cleanedData).forEach(key => {
          if (cleanedData[key as keyof UpdateAdviserDetailsDto] === null || 
              cleanedData[key as keyof UpdateAdviserDetailsDto] === '' || 
              cleanedData[key as keyof UpdateAdviserDetailsDto] === undefined) {
            delete cleanedData[key as keyof UpdateAdviserDetailsDto];
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
    }),
  }),
});

export const { 
  useGetUserProfileQuery, 
  useUpdateUserProfileMutation,
  useUpdateAdviserDetailsMutation 
} = profileApi;