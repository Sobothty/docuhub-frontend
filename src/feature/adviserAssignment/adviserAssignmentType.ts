// src/types/adviserAssignment.ts
export interface ApiResponse<T> {
  status: string;
  data: T;
}

/* ---- paging / sort ---- */
export interface SortInfo {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

/* ---- domain ---- */
export interface PaperDto {
  uuid: string;
  title: string;
  fileUrl: string;
  // API sends `thumbnailUr` (typo). Keep it as-is below, and we will map to thumbnailUrl in transformResponse if you want.
  thumbnailUr?: string | null;
  // optional normalized field (we may add it in transformResponse)
  thumbnailUrl?: string | null;
}

export interface StudentDto {
  uuid: string;
  fullName: string;
  email?: string | null;
  imageUrl?: string | null;
}

export interface AssignmentItem {
  assignmentUuid: string;
  status: string; // you can turn into enum if desired
  deadline: string; // "YYYY-MM-DD" (string) — parse to Date where needed
  assignedDate: string;
  paper: PaperDto;
  student: StudentDto;
}

export interface AssignmentsData {
  content: AssignmentItem[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: SortInfo;
  empty: boolean;
}

/* full response type */
export type AssignmentsResponse = ApiResponse<AssignmentsData>;
