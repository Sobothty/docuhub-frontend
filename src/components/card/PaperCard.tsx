'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Paper } from '@/types/paperType';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PaperCardProps {
  paper: Paper;
  authorName?: string;
  onDownloadPDF?: () => void;
  onToggleBookmark?: () => void;
  isBookmarked?: boolean;
}

export default function PaperCard({ 
  paper, 
  authorName, 
  onDownloadPDF, 
  onToggleBookmark, 
  isBookmarked = false 
}: PaperCardProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDownloadPDF) {
      onDownloadPDF();
    } else {
      window.open(paper.fileUrl, '_blank');
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onToggleBookmark) {
      onToggleBookmark();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <Link href={`/papers/${paper.uuid}`} className="no-underline">
        <CardHeader className="space-y-2">
          <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
            {paper.thumbnailUrl ? (
              <Image
                src={paper.thumbnailUrl}
                alt={paper.title}
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                <div className="text-4xl text-gray-400">📄</div>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge variant={paper.isApproved ? 'default' : 'secondary'}>
                {paper.status}
              </Badge>
            </div>
          </div>
          
          <CardTitle className="line-clamp-2 text-lg leading-tight">
            {paper.title}
          </CardTitle>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p>By: {authorName || 'Unknown Author'}</p>
            <p>Published: {formatDate(paper.publishedAt || paper.createdAt)}</p>
          </div>
        </CardHeader>
      </Link>

      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-3">
          {paper.abstractText}
        </CardDescription>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {paper.categoryNames.map((category, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleDownload} 
            className="flex-1" 
            variant="default"
          >
            Download PDF
          </Button>
          <Button
            onClick={handleBookmark}
            variant="outline"
            size="sm"
            className={isBookmarked ? 'text-yellow-600 border-yellow-600' : ''}
          >
            {isBookmarked ? '★' : '☆'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}