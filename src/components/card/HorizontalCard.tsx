"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BookOpen, Calendar, Award, Star, Download, Eye } from 'lucide-react';

export interface HorizontalCardProps {
  id: string | number;
  title: string;
  authors: string[];
  authorImage?: string;
  journal: string;
  year: string;
  citations: string;
  abstract: string;
  tags: string[];
  image: string;
  isBookmarked?: boolean;
  onViewPaper?: () => void;
  onDownloadPDF?: () => void;
  onToggleBookmark?: () => void;
}

export default function HorizontalCard({
  id,
  title,
  authors,
  authorImage,
  journal,
  year,
  citations,
  abstract,
  tags,
  image,
  isBookmarked = false,
  onViewPaper,
  onDownloadPDF,
  onToggleBookmark,
}: HorizontalCardProps) {
  const router = useRouter();

  return (
    <div className="w-full bg-card overflow-hidden rounded-lg flex flex-col md:flex-row shadow-md h-full">
      {/* Left Section - Image */}
      <div className="relative w-full md:w-1/3 h-56 md:h-auto flex-shrink-0">
        <Image src={image} alt={title} fill className="object-cover" priority />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-2/3 p-4 md:p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Authors */}
        <div className="flex items-center mb-3">
          {authorImage && (
            <Image
              src={authorImage}
              alt={authors[0] || 'Author'}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full mr-2"
            />
          )}
          <span className="text-sm text-foreground">{authors.join(', ')}</span>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 mb-3 text-sm text-foreground">
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>{journal}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{year}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Award className="w-4 h-4" />
            <span>{citations}</span>
          </div>
          <button
            onClick={onToggleBookmark}
            className="flex items-center space-x-1 hover:text-secondary transition-colors"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-accent text-accent' : ''}`} />
          </button>
        </div>

        {/* Abstract */}
        <p className="text-sm text-foreground mb-4 line-clamp-3 flex-1">
          {abstract}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-muted text-foreground text-xs rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-auto">
          <button
            onClick={onViewPaper || (() => router.push(`/papers/${id}`))}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 text-sm"
            aria-label="View paper"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>
          <button
            onClick={onDownloadPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-foreground/90 text-sm"
            aria-label="Download PDF"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
