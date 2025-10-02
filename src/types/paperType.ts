export interface Paper {
  uuid: string;
  title: string;
  abstractText: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  authorUuid: string;
  categoryNames: string[];
  status: string;
  isApproved: boolean;
  submittedAt: string;
  createdAt: string;
  isPublished: boolean;
  publishedAt: string | null;
}

// Backend DTO types
export interface PaperRequest {
  title: string;
  abstractText: string;
  fileUrl: string;
  thumbnailUrl: string;
  categoryNames: string[];
}

export interface AdminPaperRequest {
  title: string;
  abstractText: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  category: string[];
}

export interface PaperResponse {
  uuid: string;
  title: string;
  abstractText: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  authorUuid: string;
  categoryNames: string[];
  status: string;
  isApproved: boolean;
  submittedAt: string;
  createdAt: string;
  isPublished: boolean;
  publishedAt: string | null;
}

// API Query Parameters
export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

// API Response wrappers
export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface PaperListResponse {
  papers: PapersData;
  message: string;
}

// Backend DTO types
export interface PaperRequest {
  title: string;
  abstractText: string;
  fileUrl: string;
  thumbnailUrl: string;
  categoryNames: string[];
}

export interface AdminPaperRequest {
  title: string;
  abstractText: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  category: string[];
}

export interface PaperResponse {
  uuid: string;
  title: string;
  abstractText: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  authorUuid: string;
  categoryNames: string[];
  status: string;
  isApproved: boolean;
  submittedAt: string;
  createdAt: string;
  isPublished: boolean;
  publishedAt: string | null;
}

// API Query Parameters
export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

// API Response wrappers
export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface PaperListResponse {
  papers: PapersData;
  message: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  authorImage?: string;
  journal?: string;
  year?: string;
  citations?: string;
  abstract?: string;
  tags?: string[];
  isBookmarked?: boolean;
  image?: string;
  authorUuid?: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  fileUrl?: string;
}

interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

interface PapersData {
  content: Paper[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  empty: boolean;
}

export interface GetPapersResponse {
  message: string;
  papers: PapersData;
}