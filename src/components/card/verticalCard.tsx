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
  StarResponse,
} from "@/feature/star/StarSlice";
import { toast } from "react-toastify";

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

// interface StarData {
//   paperUuid: string;
//   starred: boolean;
// }

// interface SessionUser {
//   id: string | null;
//   username: string | null;
//   email: string | null;
//   roles: string[];
// }

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
  const [isStarred, setIsStarred] = useState<boolean>(false);

  // Get the user UUID from session
  const userUuid: string = (session?.user?.id as string) || "";

  // Get star count for this paper
  const { data: starCount = 0 } = useGetStarCountQuery(paperId);

  // Get user's starred papers
  const { data: userStars, refetch } = useGetUserStarsQuery(userUuid || "", {
    skip: !userUuid,
  });

  // Star/Unstar mutations
  const [starPaper, { isLoading: isStarring }] = useStarPaperMutation();
  const [unstarPaper, { isLoading: isUnstarring }] = useUnstarPaperMutation();

  const displayAuthors: string[] =
    authors.length > 2 ? [...authors.slice(0, 2), "..."] : authors;

  const displayAbstract: string = abstract
    ? abstract.length > 150
      ? `${abstract.slice(0, 150).trim()}...`
      : abstract
    : "";

  // Check if paper is starred
  useEffect(() => {
    if (userStars && Array.isArray(userStars)) {
      const starred = (userStars as StarResponse[]).some(
        (star: StarResponse) => star.paperUuid === paperId && star.starred
      );
      setIsStarred(starred);
    }
  }, [userStars, paperId]);

  const handleViewPaper = (): void => {
    router.push(`/papers/${paperId}`);
  };

  const handleAuthorClick = (): void => {
    if (authorUuid) {
      router.push(`/users/${authorUuid}`);
    }
  };

  const handleToggleStar = async (): Promise<void> => {
    // Check authentication status
    if (status === "unauthenticated") {
      toast.warning("Please login to star papers");
      router.push("/register");
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

  const isLoading: boolean = isStarring || isUnstarring;

  return (
    <div
      className={`vertical-paper-card w-full max-w-[440px] mx-auto flex flex-col ${className} min-h-[500px]`}
    >
      {/* Accent Bar */}
      <div className="vertical-paper-card-accent"></div>

      {/* Header Image */}
      {image && (
        <div className="relative w-full h-48 flex-shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="vertical-paper-card-image-overlay"></div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="vertical-paper-card-title text-xl mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Authors */}
        <div className="flex items-center mb-3">
          {authorImage && (
            <Image
              src={authorImage}
              alt={authors[0] || "Author"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full mr-3 flex-shrink-0 hover:cursor-pointer ring-2 ring-blue-200"
              priority={false}
              unoptimized
              onClick={handleAuthorClick}
            />
          )}
          <span
            className="text-base text-foreground font-medium truncate cursor-pointer hover:text-blue-600 transition-colors"
            onClick={handleAuthorClick}
          >
            {displayAuthors.join(", ")}
          </span>
        </div>

        {/* Publication Info */}
        <div className="flex items-center flex-wrap gap-3 mb-3 text-sm text-muted-foreground">
          {journal && (
            <div className="vertical-paper-card-journal">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="vertical-paper-card-journal-text truncate">
                {journal}
              </span>
            </div>
          )}
          {year && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{year}</span>
            </div>
          )}
          {citations && (
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{citations}</span>
            </div>
          )}

          {/* Star Button with Count */}
          <button
            onClick={handleToggleStar}
            disabled={isLoading || status === "loading"}
            className="flex items-center gap-1.5 hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isStarred ? "Remove star" : "Add star"}
            title={
              status === "unauthenticated" ? "Login to star papers" : undefined
            }
          >
            <Star
              className={`w-4 h-4 transition-colors hover:cursor-pointer ${
                isStarred
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-muted-foreground"
              }`}
            />
            {starCount > 0 && (
              <span
                className={`text-sm font-semibold ${
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
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-1 leading-relaxed">
            {displayAbstract}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag: string, idx: number) => (
              <span key={idx} className="vertical-paper-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={handleViewPaper}
            className="vertical-paper-card-btn-primary"
            aria-label="View paper"
          >
            <Eye className="w-5 h-5" />
            <span>View</span>
          </button>
          <button
            onClick={onDownloadPDF}
            className="vertical-paper-card-btn-secondary"
            aria-label="Download PDF"
          >
            <Download className="w-5 h-5" />
            <span>PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
