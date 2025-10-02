'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Mail,
  Globe,
  ExternalLink,
  BookOpen,
  User,
  GraduationCap,
} from 'lucide-react';
import HorizontalCard from '@/components/card/HorizontalCard';

interface StudentPublicProfileProps {
  student: {
    name: string;
    school: string;
    year: string;
    major: string;
    avatar?: string;
    bio: string;
    researchInterests: string[];
    publishedPapers: Array<{
      title: string;
      year: string;
      status: string;
      link?: string;
    }>;
    mentor?: {
      name: string;
      title: string;
      profileLink?: string;
    };
    stats: {
      papersPublished: number;
      papersInProgress: number;
      academicYear: string;
    };
    contact: {
      email: string;
      portfolio?: string;
    };
    socialLinks: {
      linkedin?: string;
      github?: string;
      orcid?: string;
    };
  };
}

export function StudentPublicProfile({ student }: StudentPublicProfileProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Main Content and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Section (Spans both columns) */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-32 w-32 mx-auto md:mx-0">
                  <AvatarImage
                    src={student.avatar || '/placeholder.svg'}
                    alt={student.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {student.name}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-2">
                    {student.year}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>
                      {student.major}, {student.school}
                    </span>
                  </div>
                  {student.mentor && (
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4">
                      <User className="h-4 w-4" />
                      <span>
                        Mentored by{' '}
                        {student.mentor.profileLink ? (
                          <a
                            href={student.mentor.profileLink}
                            className="text-primary hover:underline"
                          >
                            {student.mentor.name}
                          </a>
                        ) : (
                          student.mentor.name
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-3 gap-5">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  {student.stats.papersPublished}
                </CardTitle>
                <CardDescription>Published Papers</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  {student.stats.papersInProgress}
                </CardTitle>
                <CardDescription>Papers in Progress</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  {student.stats.academicYear}
                </CardTitle>
                <CardDescription>Academic Year</CardDescription>
              </CardHeader>
            </Card>
          </div>
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {student.bio}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (Right Column) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{student.contact.email}</span>
              </div>
              {student.contact.portfolio && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={student.contact.portfolio}
                    className="text-sm text-foreground hover:underline"
                  >
                    Portfolio Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mentor Information */}
          {student.mentor && (
            <Card>
              <CardHeader>
                <CardTitle>Mentor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <h4 className="font-medium">{student.mentor.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {student.mentor.title}
                  </p>
                  {student.mentor.profileLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Links */}
          {(student.socialLinks.linkedin ||
            student.socialLinks.github ||
            student.socialLinks.orcid) && (
            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {student.socialLinks.linkedin && (
                  <a
                    href={student.socialLinks.linkedin}
                    className="flex items-center gap-3 text-sm text-foreground hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    LinkedIn Profile
                  </a>
                )}
                {student.socialLinks.github && (
                  <a
                    href={student.socialLinks.github}
                    className="flex items-center gap-3 text-sm text-foreground hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    GitHub Profile
                  </a>
                )}
                {student.socialLinks.orcid && (
                  <a
                    href={student.socialLinks.orcid}
                    className="flex items-center gap-3 text-sm text-foreground hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    ORCID Profile
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Stats (Below Header, Full Width) */}
      <div className="grid grid-cols-1 gap-5 mb-20">
        {/* Research Interests */}
        <Card>
          <CardHeader>
            <CardTitle>Research Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {student.researchInterests.map((interest, index) => (
                <Badge key={index} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Published Papers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Published Papers
            </CardTitle>
            <CardDescription>Academic papers and publications</CardDescription>
          </CardHeader>
          <CardContent>
            {student.publishedPapers.length > 0 ? (
              <div className="space-y-4">
                {student.publishedPapers.map((paper, index) => (
                  <HorizontalCard
                    key={index}
                    id={index.toString()} // Ensure id is a string
                    title={paper.title}
                    authors={[student.name]} // Placeholder author
                    journal="IPUB Academic Platform" // Placeholder journal
                    year={paper.year}
                    citations="N/A" // Placeholder citations
                    abstract="No abstract available." // Placeholder abstract
                    tags={student.researchInterests.slice(0, 2)} // Use research interests as tags
                    image="https://idpdefault.s3.ap-south-1.amazonaws.com/589465a620a8be4fd4220240116115232.jpg" // Placeholder image
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No published papers yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
