// Custom React Hooks for API Integration
import { useState, useEffect, useCallback } from 'react';
import apiService from '@/services/api';
import { 
  UserResponse, 
  UserProfileResponse,
  PaginationParams,
  UserCreateDto,
  LoginDto,
  UpdateUserDto
} from '@/types/userType';
import { 
  PaperResponse, 
  PaperRequest,
  GetPapersResponse
} from '@/types/paperType';
import { 
  AdviserDetailResponse,
  AdviserDetailRequest,
  UpdateAdviserDetailRequest,
  AdviserAssignmentResponse,
  PaginatedAssignmentsResponse,
  SpecializeResponse
} from '@/types/adviserType';

// Generic hook for API state management
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiState<T>(initialData: T | null = null): [
  ApiState<T>,
  {
    setData: (data: T | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  }
] {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data, error: null }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return [state, { setData, setLoading, setError, reset }];
}

// Authentication Hooks
export function useAuth() {
  const [authState, { setData, setLoading, setError }] = useApiState<UserProfileResponse>();

  const register = useCallback(async (userData: UserCreateDto) => {
    setLoading(true);
    try {
      const response = await apiService.auth.register(userData);
      setError(null);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const login = useCallback(async (credentials: LoginDto) => {
    setLoading(true);
    try {
      const response = await apiService.auth.login(credentials);
      setError(null);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const user = await apiService.auth.getCurrentUser();
      setError(null);
      return user;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get current user');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const profile = await apiService.auth.getUserProfile();
      setData(profile);
      return profile;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get user profile');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  const checkTokenValidity = useCallback(async () => {
    try {
      const tokenInfo = await apiService.auth.checkTokenValidity();
      return tokenInfo;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Token validation failed');
      throw error;
    }
  }, [setError]);

  return {
    ...authState,
    register,
    login,
    getCurrentUser,
    getUserProfile,
    checkTokenValidity,
  };
}

// User Management Hooks
export function useUsers() {
  const [usersState, { setData, setLoading, setError }] = useApiState<UserResponse[]>();

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const users = await apiService.users.getAllUsers();
      setData(users);
      return users;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  const getUsersByPage = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await apiService.users.getUsersByPage(page, size);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getUserByUuid = useCallback(async (uuid: string) => {
    setLoading(true);
    try {
      const user = await apiService.users.getUserByUuid(uuid);
      return user;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch user');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateUser = useCallback(async (uuid: string, userData: UpdateUserDto) => {
    setLoading(true);
    try {
      await apiService.users.updateUser(uuid, userData);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update user');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const deleteUser = useCallback(async (uuid: string) => {
    setLoading(true);
    try {
      await apiService.users.deleteUser(uuid);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete user');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const promoteToStudent = useCallback(async (uuid: string) => {
    setLoading(true);
    try {
      await apiService.users.promoteToStudent(uuid);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to promote user to student');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const promoteToAdviser = useCallback(async (uuid: string) => {
    setLoading(true);
    try {
      await apiService.users.promoteToAdviser(uuid);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to promote user to adviser');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    ...usersState,
    getAllUsers,
    getUsersByPage,
    getUserByUuid,
    updateUser,
    deleteUser,
    promoteToStudent,
    promoteToAdviser,
  };
}

// Papers Hooks
export function usePapers() {
  const [papersState, { setData, setLoading, setError }] = useApiState<GetPapersResponse>();

  const createPaper = useCallback(async (paperData: PaperRequest) => {
    setLoading(true);
    try {
      const response = await apiService.papers.createPaper(paperData);
      setError(null);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create paper');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getPublishedPapers = useCallback(async (params: PaginationParams = {}) => {
    setLoading(true);
    try {
      const papers = await apiService.papers.getPublishedPapers(params);
      setData(papers);
      return papers;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch published papers');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  const getPaperByUuid = useCallback(async (uuid: string) => {
    setLoading(true);
    try {
      const paper = await apiService.papers.getPaperByUuid(uuid);
      return paper;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch paper');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getAuthorPapers = useCallback(async (params: PaginationParams = {}) => {
    setLoading(true);
    try {
      const papers = await apiService.papers.getAuthorPapers(params);
      setData(papers);
      return papers;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch author papers');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  const updatePaper = useCallback(async (uuid: string, paperData: PaperRequest) => {
    setLoading(true);
    try {
      const paper = await apiService.papers.updatePaperByAuthor(uuid, paperData);
      setError(null);
      return paper;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update paper');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const deletePaper = useCallback(async (uuid: string) => {
    setLoading(true);
    try {
      await apiService.papers.deletePaperByAuthor(uuid);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete paper');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    ...papersState,
    createPaper,
    getPublishedPapers,
    getPaperByUuid,
    getAuthorPapers,
    updatePaper,
    deletePaper,
  };
}

// Adviser Hooks
export function useAdvisers() {
  const [advisersState, { setData, setLoading, setError }] = useApiState<AdviserDetailResponse[]>();

  const createAdviserDetail = useCallback(async (adviserData: AdviserDetailRequest) => {
    setLoading(true);
    try {
      const adviser = await apiService.advisers.createAdviserDetail(adviserData);
      setError(null);
      return adviser;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create adviser detail');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getAdviserDetailByUuid = useCallback(async (uuid: string) => {
    setLoading(true);
    try {
      const adviser = await apiService.advisers.getAdviserDetailByUuid(uuid);
      return adviser;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch adviser detail');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getAllAdviserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const advisers = await apiService.advisers.getAllAdviserDetails();
      setData(advisers);
      return advisers;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch adviser details');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  const updateAdviserDetail = useCallback(async (uuid: string, adviserData: UpdateAdviserDetailRequest) => {
    setLoading(true);
    try {
      const adviser = await apiService.advisers.updateAdviserDetailByUuid(uuid, adviserData);
      setError(null);
      return adviser;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update adviser detail');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateAdviserDetailByToken = useCallback(async (adviserData: UpdateAdviserDetailRequest) => {
    setLoading(true);
    try {
      const adviser = await apiService.advisers.updateAdviserDetailByToken(adviserData);
      setError(null);
      return adviser;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update adviser detail');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const deleteAdviserDetail = useCallback(async (uuid: string) => {
    setLoading(true);
    try {
      await apiService.advisers.deleteAdviserDetail(uuid);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete adviser detail');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    ...advisersState,
    createAdviserDetail,
    getAdviserDetailByUuid,
    getAllAdviserDetails,
    updateAdviserDetail,
    updateAdviserDetailByToken,
    deleteAdviserDetail,
  };
}

// Adviser Assignments Hook
export function useAdviserAssignments() {
  const [assignmentsState, { setData, setLoading, setError }] = useApiState<PaginatedAssignmentsResponse>();

  const getAllAssignments = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await apiService.advisers.getAllAssignments(page, size);
      setData(response.data);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch assignments');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  const assignAdviser = useCallback(async (assignmentData: {
    paperUuid: string;
    adviserUuid: string;
    deadline: string;
  }) => {
    setLoading(true);
    try {
      const assignment = await apiService.assignments.assignAdviser(assignmentData);
      setError(null);
      return assignment;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to assign adviser');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const reviewPaper = useCallback(async (reviewData: {
    assignmentUuid: string;
    status: "APPROVED" | "REJECTED";
    comment?: string;
  }) => {
    setLoading(true);
    try {
      const result = await apiService.assignments.reviewPaper(reviewData);
      setError(null);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to review paper');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    ...assignmentsState,
    getAllAssignments,
    assignAdviser,
    reviewPaper,
  };
}

// Media Upload Hook
export function useMedia() {
  const [mediaState, { setLoading, setError }] = useApiState();

  const uploadFile = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const response = await apiService.media.uploadFile(file);
      setError(null);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload file');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const deleteMedia = useCallback(async (filename: string) => {
    setLoading(true);
    try {
      await apiService.media.deleteMedia(filename);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete media');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    ...mediaState,
    uploadFile,
    deleteMedia,
  };
}

// Categories Hook
export function useCategories() {
  const [categoriesState, { setData, setLoading, setError }] = useApiState<any>();

  const getAllCategories = useCallback(async (params: PaginationParams = {}) => {
    setLoading(true);
    try {
      const categories = await apiService.categories.getAllCategories(params);
      setData(categories);
      return categories;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch categories');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  const createCategory = useCallback(async (categoryData: { name: string }) => {
    setLoading(true);
    try {
      const response = await apiService.categories.createCategory(categoryData);
      setError(null);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create category');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    ...categoriesState,
    getAllCategories,
    createCategory,
  };
}

// Comments Hook
export function useComments() {
  const [commentsState, { setLoading, setError }] = useApiState();

  const createComment = useCallback(async (commentData: {
    content: string;
    paperUuid: string;
    parentUuid?: string;
  }) => {
    setLoading(true);
    try {
      const comment = await apiService.comments.createComment(commentData);
      setError(null);
      return comment;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create comment');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getCommentsForPaper = useCallback(async (paperUuid: string) => {
    setLoading(true);
    try {
      const comments = await apiService.comments.getCommentsForPaper(paperUuid);
      return comments;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch comments');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateComment = useCallback(async (uuid: string, commentData: {
    commentUuid: string;
    content: string;
  }) => {
    setLoading(true);
    try {
      const comment = await apiService.comments.updateComment(uuid, commentData);
      setError(null);
      return comment;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update comment');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const deleteComment = useCallback(async (uuid: string) => {
    setLoading(true);
    try {
      await apiService.comments.deleteComment(uuid);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete comment');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    ...commentsState,
    createComment,
    getCommentsForPaper,
    updateComment,
    deleteComment,
  };
}

// Stars Hook
export function useStars() {
  const [starsState, { setLoading, setError }] = useApiState();

  const starPaper = useCallback(async (paperUuid: string) => {
    setLoading(true);
    try {
      const response = await apiService.stars.starPaper(paperUuid);
      setError(null);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to star paper');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const unstarPaper = useCallback(async (paperUuid: string) => {
    setLoading(true);
    try {
      await apiService.stars.unstarPaper(paperUuid);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to unstar paper');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getStarCount = useCallback(async (paperUuid: string) => {
    setLoading(true);
    try {
      const count = await apiService.stars.getStarCount(paperUuid);
      return count;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get star count');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    ...starsState,
    starPaper,
    unstarPaper,
    getStarCount,
  };
}