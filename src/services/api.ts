// API Service Layer for DocuHub Backend Integration
// Base URL: https://api.docuhub.me/api/v1

import { 
  UserCreateDto, 
  UserResponse, 
  LoginDto, 
  UpdateUserDto,
  UpdateUserImageDto,
  CurrentUser,
  UserProfileResponse,
  TokenResponseRecord,
  AuthTokenResponse
} from '@/types/userType';

import {
  AdviserDetailRequest,
  UpdateAdviserDetailRequest,
  AdviserDetailResponse,
  AdviserAssignmentRequest,
  ReassignAdviserRequest,
  AdviserReviewRequest,
  RejectPaperRequest,
  AdviserAssignmentResponse,
  PaginatedAssignmentsResponse,
  SpecializeRequest,
  SpecializeResponse
} from '@/types/adviserType';

import {
  PaperRequest,
  PaperResponse,
  AdminPaperRequest,
  GetPapersResponse,
  PaginationParams
} from '@/types/paperType';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://api.docuhub.me/api/v1';

// Utility function to get auth token from cookies
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

// Base fetch wrapper with error handling
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle responses that might not have JSON body
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response as any;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Authentication Service
export const authService = {
  // Register new user
  register: (userData: UserCreateDto): Promise<UserResponse> =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Login with username/password
  login: (credentials: LoginDto): Promise<any> =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Get current user
  getCurrentUser: (): Promise<CurrentUser> =>
    apiRequest('/auth/user/currentId'),

  // Get user profile
  getUserProfile: (): Promise<UserProfileResponse> =>
    apiRequest('/auth/user/profile'),

  // Refresh token
  refreshToken: (username: string): Promise<any> =>
    apiRequest(`/auth/refresh?username=${username}`, {
      method: 'POST',
    }),

  // Check token validity
  checkTokenValidity: (): Promise<AuthTokenResponse> =>
    apiRequest('/auth/protected-endpoint'),

  // Get tokens (OAuth)
  getTokens: (): Promise<TokenResponseRecord> =>
    apiRequest('/auth/tokens'),
};

// User Management Service
export const userService = {
  // Get all users
  getAllUsers: (): Promise<UserResponse[]> =>
    apiRequest('/auth/users'),

  // Get users with pagination
  getUsersByPage: (page = 0, size = 10): Promise<{
    content: UserResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
  }> =>
    apiRequest(`/auth/users/page?page=${page}&size=${size}`),

  // Get user by UUID
  getUserByUuid: (uuid: string): Promise<UserResponse> =>
    apiRequest(`/auth/user/${uuid}`),

  // Search users by slug/username
  searchUsersByUsername: (username: string): Promise<UserResponse[]> =>
    apiRequest(`/auth/slug?username=${username}`),

  // Update user
  updateUser: (uuid: string, userData: UpdateUserDto): Promise<void> =>
    apiRequest(`/auth/user/${uuid}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }),

  // Update profile image
  updateProfileImage: (uuid: string, imageData: UpdateUserImageDto): Promise<UpdateUserImageDto> =>
    apiRequest(`/auth/user/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(imageData),
    }),

  // Delete user
  deleteUser: (uuid: string): Promise<void> =>
    apiRequest(`/auth/user/${uuid}`, {
      method: 'DELETE',
    }),

  // Get public users
  getPublicUsers: (page = 0, size = 10): Promise<any> =>
    apiRequest(`/auth/user?page=${page}&size=${size}`),

  // Get all students
  getAllStudents: (page = 0, size = 10): Promise<any> =>
    apiRequest(`/auth/user/student?page=${page}&size=${size}`),

  // Get all advisers
  getAllAdvisers: (page = 0, size = 10): Promise<any> =>
    apiRequest(`/auth/user/mentor?page=${page}&size=${size}`),

  // Promote user to student
  promoteToStudent: (uuid: string): Promise<void> =>
    apiRequest(`/auth/user/student/${uuid}`, {
      method: 'POST',
    }),

  // Promote user to adviser
  promoteToAdviser: (uuid: string): Promise<void> =>
    apiRequest(`/auth/user/mentor/${uuid}`, {
      method: 'POST',
    }),
};

