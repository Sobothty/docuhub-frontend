// User interface based on the auth API response
export interface User {
  slug: string;
  uuid: string;
  userName: string;
  gender: string | null;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  status: string | null;
  createDate: string;
  updateDate: string;
  bio: string | null;
  address: string | null;
  contactNumber: string | null;
  telegramId: string | null;
  isUser: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isAdvisor: boolean;
}

// Student profile interface
export interface Student {
  uuid: string;
  studentCardUrl: string;
  university: string;
  major: string;
  yearsOfStudy: number | null;
  isStudent: boolean;
  userUuid: string;
}

// Adviser profile interface
export interface Adviser {
  uuid: string;
  advisorCardUrl: string;
  university: string;
  department: string;
  position: string;
  isAdvisor: boolean;
  userUuid: string;
}

// User profile response from /auth/user/profile
export interface UserProfileResponse {
  user: User;
  student: Student | null;
  adviser: Adviser | null;
}

// Type for Student User (same as User but with isStudent: true)
export type StudentUser = User & {
  isStudent: true;
};

// Type for Mentor/Advisor User (same as User but with isAdvisor: true)
export type MentorUser = User & {
  isAdvisor: true;
};

// Type for Admin (same as User but with isAdmin: true)
export type Admin = User & {
  isAdmin: true;
};

// Response types for paginated endpoints (if needed in future)
export interface UsersResponse {
  users: User[];
  totalUsers?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface StudentsResponse {
  students: StudentUser[];
  totalStudents?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface MentorsResponse {
  mentors: MentorUser[];
  totalMentors?: number;
  currentPage?: number;
  totalPages?: number;
}

// API query parameters
export interface UserQueryParams {
  page?: number;
  size?: number;
  search?: string;
}

// Auth context types (for future authentication state management)
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmedPassword: string;
}

// Token response from Keycloak
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// Current user response from backend
export interface CurrentUser {
  slug: string;
  uuid: string;
  userName: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  isUser: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isAdvisor: boolean;
}