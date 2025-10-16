// Backend API types for Adviser functionality

export interface Specialize {
  uuid: string;
  name: string;
  slug: string;
}

export interface AdviserDetailRequest {
  experienceYears: number;
  linkedinUrl: string;
  office: string;
  socialLinks: string;
  status: "ACTIVE" | "PENDING" | "REJECTED";
  userUuid: string;
  specializeUuids: string[];
}

export interface UpdateAdviserDetailRequest {
  experienceYears?: number;
  linkedinUrl?: string;
  office?: string;
  socialLinks?: string;
  status?: "ACTIVE" | "PENDING" | "REJECTED";
}

export interface AdviserDetailResponse {
  uuid: string;
  experienceYears: number;
  linkedinUrl: string;
  office: string; // ✅ must exist
  socialLinks: string;
  status: string;
  userUuid: string;
  specialize: Specialize[];
}

export interface AdviserAssignmentRequest {
  paperUuid: string;
  adviserUuid: string;
  deadline: string; // ISO date format
}

export interface ReassignAdviserRequest {
  paperUuid: string;
  newAdviserUuid: string;
  adminUuid: string;
  deadline: string;
  reason?: string;
}

export interface AdviserReviewRequest {
  assignmentUuid: string;
  status: "APPROVED" | "REJECTED";
  comment?: string;
}

export interface RejectPaperRequest {
  paperUuid: string;
  reason: string;
}

export interface AdviserAssignmentResponse {
  uuid: string;
  paperUuid: string;
  adviserUuid: string;
  adminUuid: string;
  deadline: string;
  status: string;
  assignedDate: string;
  updateDate?: string;
}

export interface PaginatedAssignmentsResponse {
  content: AdviserAssignmentResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Specialize endpoints
export interface SpecializeRequest {
  name: string;
  slug: string;
}

export interface SpecializeResponse {
  uuid: string;
  name: string;
  slug: string;
}