// Paper Service
export const paperService = {
  // Create paper (Student)
  createPaper: (paperData: PaperRequest): Promise<string> =>
    apiRequest('/papers', {
      method: 'POST',
      body: JSON.stringify(paperData),
    }),

  // Get all published papers
  getPublishedPapers: (params: PaginationParams = {}): Promise<GetPapersResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.direction) queryParams.append('direction', params.direction);
    
    return apiRequest(`/papers/published?${queryParams.toString()}`);
  },

  // Get paper by UUID
  getPaperByUuid: (uuid: string): Promise<{ paper: PaperResponse; message: string }> =>
    apiRequest(`/papers/${uuid}`),

  // Get author's papers
  getAuthorPapers: (params: PaginationParams = {}): Promise<GetPapersResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.direction) queryParams.append('direction', params.direction);
    
    return apiRequest(`/papers/author?${queryParams.toString()}`);
  },

  // Get author's approved papers
  getAuthorApprovedPapers: (params: PaginationParams = {}): Promise<GetPapersResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.direction) queryParams.append('direction', params.direction);
    
    return apiRequest(`/papers/author/approved?${queryParams.toString()}`);
  },

  // Update paper by author
  updatePaperByAuthor: (uuid: string, paperData: PaperRequest): Promise<{ paper: PaperResponse; message: string }> =>
    apiRequest(`/papers/author/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(paperData),
    }),

  // Delete paper by author
  deletePaperByAuthor: (uuid: string): Promise<string> =>
    apiRequest(`/papers/author/${uuid}`, {
      method: 'DELETE',
    }),
};

// Adviser Service
export const adviserService = {
  // Create adviser detail
  createAdviserDetail: (adviserData: AdviserDetailRequest): Promise<AdviserDetailResponse> =>
    apiRequest('/adviser_details', {
      method: 'POST',
      body: JSON.stringify(adviserData),
    }),

  // Get adviser detail by UUID
  getAdviserDetailByUuid: (uuid: string): Promise<AdviserDetailResponse> =>
    apiRequest(`/adviser_details/${uuid}`),

  // Update adviser detail by UUID
  updateAdviserDetailByUuid: (uuid: string, adviserData: UpdateAdviserDetailRequest): Promise<AdviserDetailResponse> =>
    apiRequest(`/adviser_details/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(adviserData),
    }),

  // Update adviser detail by token (current user)
  updateAdviserDetailByToken: (adviserData: UpdateAdviserDetailRequest): Promise<AdviserDetailResponse> =>
    apiRequest('/adviser_details', {
      method: 'PUT',
      body: JSON.stringify(adviserData),
    }),

  // Delete adviser detail
  deleteAdviserDetail: (uuid: string): Promise<void> =>
    apiRequest(`/adviser_details/${uuid}`, {
      method: 'DELETE',
    }),

  // Get all adviser details
  getAllAdviserDetails: (): Promise<AdviserDetailResponse[]> =>
    apiRequest('/adviser_details'),

  // Get all assignments for current adviser
  getAllAssignments: (page = 0, size = 10): Promise<{ status: number; data: PaginatedAssignmentsResponse }> =>
    apiRequest(`/adviser_details/assignments?page=${page}&size=${size}`),
};

// Adviser Assignment Service
export const assignmentService = {
  // Assign adviser to paper (Admin only)
  assignAdviser: (assignmentData: AdviserAssignmentRequest): Promise<AdviserAssignmentResponse> =>
    apiRequest('/paper/assign-adviser', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    }),

  // Reassign adviser (Admin only)
  reassignAdviser: (reassignmentData: ReassignAdviserRequest): Promise<AdviserAssignmentResponse> =>
    apiRequest('/paper/reassign-adviser', {
      method: 'POST',
      body: JSON.stringify(reassignmentData),
    }),

  // Reject paper (Admin only)
  rejectPaper: (rejectData: RejectPaperRequest): Promise<PaperResponse> =>
    apiRequest('/paper/reject', {
      method: 'POST',
      body: JSON.stringify(rejectData),
    }),

  // Review paper by adviser
  reviewPaper: (reviewData: AdviserReviewRequest): Promise<AdviserAssignmentResponse> =>
    apiRequest('/paper/adviser-review', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),

  // Get assignments by adviser UUID
  getAssignmentsByAdviser: (adviserUuid: string): Promise<AdviserAssignmentResponse[]> =>
    apiRequest(`/paper/adviser/${adviserUuid}`),
};

