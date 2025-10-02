import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  CategoryRequest, 
  CategoryPaginationResponse
} from '@/types/categoryType';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ 
    // Route all requests through Next.js API proxy
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Guard localStorage for SSR safety
      if (typeof window !== 'undefined') {
        const token = window.localStorage.getItem('token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getAllCategories: builder.query<CategoryPaginationResponse, { page?: number; size?: number; sortBy?: string; direction?: string }>({
      query: ({ page = 0, size = 10, sortBy = 'createdDate', direction = 'desc' }) => 
        `categories?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
      providesTags: ['Category'],
    }),
    
    searchCategoriesBySlug: builder.query<CategoryPaginationResponse, { slug: string; page?: number; size?: number }>({
      query: ({ slug, page = 0, size = 10 }) => 
        `categories/slug?slug=${slug}&page=${page}&size=${size}`,
      providesTags: ['Category'],
    }),
    
    createCategory: builder.mutation<{ message: string }, CategoryRequest>({
      query: (categoryRequest) => ({
        url: 'categories',
        method: 'POST',
        body: categoryRequest,
      }),
      invalidatesTags: ['Category'],
    }),
    
    updateCategory: builder.mutation<{ message: string }, { uuid: string; request: CategoryRequest }>({
      query: ({ uuid, request }) => ({
        url: `categories/${uuid}`,
        method: 'PUT',
        body: request,
      }),
      invalidatesTags: ['Category'],
    }),
    
    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (uuid) => ({
        url: `categories/${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useSearchCategoriesBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;