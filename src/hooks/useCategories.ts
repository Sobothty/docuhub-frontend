// hooks/useCategories.ts

import { useGetAllCategoriesQuery } from "@/feature/apiSlice/categoryApiSlice";


export const useCategories = () => {
  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = useGetAllCategoriesQuery({
    page: 0,
    size: 50,
    sortBy: 'name',
    direction: 'asc'
  });

  console.log('Categories API Response:', { data, error, isLoading });

  return {
    categories: data?.content || [],
    isLoading,
    error,
    refetch
  };
};