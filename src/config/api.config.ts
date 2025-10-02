// API Configuration for different environments

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableCaching: boolean;
  enableLogging: boolean;
}

const developmentConfig: ApiConfig = {
  baseUrl: 'http://localhost:8080/api/v1',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  enableCaching: true,
  enableLogging: true,
};

const productionConfig: ApiConfig = {
  baseUrl: 'https://api.docuhub.me/api/v1',
  timeout: 15000,
  retryAttempts: 2,
  retryDelay: 2000,
  enableCaching: true,
  enableLogging: false,
};

const stagingConfig: ApiConfig = {
  baseUrl: 'https://staging-api.docuhub.me/api/v1',
  timeout: 12000,
  retryAttempts: 3,
  retryDelay: 1500,
  enableCaching: true,
  enableLogging: true,
};

export const getApiConfig = (): ApiConfig => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return productionConfig;
    case 'staging':
      return stagingConfig;
    default:
      return developmentConfig;
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    CURRENT_USER: '/auth/user/currentId',
    USER_PROFILE: '/auth/user/profile',
  },
  
  // Users
  USERS: {
    BASE: '/auth/users',
    BY_ID: (uuid: string) => `/auth/user/${uuid}`,
    SEARCH: '/auth/slug',
    PROMOTE_STUDENT: (uuid: string) => `/auth/user/student/${uuid}`,
    PROMOTE_ADVISER: (uuid: string) => `/auth/user/mentor/${uuid}`,
  },
  
  // Papers
  PAPERS: {
    BASE: '/papers',
    PUBLISHED: '/papers/published',
    BY_ID: (uuid: string) => `/papers/${uuid}`,
    BY_AUTHOR: '/papers/author',
    AUTHOR_APPROVED: '/papers/author/approved',
    UPDATE_BY_AUTHOR: (uuid: string) => `/papers/author/${uuid}`,
  },
  
  // Advisers
  ADVISERS: {
    BASE: '/adviser_details',
    BY_ID: (uuid: string) => `/adviser_details/${uuid}`,
    ASSIGNMENTS: '/adviser_details/assignments',
  },
  
  // Assignments
  ASSIGNMENTS: {
    ASSIGN: '/paper/assign-adviser',
    REASSIGN: '/paper/reassign-adviser',
    REJECT: '/paper/reject',
    REVIEW: '/paper/adviser-review',
    BY_ADVISER: (uuid: string) => `/paper/adviser/${uuid}`,
  },
  
  // Media
  MEDIA: {
    BASE: '/media',
    BY_FILENAME: (filename: string) => `/media/${filename}`,
  },
  
  // Categories
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (uuid: string) => `/categories/${uuid}`,
    SEARCH: '/categories/slug',
  },
  
  // Comments
  COMMENTS: {
    BASE: '/comments',
    BY_ID: (uuid: string) => `/comments/${uuid}`,
    BY_PAPER: (paperUuid: string) => `/comments/paper/${paperUuid}`,
    REPLIES: (uuid: string) => `/comments/${uuid}/replies`,
  },
  
  // Feedback
  FEEDBACK: {
    BASE: '/feedback',
    BY_PAPER: (paperUuid: string) => `/feedback/${paperUuid}`,
  },
  
  // Stars
  STARS: {
    BASE: '/stars',
    BY_PAPER: (paperUuid: string) => `/stars/${paperUuid}`,
    COUNT: (paperUuid: string) => `/stars/${paperUuid}/count`,
    USERS: (paperUuid: string) => `/stars/${paperUuid}/users`,
  },
  
  // Specializations
  SPECIALIZATIONS: {
    BASE: '/admin/specializes',
    BY_ID: (uuid: string) => `/admin/specializes/${uuid}`,
  },
  
  // Admin
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard/stats',
    USER_PROMOTIONS: '/admin/user-promotions',
    SYSTEM_LOGS: '/admin/logs',
    SEND_MAIL: '/admin/send-mail',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Request Headers
export const REQUEST_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const;
