"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  Star,
  Download,
  Eye,
  DownloadIcon,
} from "lucide-react";

export interface HorizontalCardProps {
  id: string | number;
  title: string;
  journal: string;
  year: string;
  downloads: string;
  abstract: string;
  tags: string[];
  image: string;
  star: string;
  onViewPaper?: () => void;
  onDownloadPDF?: () => void;
}

export default function HorizontalCard({
  id,
  title,
  journal,
  year,
  downloads,
  abstract,
  tags,
  image,
  star,
  onViewPaper,
  onDownloadPDF,
}: HorizontalCardProps) {
  const router = useRouter();

  return (
    <div className="horizontal-paper-card flex-col md:flex-row">
      {/* Gradient overlay on hover */}
      <div className="horizontal-paper-card-overlay"></div>

      {/* Left Section - Image */}
      <div className="relative w-full md:w-1/3 h-64 md:h-auto flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-[1]"></div>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover horizontal-paper-card-image"
          priority
        />
      </div>

      {/* Right Section */}
      <div className="relative z-20 w-full md:w-2/3 p-6 md:p-7 flex flex-col flex-1">
        {/* Title */}
        <h3 className="horizontal-paper-card-title mb-4 line-clamp-2">
          {title}
        </h3>

        {/* Metadata */}
        <div className="flex flex-wrap gap-5 mb-4 text-sm text-muted-foreground font-medium">
          <div className="horizontal-paper-card-metadata">
            <BookOpen className="horizontal-paper-card-metadata-icon" />
            <span className="text-foreground">{journal}</span>
          </div>
          <div className="horizontal-paper-card-metadata">
            <Calendar className="horizontal-paper-card-metadata-icon" />
            <span className="text-foreground">{year}</span>
          </div>
          <div className="horizontal-paper-card-metadata horizontal-paper-card-metadata-orange">
            <DownloadIcon className="horizontal-paper-card-metadata-icon horizontal-paper-card-metadata-icon-orange" />
            <span className="text-foreground font-semibold">{downloads}</span>
          </div>
          <div className="horizontal-paper-card-metadata horizontal-paper-card-metadata-orange">
            <Star className="horizontal-paper-card-metadata-icon horizontal-paper-card-metadata-icon-orange fill-orange-500" />
            <span className="text-foreground font-semibold">{star}</span>
          </div>
        </div>

        {/* Abstract */}
        <p className="text-sm md:text-base text-muted-foreground mb-5 line-clamp-3 flex-1 leading-relaxed">
          {abstract}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {tags.map((tag, index) => (
            <span key={index} className="horizontal-paper-card-tag">
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-auto">
          <button
            onClick={
              onViewPaper || (() => router.push(`/student/submissions/${id}`))
            }
            className="horizontal-paper-card-button horizontal-paper-card-button-primary"
            aria-label="View paper"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>
          <button
            onClick={onDownloadPDF}
            className="horizontal-paper-card-button horizontal-paper-card-button-secondary"
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
