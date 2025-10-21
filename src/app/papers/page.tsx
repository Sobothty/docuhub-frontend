"use client";

import React, { useState } from "react";
import { useGetAllPublishedPapersQuery } from "@/feature/paperSlice/papers";
import { Paper } from "@/types/paperType";
import PaperCard from "@/components/card/PaperCard";
import Loading from "@/app/Loading";
import { Button } from "@/components/ui/button";
import DocuhubLoader from "@/components/loader/docuhub-loading";

export default function PapersListPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  const { data, isLoading, error, refetch } =
    useGetAllPublishedPapersQuery({
      page: currentPage,
      size: pageSize,
      sortBy: "publishedAt",
      direction: "desc",
    });

  if (isLoading) {
    return (
      <div className="w-[90%] mx-auto my-10">
        <h1 className="text-section-headings text-accent uppercase mb-8">
          Research Papers
        </h1>
        <DocuhubLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[90%] mx-auto my-10">
        <h1 className="text-section-headings text-accent uppercase mb-8">
          Research Papers
        </h1>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-2xl">
            <p className="text-lg mb-2">Failed to load papers from API</p>
            <details className="mb-4">
              <summary className="cursor-pointer text-sm">
                Error details
              </summary>
              <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="w-full"
            >
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
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDownloadPaper = async (paper: Paper) => {
    if (!paper.fileUrl) {
      console.error("No file URL available for this paper");
      return;
    }

    try {
      // Create filename from paper title or use default
      const filename = paper.title
        ? `${paper.title.replace(/[^a-z0-9]/gi, "_")}.pdf`
        : `paper_${paper.uuid}.pdf`;

      // Fetch the file as blob to force download
      const response = await fetch(paper.fileUrl);
      const blob = await response.blob();

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;

      // Append to body, trigger click, then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto mt-36">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-section-headings text-accent uppercase mb-2">
            Research Papers
          </h1>
          <p className="text-gray-600">
            Discover published research papers and academic publications
          </p>
        </div>
      </div>

      {papers.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg inline-block">
            <p className="text-lg">No papers found</p>
          </div>
        </div>
      ) : (
        <>
          {/* Papers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {papers.map((paper) => (
              <PaperCard
                key={paper.uuid}
                paper={paper}
                onDownloadPDF={() => handleDownloadPaper(paper)}
                onToggleBookmark={() =>
                  console.log(`Toggle bookmark for paper ${paper.uuid}`)
                }
                isBookmarked={false}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages && (
            <div className="flex justify-center items-center space-x-4 mb-4">
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
}
