'use client';

import { useGetAllAdviserDetailsQuery } from '@/feature/apiSlice/adviserDetailApiSlice';
import AdviserProfileCard from './AdviserProfileCard';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdviserList() {
  const { data: advisers, isLoading, error } = useGetAllAdviserDetailsQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="w-full">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-10 w-28 ml-auto" />
              </div>
            </div>
          ))}
        </Grid>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-500">Error loading advisers. Please try again later.</p>
      </div>
    );
  }

  if (!advisers || advisers.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-gray-500">No advisers found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advisers.map((adviser) => (
          <AdviserProfileCard key={adviser.uuid} adviser={adviser} />
        ))}
      </Grid>
    </div>
  );
}