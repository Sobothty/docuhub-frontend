export interface UserProfile {
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
  createDate: string; // ISO date string (e.g. "2025-09-12")
  updateDate: string; // ISO date string
  bio: string | null;
  address: string | null;
  contactNumber: string | null;
  telegramId: string | null;
  isUser: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isAdvisor: boolean;
}

// Alias for consistency with API endpoints
export type User = UserProfile;

// Backend DTO types to match Java backend
export interface UserCreateDto {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmedPassword: string;
}

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

export interface UpdateUserImageDto {
  imageUrl: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  username: string;
  password: string;
}


export interface CurrentUser {
  id: string;
}

export interface StudentResponse {
  uuid: string;
  studentCardUrl?: string;
  university?: string;
  major?: string;
  yearsOfStudy?: number;
  isStudent: boolean;
  userUuid: string;
}

export interface AdviserDetailResponse {
  experienceYears?: number;
  linkedinUrl?: string;
  office?: string;
  status?: string;
  socialLinks?: string;
  userUuid: string;
}

export interface UserProfileResponse {
  user: UserResponse;
  student?: StudentResponse;
  adviser?: AdviserDetailResponse;
}

// Response type wrappers
export interface GetUsersResponse {
  users: User[];
  total?: number;
}

export interface GetUserByIdResponse {
  user: User;
}

export interface GetUsersByRoleResponse {
  users: User[];
  total?: number;
}

export interface GetUserBySlugResponse {
  users: User[];
}

// User role types
export type UserRole = 'student' | 'mentor' | 'admin' | 'user';

// User filter types
export interface UserFilters {
  role?: UserRole;
  search?: string;
  isActive?: boolean;
}
