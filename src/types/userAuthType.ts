// Authentication Types based on Backend DTOs

// Login & Registration
export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmedPassword: string;
}

export interface UpdateUserRequest {
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

export interface UpdateUserImageRequest {
  imageUrl: string;
}

// Response Types
export interface UserResponse {
  slug: string;
  uuid: string;
  userName: string;
  gender?: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  status?: boolean;
  createDate: string;
  updateDate: string;
  bio?: string;
  address?: string;
  contactNumber?: string;
  telegramId?: string;
  isUser: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isAdvisor: boolean;
}

// Authentication Response
export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  id_token?: string;
}

// Token Response
export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  claims: Record<string, any>;
}

// Current User
export interface CurrentUser {
  id: string;
}

// Profile Response (includes student and advisor details if applicable)
export interface UserProfileResponse {
  user: UserResponse;
  student?: {
    uuid: string;
    studentCardUrl: string;
    university: string;
    major: string;
    yearsOfStudy: number;
    isStudent: boolean;
    userUuid: string;
  };
  adviser?: {
    uuid?: string;
    experienceYears: number;
    linkedinUrl?: string;
    publication?: string;
    socialLinks?: string;
    status?: string;
    userUuid: string;
    specialize?: string;
  };
}

// User Role Detection Helper
export interface UserRoles {
  isUser: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isAdvisor: boolean;
}

// Authentication Status
export interface AuthStatus {
  isAuthenticated: boolean;
  user: UserResponse | null;
  loading: boolean;
  error?: string;
}

// Session Data (for NextAuth integration)
export interface SessionUser extends UserResponse {
  accessToken?: string;
  refreshToken?: string;
}

// API Response Wrapper
export interface ApiResponse<T> {
  message: string;
  data?: T;
  status?: number;
  error?: string;
}