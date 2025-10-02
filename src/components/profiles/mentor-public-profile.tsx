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
import HorizontalCard from '@/components/card/HorizontalCard';
import {
  MapPin,
  Mail,
  Globe,
  ExternalLink,
  BookOpen,
  Users,
  Award,
} from 'lucide-react';

interface MentorPublicProfileProps {
  mentor: {
    name: string;
    title: string;
    department: string;
    university: string;
    avatar?: string;
    bio: string;
    researchInterests: string[];
    mentoredWorks: Array<{
      title: string;
      author: string;
      year: string;
      link?: string;
    }>;
    publications: Array<{
      title: string;
      journal: string;
      year: string;
      link?: string;
    }>;
    stats: {
      studentsGuided: number;
      papersApproved: number;
      yearsExperience: number;
    };
    contact: {
      email: string;
      website?: string;
      office?: string;
      officeHours?: string;
    };
    socialLinks: {
      linkedin?: string;
      orcid?: string;
      googleScholar?: string;
    };
  };
}

export function MentorPublicProfile({ mentor }: MentorPublicProfileProps) {
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
                    src={mentor.avatar || '/placeholder.svg'}
                    alt={mentor.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {mentor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {mentor.name}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-2">
                    {mentor.title}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {mentor.department}, {mentor.university}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      Request Mentorship
                    </Button>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-5">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  {mentor.stats.studentsGuided}
                </CardTitle>
                <CardDescription>Students Guided</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  {mentor.stats.papersApproved}
                </CardTitle>
                <CardDescription>Papers Approved</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  {mentor.stats.yearsExperience}+
                </CardTitle>
                <CardDescription>Years Experience</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {mentor.bio}
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
                <span className="text-sm">{mentor.contact.email}</span>
              </div>
              {mentor.contact.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={mentor.contact.website}
                    className="text-sm text-primary hover:underline"
                  >
                    Personal Website
                  </a>
                </div>
              )}
              {mentor.contact.office && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{mentor.contact.office}</span>
                </div>
              )}
              {mentor.contact.officeHours && (
                <div>
                  <p className="text-sm font-medium mb-1">Office Hours</p>
                  <p className="text-sm text-muted-foreground">
                    {mentor.contact.officeHours}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          {(mentor.socialLinks.linkedin ||
            mentor.socialLinks.orcid ||
            mentor.socialLinks.googleScholar) && (
            <Card>
              <CardHeader>
                <CardTitle>Professional Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mentor.socialLinks.linkedin && (
                  <a
                    href={mentor.socialLinks.linkedin}
                    className="flex items-center gap-3 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    LinkedIn Profile
                  </a>
                )}
                {mentor.socialLinks.orcid && (
                  <a
                    href={mentor.socialLinks.orcid}
                    className="flex items-center gap-3 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    ORCID Profile
                  </a>
                )}
                {mentor.socialLinks.googleScholar && (
                  <a
                    href={mentor.socialLinks.googleScholar}
                    className="flex items-center gap-3 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Google Scholar
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 mb-20">
        {/* Research Interests */}
        <Card>
            <CardHeader>
              <CardTitle>Research Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mentor.researchInterests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mentored Works */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Mentored Works
              </CardTitle>
              <CardDescription>Papers guided to publication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentor.mentoredWorks.map((work, index) => (
                  <div key={index} className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{work.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        By {work.author} • {work.year}
                      </p>
                    </div>
                    {work.link && (
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Publications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recent Publications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentor.publications.length > 0 ? (
                  mentor.publications.map((publication, index) => (
                    <HorizontalCard
                      key={index}
                      id={index.toString()} // Use id instead of paperId
                      title={publication.title}
                      authors={[mentor.name]} // Placeholder author
                      journal={publication.journal}
                      year={publication.year}
                      citations="N/A" // Placeholder citations
                      abstract="No abstract available." // Placeholder abstract
                      tags={mentor.researchInterests.slice(0, 2)} // Use research interests as tags
                      image="https://idpdefault.s3.ap-south-1.amazonaws.com/589465a620a8be4fd4220240116115232.jpg" // Placeholder image
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No publications yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
