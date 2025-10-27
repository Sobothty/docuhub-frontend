'use client';

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

/**
 * StarResponse interface represents the response from star/unstar operations
 * This matches the Spring Boot backend DTO structure
 */
export interface StarResponse {
  paperUuid: string;
  userUuid: string;
  starred: boolean;
  message: string;
  starCount: number;
}

/**
 * UserPublicResponse interface represents user data returned by the API
 * Used for endpoints that return user information
 */
export interface UserPublicResponse {
  uuid: string;
  slug: string;
  gender: string;
  fullName: string;
  imageUrl: string;
  status: string;
  createDate: string;
  updateDate: string;
  bio: string;
  isUser: boolean;
  isAdmin: boolean;
  isAdvisor: boolean;
  isStudent: boolean;
}

/**
 * HasStarredResponse interface for the hasUserStarred endpoint response
 */
export interface HasStarredResponse {
  paperUuid: string;
  userUuid: string;
  hasStarred: boolean;
}

// Use environment variable for base URL with fallback for local development
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Star API slice using RTK Query
 * Provides endpoints for star/unstar operations and star count queries
 */
const starSlice = createApi({
  // Unique reducer path for this slice
  reducerPath: "starApi",
  
  // Configure base query with authentication
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers) => {
      try {
        // Get the current session for authentication
        const session = await getSession();
        
        // Add Bearer token to authorization header if user is authenticated
        if (session?.accessToken) {
          headers.set("Authorization", `Bearer ${session.accessToken}`);
        }
      } catch (error) {
        console.log('Error getting session for star API:', error);
      }
      
      // Set content type for all requests
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  
  // Tag types for cache invalidation
  tagTypes: ["Star"],
  
  // API endpoints definition
  endpoints: (builder) => ({
    /**
     * Star a paper - POST /stars/{paperUuid}
     * Adds a star from the current user to the specified paper
     */
    starPaper: builder.mutation<StarResponse, string>({
      query: (paperUuid) => ({
        url: `/stars/${paperUuid}`,
        method: "POST",
      }),
      // Invalidate star cache after successful star
      invalidatesTags: ["Star"],
    }),

    /**
     * Unstar a paper - DELETE /stars/{paperUuid}
     * Removes the star from the current user for the specified paper
     */
    unstarPaper: builder.mutation<StarResponse, string>({
      query: (paperUuid) => ({
        url: `/stars/${paperUuid}`,
        method: "DELETE",
      }),
      // Invalidate star cache after successful unstar
      invalidatesTags: ["Star"],
    }),

    /**
     * Get star count - GET /stars/{paperUuid}/count
     * Returns the total number of stars for a paper
     */
    getStarCount: builder.query<number, string>({
      query: (paperUuid) => `/stars/${paperUuid}/count`,
      // Provide tags for cache management
      providesTags: (result, error, paperUuid) => [
        { type: "Star", id: paperUuid }
      ],
    }),

    /**
     * Check if user has starred a paper - GET /stars/{paperUuid}/user/{userUuid}
     * Returns whether the specified user has starred the paper
     */
    hasUserStarred: builder.query<HasStarredResponse, { paperUuid: string; userUuid: string }>({
      query: ({ paperUuid, userUuid }) => `/stars/${paperUuid}/user/${userUuid}`,
      // Provide tags for cache management
      providesTags: (result, error, { paperUuid }) => [
        { type: "Star", id: paperUuid }
      ],
    }),

    /**
     * Get users who starred a paper - GET /stars/{paperUuid}/users
     * Returns list of users who have starred the specified paper
     */
    getUsersWhoStarred: builder.query<UserPublicResponse[], string>({
      query: (paperUuid) => `/stars/${paperUuid}/users`,
      // Provide tags for cache management
      providesTags: (result, error, paperUuid) => [
        { type: "Star", id: paperUuid }
      ],
    }),

    /**
     * Get all stars by user - GET /stars/user/{userUuid}
     * Returns all papers starred by the specified user
     */
    getUserStars: builder.query<StarResponse[], string>({
      query: (userUuid) => `/stars/user/${userUuid}`,
      // Provide tags for cache management
      providesTags: ["Star"],
    }),
  }),
});

// Export hooks for usage in React components
export const {
  useStarPaperMutation,
  useUnstarPaperMutation,
  useGetStarCountQuery,
  useHasUserStarredQuery,
  useGetUsersWhoStarredQuery,
  useGetUserStarsQuery,
} = starSlice;

// Export the API slice instance
export default starSlice;