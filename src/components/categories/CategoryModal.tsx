'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { closeModal } from '@/feature/categorySlice';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/feature/apiSlice/categoryApiSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CategoryModal() {
  const { isModalOpen, selectedCategory } = useSelector((state: RootState) => state.category);
  const dispatch = useDispatch();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (selectedCategory) {
      form.reset({
        name: selectedCategory.name,
      });
    } else {
      form.reset({
        name: '',
      });
    }
  }, [selectedCategory, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (selectedCategory) {
        await updateCategory({
          uuid: selectedCategory.uuid,
          request: values,
        }).unwrap();
        toast.success('Category updated successfully');
      } else {
        await createCategory(values).unwrap();
        toast.success('Category created successfully');
      }
      dispatch(closeModal());
    } catch (error) {
      toast.error('Failed to save category');
      console.error(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => dispatch(closeModal())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => dispatch(closeModal())}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}