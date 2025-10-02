'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { closeDeleteModal } from '@/feature/categorySlice';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface DeleteConfirmModalProps {
  onDelete: (uuid: string) => Promise<any>;
}

export default function DeleteConfirmModal({ onDelete }: DeleteConfirmModalProps) {
  const { isDeleteModalOpen, selectedCategory } = useSelector((state: RootState) => state.category);
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedCategory) return;
    
    setIsDeleting(true);
    try {
      await onDelete(selectedCategory.uuid);
      toast.success('Category deleted successfully');
      dispatch(closeDeleteModal());
    } catch (error) {
      toast.error('Failed to delete category');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isDeleteModalOpen} onOpenChange={() => dispatch(closeDeleteModal())}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the category
            <strong> {selectedCategory?.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}