'use client';

import { useGetPapersWithPaginationQuery } from '@/feature/apiSlice/paperApi';
import PaperCard from '@/components/card/PaperCard';

export default function TestPapersPage() {
  const { data, isLoading, error } = useGetPapersWithPaginationQuery({ page: '0', size: '10' });

  console.log('🧪 Test Papers Page:', { data, isLoading, error });

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Test Papers Page</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading papers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Test Papers Page</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error loading papers:</strong>
          <pre className="mt-2 text-sm">{JSON.stringify(error, null, 2)}</pre>
        </div>
      </div>
    );
  }

  const papers = data?.papers?.content || [];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Papers Page</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Debug Info:</h2>
        <p><strong>Papers found:</strong> {papers.length}</p>
        <p><strong>API Response:</strong> {data ? 'Success' : 'No data'}</p>
        <p><strong>Message:</strong> {data?.message}</p>
      </div>

      {papers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No papers found in the API response</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <PaperCard
              key={paper.uuid}
              paper={paper}
              onDownloadPDF={() => window.open(paper.fileUrl, '_blank')}
              onToggleBookmark={() => console.log('Bookmark:', paper.uuid)}
              isBookmarked={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}