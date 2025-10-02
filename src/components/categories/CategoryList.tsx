'use client';

import { useState } from 'react';
import { useGetAllCategoriesQuery, useDeleteCategoryMutation } from '@/feature/apiSlice/categoryApiSlice';
import { useDispatch } from 'react-redux';
import { openModal, openDeleteModal } from '@/feature/categorySlice';
import { CategoryResponse } from '@/types/categoryType';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import CategoryModal from './CategoryModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function CategoryList() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { data, isLoading, isError, refetch } = useGetAllCategoriesQuery({ page, size });
  const [deleteCategory] = useDeleteCategoryMutation();
  const dispatch = useDispatch();

  const handleEdit = (category: CategoryResponse) => {
    dispatch(openModal());
    // Pass the selected category to the modal
  };

  const handleDelete = (category: CategoryResponse) => {
    dispatch(openDeleteModal(category));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-4">Error loading categories</div>;
  }

  if (!data || data.content.length === 0) {
    return <div className="text-center py-4">No categories found</div>;
  }

  return (
    <div className="space-y-4">
      <CategoryModal />
      <DeleteConfirmModal onDelete={deleteCategory} />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.content.map((category) => (
              <TableRow key={category.uuid}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDelete(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={data.number}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}