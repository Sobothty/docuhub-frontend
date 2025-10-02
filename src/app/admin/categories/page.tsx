'use client';

import { useDispatch } from 'react-redux';
import { openModal } from '@/feature/categorySlice';
import CategoryList from '@/components/categories/CategoryList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CategoriesPage() {
  const dispatch = useDispatch();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => dispatch(openModal())}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>
      
      <CategoryList />
    </div>
  );
}