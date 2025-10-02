export interface Category {
  uuid: string;
  name: string;
  slug: string;
}

export interface CategoryRequest {
  name: string;
}

export interface CategoryResponse {
  uuid: string;
  name: string;
  slug: string;
}

export interface CategoryPaginationResponse {
  content: CategoryResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}