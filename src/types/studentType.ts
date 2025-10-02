// Student Detail Request Types
export interface StudentRequest {
  studentCardUrl: string;
  university: string;
  major: string;
  yearsOfStudy: string;
  userUuid: string;
}

export interface UpdateStudentRequest {
  studentCardUrl: string;
  university: string;
  major: string;
  yearsOfStudy: string;
}

export interface RejectStudentRequest {
  userUuid: string;
  reason: string;
}

export interface StudentApproveRequest {
  userUuid: string;
}

// Student Detail Response Types
export interface StudentResponse {
  uuid: string;
  studentCardUrl: string;
  university: string;
  major: string;
  yearsOfStudy: number;
  isStudent: boolean;
  userUuid: string;
}

// API Response wrappers
export interface StudentDetailApiResponse {
  message: string;
  studentDetail?: StudentResponse;
}

export interface PaginatedStudentResponse {
  content: StudentResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  first: boolean;
  empty: boolean;
}

export interface GetPendingStudentsResponse {
  message: string;
  students: PaginatedStudentResponse;
}

// Form validation types
export interface StudentFormData {
  studentCardUrl: string;
  university: string;
  major: string;
  yearsOfStudy: string;
}

export interface StudentFormErrors {
  studentCardUrl?: string;
  university?: string;
  major?: string;
  yearsOfStudy?: string;
}

// Common types
export interface PaginationParams {
  page?: number;
  size?: number;
}