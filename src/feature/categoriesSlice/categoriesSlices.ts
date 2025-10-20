import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types
export type Category = {
  uuid: string;
  name: string;
  slug: string;
};

export type CategoriesResponse = {
  content: Category[];
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
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  empty: boolean;
};

// API Slice
export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getAllCategories: builder.query<CategoriesResponse, void>({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    // Add a new endpoint that returns just the category names
    getCategoryNames: builder.query<string[], void>({
      query: () => "/categories",
      transformResponse: (response: CategoriesResponse) => {
        // Extract just the names from the content array and add "all" at the beginning
        const categoryNames = response.content.map((category) => category.name);
        return ["all", ...categoryNames];
      },
      providesTags: ["Categories"],
    }),
  }),
});

export const { useGetAllCategoriesQuery, useGetCategoryNamesQuery } =
  categoriesApi;

export default categoriesApi.reducer;
