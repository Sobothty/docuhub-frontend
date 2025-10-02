// Additional TypeScript types for the missing services
// These complement the existing type definitions

// Share Types
export interface ShareRequest {
  paperUuid: string;
  platform: string;
}

export interface ShareResponse {
  uuid: string;
  platform: string;
  shareCount: number;
  startDate: string;
  paperUuid: string;
  userUuid: string;
}

// Student Detail Types
export interface StudentDetailRequest {
  studentCardUrl: string;
  university: string;
  major: string;
  yearsOfStudy: number;
  userUuid: string;
}

export interface StudentDetailResponse {
  uuid: string;
  studentCardUrl: string;
  university: string;
  major: string;
  yearsOfStudy: number;
  isStudent: boolean;
  status: 'PENDING' | 'APPROVED' | 'ADMIN_REJECTED';
  userUuid: string;
}

export interface UpdateStudentDetailRequest {
  studentCardUrl?: string;
  university?: string;
  major?: string;
  yearsOfStudy?: number;
}

// Admin Types
export interface AdminDashboardStats {
  totalPapers: number;
  pendingPapers: number;
  approvedPapers: number;
  rejectedPapers: number;
  totalUsers: number;
  totalAdvisers: number;
  totalStudents: number;
  totalCategories: number;
  monthlyPaperSubmissions: number;
  monthlyUserRegistrations: number;
}

export interface UserPromotionRequest {
  uuid: string;
  userUuid: string;
  requestType: 'STUDENT' | 'ADVISER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: string;
  processedDate?: string;
  reason?: string;
  adminUuid?: string;
}

export interface SystemLog {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  userUuid?: string;
  action?: string;
  resourceType?: string;
  resourceUuid?: string;
}

// Email Types
export interface SendEmailRequest {
  receiverEmail: string;
  subject: string;
  body: string;
}

export interface SendBulkEmailRequest {
  receiverEmails: string[];
  subject: string;
  body: string;
}

export interface EmailHistoryResponse {
  uuid: string;
  senderEmail: string;
  receiverEmail: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
}

export interface NotificationEmailRequest {
  type: 'PAPER_APPROVED' | 'PAPER_REJECTED' | 'ADVISER_ASSIGNED' | 'FEEDBACK_RECEIVED' | 'COMMENT_ADDED';
  recipientUuid: string;
  data: Record<string, any>;
}

// Analytics Types
export interface PaperAnalytics {
  paperUuid: string;
  views: number;
  downloads: number;
  shares: number;
  stars: number;
  comments: number;
  viewsThisMonth: number;
  downloadsThisMonth: number;
  topReferrers: Array<{ source: string; count: number }>;
}

export interface UserAnalytics {
  userUuid: string;
  papersSubmitted: number;
  papersApproved: number;
  papersRejected: number;
  totalViews: number;
  totalDownloads: number;
  totalStars: number;
  profileViews: number;
  joinDate: string;
}

export interface PlatformAnalytics {
  totalUsers: number;
  totalPapers: number;
  totalDownloads: number;
  totalViews: number;
  monthlyGrowthUsers: number;
  monthlyGrowthPapers: number;
  topCategories: Array<{ name: string; count: number; percentage: number }>;
  topUniversities: Array<{ name: string; count: number }>;
  usersByRole: {
    students: number;
    advisers: number;
    admins: number;
    regular: number;
  };
  papersByStatus: {
    published: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

// Notification Types
export interface NotificationResponse {
  uuid: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
  userUuid: string;
  relatedResourceType?: string;
  relatedResourceUuid?: string;
  actionUrl?: string;
}

export interface NotificationRequest {
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  userUuid: string;
  relatedResourceType?: string;
  relatedResourceUuid?: string;
  actionUrl?: string;
}

export interface UnreadNotificationCount {
  count: number;
}

// Enhanced Paper Types (to complement existing ones)
export interface PaperWithAnalytics extends PaperResponse {
  analytics: {
    views: number;
    downloads: number;
    shares: number;
    stars: number;
    comments: number;
  };
}

export interface PaperReviewRequest {
  paperUuid: string;
  action: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES';
  feedback?: string;
  deadline?: string;
}

// Enhanced User Types
export interface UserWithDetails extends UserResponse {
  studentDetail?: StudentDetailResponse;
  adviserDetail?: AdviserDetailResponse;
  analytics?: UserAnalytics;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  author?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'relevance' | 'date' | 'popularity' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  results: T[];
  totalCount: number;
  facets?: {
    categories: Array<{ name: string; count: number }>;
    authors: Array<{ name: string; count: number }>;
    years: Array<{ year: number; count: number }>;
  };
}

// API Response Wrappers
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  status: number;
  timestamp: string;
  path?: string;
}

// File Upload Types
export interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface UploadedFile {
  name: string;
  uri: string;
  size: number;
  type: string;
  created_date: string;
}

// Export all types
export type {
  ShareRequest,
  ShareResponse,
  StudentDetailRequest,
  StudentDetailResponse,
  UpdateStudentDetailRequest,
  AdminDashboardStats,
  UserPromotionRequest,
  SystemLog,
  SendEmailRequest,
  SendBulkEmailRequest,
  EmailHistoryResponse,
  NotificationEmailRequest,
  PaperAnalytics,
  UserAnalytics,
  PlatformAnalytics,
  NotificationResponse,
  NotificationRequest,
  UnreadNotificationCount,
  PaperWithAnalytics,
  PaperReviewRequest,
  UserWithDetails,
  SearchFilters,
  SearchResult,
  PaginatedResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  FileUploadProgress,
  UploadedFile,
};
