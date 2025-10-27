"use client";

import { useState, useEffect } from "react";
import { useGetAllPublishedPapersQuery } from "@/feature/paperSlice/papers";
import { getSession } from "next-auth/react";
import {
  useGetStarCountQuery,
  useStarPaperMutation,
  useUnstarPaperMutation,
} from "@/feature/star/StarSlice";
import type { Paper } from "@/types/paperType";

/**
 * User session interface
 */
interface SessionUser {
  id?: string;
  email?: string;
  name?: string;
  image?: string;
}

/**
 * Component props interface
 */
interface PaperCardProps {
  paper: Paper;
  currentUser: SessionUser | null;
  isStarred: boolean;
  updateStarredState: (paperUuid: string, isStarred: boolean) => void;
}

export default function HomeTestPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [starredState, setStarredState] = useState<Record<string, boolean>>({});

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      setCurrentUser(session?.user || null);
    };
    checkAuth();
  }, []);

  // Fetch papers from API
  const { data: papersData, isLoading: papersLoading } =
    useGetAllPublishedPapersQuery({});
  const papers: Paper[] = papersData?.papers?.content || [];

  /**
   * Update the starred state for a paper
   */
  const updateStarredState = (paperUuid: string, isStarred: boolean) => {
    setStarredState((prev) => ({
      ...prev,
      [paperUuid]: isStarred,
    }));
  };

  // Show loading state while fetching papers
  if (papersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ⭐ GitHub-like Star Feature
          </h1>
          <p className="text-gray-600">
            Click stars to toggle - Professional implementation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper: Paper) => (
            <PaperCard
              key={paper.uuid}
              paper={paper}
              currentUser={currentUser}
              isStarred={starredState[paper.uuid] || false}
              updateStarredState={updateStarredState}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * PaperCard component - Displays paper information with star functionality
 */
function PaperCard({
  paper,
  currentUser,
  isStarred,
  updateStarredState,
}: PaperCardProps) {
  // Query for star count
  const { data: starCount, refetch: refetchStarCount } = useGetStarCountQuery(
    paper.uuid
  );

  // Mutations for starring/unstarring
  const [starPaper] = useStarPaperMutation();
  const [unstarPaper] = useUnstarPaperMutation();

  // Local loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Handle star/unstar toggle
   */
  const handleStarClick = async (): Promise<void> => {
    // Check if user is authenticated
    if (!currentUser) {
      alert("Please log in to star papers");
      return;
    }

    setIsLoading(true);
    try {
      if (isStarred) {
        // Unstar the paper
        await unstarPaper(paper.uuid).unwrap();
        updateStarredState(paper.uuid, false);
      } else {
        // Star the paper
        await starPaper(paper.uuid).unwrap();
        updateStarredState(paper.uuid, true);
      }
      // Refetch star count to get updated number
      refetchStarCount();
    } catch (error: any) {
      console.error("Error toggling star:", error);

      // Handle specific error cases
      if (error.status === 409) {
        // Conflict - paper is already starred
        updateStarredState(paper.uuid, true);
        alert("This paper is already starred by you");
      } else {
        // Generic error handling
        alert(`Error: ${error?.data?.message || "Failed to toggle star"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Paper Title */}
      <h3 className="font-bold text-lg mb-3 line-clamp-2">{paper.title}</h3>

      {/* Paper Abstract */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {paper.abstractText}
      </p>

      {/* Categories */}
      {paper.categoryNames && paper.categoryNames.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {paper.categoryNames
            .slice(0, 2)
            .map((category: string, index: number) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200"
              >
                {category}
              </span>
            ))}
        </div>
      )}

      {/* Star Button */}
      <button
        onClick={handleStarClick}
        disabled={isLoading}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
          ${
            isStarred
              ? "bg-yellow-500 text-white border-yellow-600 hover:bg-yellow-600"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }
        `}
      >
        {isLoading ? (
          // Loading spinner
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ) : (
          // Star icon and count
          <>
            <span className="text-xl">{isStarred ? "★" : "☆"}</span>
            <span className="font-semibold">{starCount || 0}</span>
            <span>{isStarred ? "Unstar" : "Star"}</span>
          </>
        )}
      </button>

      {/* Action Hint */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          {isStarred ? "Click to unstar" : "Click to star"}
        </p>
      </div>

      {/* Paper Metadata */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 truncate" title={paper.uuid}>
          ID: {paper.uuid.substring(0, 10)}...
        </p>
        {paper.publishedAt && (
          <p className="text-xs text-gray-500">
            Published: {new Date(paper.publishedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
