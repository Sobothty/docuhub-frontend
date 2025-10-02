// Additional API services to complement the existing api.ts
// These services cover backend endpoints that were missing from the main API service

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

// Share Service (based on your Share domain)
export const shareService = {
  // Share a paper on a platform
  sharePaper: (shareData: {
    paperUuid: string;
    platform: string;
  }): Promise<any> =>
    apiRequest('/shares', {
      method: 'POST',
      body: JSON.stringify(shareData),
    }),

  // Get share count for a paper
  getShareCount: (paperUuid: string): Promise<{ shareCount: number }> =>
    apiRequest(`/shares/${paperUuid}/count`),

  // Get shares by platform
  getSharesByPlatform: (platform: string): Promise<any[]> =>
    apiRequest(`/shares/platform/${platform}`),

  // Get user's shares
  getUserShares: (userUuid: string): Promise<any[]> =>
    apiRequest(`/shares/user/${userUuid}`),
};

// Student Detail Service (enhanced)
export const studentDetailService = {
  // Create student detail
  createStudentDetail: (studentData: {
    studentCardUrl: string;
    university: string;
    major: string;
    yearsOfStudy: number;
    userUuid: string;
  }): Promise<any> =>
    apiRequest('/student_detail', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),

  // Get student detail by UUID
  getStudentDetailByUuid: (uuid: string): Promise<any> =>
    apiRequest(`/student_detail/${uuid}`),

  // Update student detail
  updateStudentDetail: (uuid: string, studentData: {
    studentCardUrl?: string;
    university?: string;
    major?: string;
    yearsOfStudy?: number;
  }): Promise<any> =>
    apiRequest(`/student_detail/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    }),

  // Get all student details
  getAllStudentDetails: (page = 0, size = 10): Promise<any> =>
    apiRequest(`/student_detail?page=${page}&size=${size}`),

  // Update student status
  updateStudentStatus: (uuid: string, status: 'PENDING' | 'APPROVED' | 'ADMIN_REJECTED'): Promise<any> =>
    apiRequest(`/student_detail/${uuid}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Admin Panel Service
export const adminService = {
  // Get all papers for admin review
  getAllPapersForReview: (params: {
    page?: number;
    size?: number;
    status?: string;
  } = {}): Promise<any> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.status) queryParams.append('status', params.status);
    
    return apiRequest(`/admin/papers?${queryParams.toString()}`);
  },

  // Get admin dashboard statistics
  getDashboardStats: (): Promise<{
    totalPapers: number;
    pendingPapers: number;
    approvedPapers: number;
    totalUsers: number;
    totalAdvisers: number;
    totalStudents: number;
  }> =>
    apiRequest('/admin/dashboard/stats'),

  // Get all user promotion requests
  getUserPromotionRequests: (page = 0, size = 10): Promise<any> =>
    apiRequest(`/admin/user-promotions?page=${page}&size=${size}`),

  // Approve/Reject user promotion
  handleUserPromotion: (uuid: string, action: 'approve' | 'reject', reason?: string): Promise<any> =>
    apiRequest(`/admin/user-promotions/${uuid}/${action}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Get system logs
  getSystemLogs: (page = 0, size = 20): Promise<any> =>
    apiRequest(`/admin/logs?page=${page}&size=${size}`),
};

// Email/SendMail Service (based on your SendMail domain)
export const emailService = {
  // Send custom email
  sendEmail: (emailData: {
    receiverEmail: string;
    subject: string;
    body: string;
  }): Promise<{ message: string }> =>
    apiRequest('/admin/send-mail', {
      method: 'POST',
      body: JSON.stringify(emailData),
    }),

  // Send bulk email
  sendBulkEmail: (emailData: {
    receiverEmails: string[];
    subject: string;
    body: string;
  }): Promise<{ message: string }> =>
    apiRequest('/admin/send-mail/bulk', {
      method: 'POST',
      body: JSON.stringify(emailData),
    }),

  // Get email history
  getEmailHistory: (page = 0, size = 10): Promise<any> =>
    apiRequest(`/admin/send-mail/history?page=${page}&size=${size}`),

  // Send notification email
  sendNotificationEmail: (notificationData: {
    type: 'PAPER_APPROVED' | 'PAPER_REJECTED' | 'ADVISER_ASSIGNED' | 'FEEDBACK_RECEIVED';
    recipientUuid: string;
    data: Record<string, any>;
  }): Promise<{ message: string }> =>
    apiRequest('/notifications/email', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    }),
};

// Analytics Service
export const analyticsService = {
  // Get paper analytics
  getPaperAnalytics: (paperUuid: string): Promise<{
    views: number;
    downloads: number;
    shares: number;
    stars: number;
    comments: number;
  }> =>
    apiRequest(`/analytics/paper/${paperUuid}`),

  // Get user analytics
  getUserAnalytics: (userUuid: string): Promise<{
    papersSubmitted: number;
    papersApproved: number;
    totalViews: number;
    totalDownloads: number;
  }> =>
    apiRequest(`/analytics/user/${userUuid}`),

  // Get platform analytics (Admin only)
  getPlatformAnalytics: (): Promise<{
    totalUsers: number;
    totalPapers: number;
    totalDownloads: number;
    monthlyGrowth: number;
    topCategories: Array<{ name: string; count: number }>;
  }> =>
    apiRequest('/analytics/platform'),
};

// Notification Service
export const notificationService = {
  // Get user notifications
  getUserNotifications: (page = 0, size = 10): Promise<any> =>
    apiRequest(`/notifications?page=${page}&size=${size}`),

  // Mark notification as read
  markAsRead: (notificationUuid: string): Promise<void> =>
    apiRequest(`/notifications/${notificationUuid}/read`, {
      method: 'PATCH',
    }),

  // Mark all notifications as read
  markAllAsRead: (): Promise<void> =>
    apiRequest('/notifications/read-all', {
      method: 'PATCH',
    }),

  // Get unread notification count
  getUnreadCount: (): Promise<{ count: number }> =>
    apiRequest('/notifications/unread-count'),

  // Delete notification
  deleteNotification: (notificationUuid: string): Promise<void> =>
    apiRequest(`/notifications/${notificationUuid}`, {
      method: 'DELETE',
    }),
};

// Export all services
export default {
  share: shareService,
  studentDetail: studentDetailService,
  admin: adminService,
  email: emailService,
  analytics: analyticsService,
  notifications: notificationService,
};
