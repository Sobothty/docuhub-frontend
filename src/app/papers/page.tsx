'use client';

import React, { useState } from 'react';
import { useGetPapersWithPaginationQuery } from '@/feature/apiSlice/paperApi';
import { Paper } from '@/types/paperType';
import PaperCard from '@/components/card/PaperCard';
import Loading from '@/app/Loading';
import { Button } from '@/components/ui/button';

export default function PapersListPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  const { data, isLoading, error, refetch, isSuccess, isError } = useGetPapersWithPaginationQuery({ 
    page: currentPage.toString(), 
    size: pageSize.toString() 
  });

  // Enhanced debugging
  console.log('📜 Papers Page Debug:', {
    data,
    isLoading,
    error,
    isSuccess,
    isError,
    papersCount: data?.papers?.content?.length || 0
  });

  if (isLoading) {
    return (
      <div className="w-[90%] mx-auto my-10">
        <h1 className="font-bold text-3xl text-blue-600 uppercase mb-8">Research Papers</h1>
        <Loading />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-[90%] mx-auto my-10">
        <h1 className="font-bold text-3xl text-blue-600 uppercase mb-8">Research Papers</h1>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-2xl">
            <p className="text-lg mb-2">Failed to load papers from API</p>
            <details className="mb-4">
              <summary className="cursor-pointer text-sm">Error details</summary>
              <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
            <Button onClick={() => refetch()} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const papers: Paper[] = data?.papers?.content || [];
  const totalPages = data?.papers?.totalPages || 0;
  const hasNextPage = !data?.papers?.last;
  const hasPrevPage = !data?.papers?.first;

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <section className="w-[90%] mx-auto my-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-3xl text-blue-600 uppercase mb-2">
            Research Papers
          </h1>
          <p className="text-gray-600">
            Discover published research papers and academic publications
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {data?.papers?.totalElements || 0} papers found
        </div>
      </div>

      {/* Debug Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <p><strong>API Status:</strong> {isSuccess ? '✅ Success' : isError ? '❌ Error' : '🔄 Loading'}</p>
        <p><strong>Papers loaded:</strong> {papers.length}</p>
        <p><strong>Total in API:</strong> {data?.papers?.totalElements || 'Unknown'}</p>
        <p><strong>API Message:</strong> {data?.message || 'None'}</p>
      </div>

      {papers.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg inline-block">
            <p className="text-lg">No papers found in the API response</p>
            <p className="text-sm mt-2">The API returned successfully but with 0 papers.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Papers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {papers.map((paper) => (
              <PaperCard
                key={paper.uuid}
                paper={paper}
                onDownloadPDF={() => window.open(paper.fileUrl, '_blank')}
                onToggleBookmark={() => console.log(`Toggle bookmark for paper ${paper.uuid}`)}
                isBookmarked={false}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <Button
                onClick={handlePrevPage}
                disabled={!hasPrevPage}
                variant="outline"
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <Button
                onClick={handleNextPage}
                disabled={!hasNextPage}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
