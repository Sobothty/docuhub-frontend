"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { BookOpen, Calendar, Award, Star, Download, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  useGetUserStarsQuery,
  useStarPaperMutation,
  useUnstarPaperMutation,
  useGetStarCountQuery,
} from "@/feature/star/StarSlice";

interface VerticalCardProps {
  title: string;
  authors: string[];
  authorImage?: string;
  journal?: string;
  year?: string;
  citations?: string;
  abstract?: string;
  tags?: string[];
  image?: string;
  paperId: string;
  authorUuid?: string;
  onDownloadPDF?: () => void;
  className?: string;
}

export default function VerticalCard({
  title,
  authors,
  authorImage,
  journal,
  year,
  citations,
  abstract,
  tags = [],
  image,
  paperId,
  authorUuid,
  onDownloadPDF,
  className = "",
}: VerticalCardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isStarred, setIsStarred] = useState(false);

  // Get the user UUID from session
  const userUuid =
    session?.user?.id || session?.user?.id || (session?.user as any)?.sub;

  // Get star count for this paper
  const { data: starCount = 0 } = useGetStarCountQuery(paperId);

  // Get user's starred papers
  const { data: userStars, refetch } = useGetUserStarsQuery(userUuid || "", {
    skip: !userUuid,
  });

  // Star/Unstar mutations
  const [starPaper, { isLoading: isStarring }] = useStarPaperMutation();
  const [unstarPaper, { isLoading: isUnstarring }] = useUnstarPaperMutation();

  const displayAuthors =
    authors.length > 2 ? [...authors.slice(0, 2), "..."] : authors;

  const displayAbstract = abstract
    ? abstract.length > 150
      ? `${abstract.slice(0, 150).trim()}...`
      : abstract
    : "";

  // Check if paper is starred
  useEffect(() => {
    if (userStars && Array.isArray(userStars)) {
      const starred = userStars.some(
        (star: { paperUuid: string; starred: boolean }) =>
          star.paperUuid === paperId && star.starred
      );
      setIsStarred(starred);
    }
  }, [userStars, paperId]);

  const handleViewPaper = () => {
    router.push(`/papers/${paperId}`);
  };

  const handleAuthorClick = () => {
    if (authorUuid) {
      router.push(`/users/${authorUuid}`);
    }
  };

  const handleToggleStar = async () => {
    // Check authentication status
    if (status === "unauthenticated") {
      console.log("Please login to star papers");
      // Optional: redirect to login
      // router.push('/login');
      return;
    }

    if (!userUuid) {
      console.log("User UUID not found in session");
      console.log("Session data:", session);
      return;
    }

    try {
      if (isStarred) {
        const response = await unstarPaper(paperId).unwrap();
        console.log("Unstar response:", response);
        setIsStarred(false);
      } else {
        const response = await starPaper(paperId).unwrap();
        console.log("Star response:", response);
        setIsStarred(true);
      }
      // Refetch user stars to update the list
      refetch();
    } catch (error) {
      console.error("Error toggling star:", error);
    }
  };

  const isLoading = isStarring || isUnstarring;

  return (
    <div
      className={`w-full max-w-[440px] mx-auto bg-card rounded-lg overflow-hidden flex flex-col shadow-md ${className} min-h-[450px] sm:min-h-[500px]`}
    >
      {/* Header Image */}
      {image && (
        <div className="relative w-full h-32 sm:h-40 flex-shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Authors */}
        <div className="flex items-center mb-2 sm:mb-3">
          {authorImage && (
            <Image
              src={authorImage}
              alt={authors[0] || "Author"}
              width={24}
              height={24}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2 sm:mr-3 flex-shrink-0 hover:cursor-pointer"
              priority={false}
              unoptimized
              onClick={handleAuthorClick}
            />
          )}
          <span
            className="text-sm sm:text-base text-foreground truncate cursor-pointer hover:text-blue-600 transition-colors"
            onClick={handleAuthorClick}
          >
            {displayAuthors.join(", ")}
          </span>
        </div>

        {/* Publication Info */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-4 mb-2 sm:mb-3 text-xs sm:text-sm text-foreground">
          {journal && (
            <div className="flex items-center space-x-1 truncate">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">{journal}</span>
            </div>
          )}
          {year && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{year}</span>
            </div>
          )}
          {citations && (
            <div className="flex items-center space-x-1">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{citations}</span>
            </div>
          )}

          {/* Star Button with Count */}
          <button
            onClick={handleToggleStar}
            disabled={isLoading || status === "loading"}
            className="flex items-center space-x-1 hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isStarred ? "Remove star" : "Add star"}
            title={
              status === "unauthenticated" ? "Login to star papers" : undefined
            }
          >
            <Star
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${
                isStarred
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-foreground"
              }`}
            />
            {starCount > 0 && (
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isStarred ? "text-yellow-500" : "text-foreground"
                }`}
              >
                {starCount}
              </span>
            )}
          </button>
        </div>

        {/* Abstract */}
        {displayAbstract && (
          <p className="text-sm sm:text-base text-foreground mb-2 sm:mb-3 line-clamp-3 flex-1">
            {displayAbstract}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-foreground text-xs sm:text-sm rounded-full font-medium truncate"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 mt-auto">
          <button
            onClick={handleViewPaper}
            className="flex items-center justify-center gap-1 px-3 py-2 sm:px-4 sm:py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors text-sm sm:text-base flex-1"
            aria-label="View paper"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>View</span>
          </button>
          <button
            onClick={onDownloadPDF}
            className="flex items-center justify-center gap-1 px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base flex-1"
            aria-label="Download PDF"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