// Specialize Service
export const specializeService = {
  // Create specialization (Admin only)
  createSpecialize: (specializeData: SpecializeRequest): Promise<SpecializeResponse> =>
    apiRequest('/admin/specializes', {
      method: 'POST',
      body: JSON.stringify(specializeData),
    }),

  // Get all specializations
  getAllSpecializes: (): Promise<SpecializeResponse[]> =>
    apiRequest('/admin/specializes'),

  // Get specialization by UUID
  getSpecializeByUuid: (uuid: string): Promise<SpecializeResponse> =>
    apiRequest(`/admin/specializes/${uuid}`),

  // Update specialization
  updateSpecialize: (uuid: string, specializeData: SpecializeRequest): Promise<SpecializeResponse> =>
    apiRequest(`/admin/specializes/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(specializeData),
    }),

  // Delete specialization
  deleteSpecialize: (uuid: string): Promise<void> =>
    apiRequest(`/admin/specializes/${uuid}`, {
      method: 'DELETE',
    }),
};

// Media Service
export const mediaService = {
  // Upload file
  uploadFile: (file: File): Promise<{
    message: string;
    data: {
      name: string;
      uri: string;
      size: number;
      created_date: string;
    };
  }> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest('/media', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  // Get media
  getMedia: (filename: string): Promise<Blob> =>
    apiRequest(`/media/${filename}`, {
      method: 'GET',
    }),

  // Delete media
  deleteMedia: (filename: string): Promise<void> =>
    apiRequest(`/media/${filename}`, {
      method: 'DELETE',
    }),
};

// Categories Service
export const categoryService = {
  // Create category (Admin only)
  createCategory: (categoryData: { name: string }): Promise<{ message: string }> =>
    apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }),

  // Get all categories with pagination
  getAllCategories: (params: PaginationParams = {}): Promise<any> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.direction) queryParams.append('direction', params.direction);
    
    return apiRequest(`/categories?${queryParams.toString()}`);
  },

  // Update category
  updateCategory: (uuid: string, categoryData: { name: string }): Promise<{ message: string }> =>
    apiRequest(`/categories/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    }),

  // Delete category
  deleteCategory: (uuid: string): Promise<{ message: string }> =>
    apiRequest(`/categories/${uuid}`, {
      method: 'DELETE',
    }),

  // Search categories by slug
  searchCategoriesBySlug: (slug: string, page = 0, size = 10): Promise<any> =>
    apiRequest(`/categories/slug?slug=${slug}&page=${page}&size=${size}`),
};

// Student Service
export const studentService = {
  // Create student detail request
  createStudentDetail: (studentData: {
    studentCardUrl: string;
    university: string;
    major: string;
    yearsOfStudy: string;
    userUuid: string;
  }): Promise<string> =>
    apiRequest('/user-promote/create-student-detail', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),
};

// Feedback Service
export const feedbackService = {
  // Create feedback (Adviser only)
  createFeedback: (feedbackData: {
    feedbackText: string;
    status: 'APPROVED' | 'REJECTED';
    paperUuid: string;
    advisorUuid?: string;
    fileUrl?: string;
    deadline?: string;
  }): Promise<{ message: string }> =>
    apiRequest('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    }),

  // Get all feedback with pagination (Admin only)
  getAllFeedback: (params: PaginationParams = {}): Promise<any> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.direction) queryParams.append('direction', params.direction);
    
    return apiRequest(`/feedback?${queryParams.toString()}`);
  },

  // Update feedback status
  updateFeedbackStatus: (paperUuid: string, feedbackData: {
    status: string;
    feedbackText: string;
  }): Promise<{ message: string }> =>
    apiRequest(`/feedback/${paperUuid}`, {
      method: 'PUT',
      body: JSON.stringify(feedbackData),
    }),
};

// Comments Service
export const commentService = {
  // Create comment
  createComment: (commentData: {
    content: string;
    paperUuid: string;
    parentUuid?: string;
  }): Promise<any> =>
    apiRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),

  // Update comment
  updateComment: (uuid: string, commentData: {
    commentUuid: string;
    content: string;
  }): Promise<any> =>
    apiRequest(`/comments/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(commentData),
    }),

  // Delete comment
  deleteComment: (uuid: string): Promise<{ uuid: string; message: string }> =>
    apiRequest(`/comments/${uuid}`, {
      method: 'DELETE',
    }),

  // Get comment by UUID
  getCommentByUuid: (uuid: string): Promise<any> =>
    apiRequest(`/comments/${uuid}`),

  // Get comments for paper
  getCommentsForPaper: (paperUuid: string): Promise<any> =>
    apiRequest(`/comments/paper/${paperUuid}`),

  // Get replies for comment
  getCommentReplies: (uuid: string): Promise<any> =>
    apiRequest(`/comments/${uuid}/replies`),
};

// Star Service
export const starService = {
  // Star a paper
  starPaper: (paperUuid: string): Promise<any> =>
    apiRequest(`/stars/${paperUuid}`, {
      method: 'POST',
    }),

  // Unstar a paper
  unstarPaper: (paperUuid: string): Promise<void> =>
    apiRequest(`/stars/${paperUuid}`, {
      method: 'DELETE',
    }),

  // Get star count for paper
  getStarCount: (paperUuid: string): Promise<number> =>
    apiRequest(`/stars/${paperUuid}/count`),

  // Get users who starred paper
  getUsersWhoStarred: (paperUuid: string): Promise<any[]> =>
    apiRequest(`/stars/${paperUuid}/users`),
};

export default {
  auth: authService,
  users: userService,
  papers: paperService,
  advisers: adviserService,
  assignments: assignmentService,
  specializes: specializeService,
  media: mediaService,
  categories: categoryService,
  students: studentService,
  feedback: feedbackService,
  comments: commentService,
  stars: starService,
};