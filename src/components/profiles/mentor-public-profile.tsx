import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HorizontalCardForAuthor from "@/components/card/HorizontalCardForAuthor";
import {
  MapPin,
  Mail,
  Globe,
  ExternalLink,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  FileCheck,
  Clock,
  Sparkles,
} from "lucide-react";

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
      abstract?: string;
      tags?: string[];
      image?: string;
      downloads?: string;
      star?: string;
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="dashboard-header rounded-2xl p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
            <AvatarImage
              src={mentor.avatar || "/placeholder.svg"}
              alt={mentor.name}
            />
            <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              {mentor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              {mentor.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-3">{mentor.title}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-6">
              <MapPin className="h-5 w-5" />
              <span className="text-base">
                {mentor.department}, {mentor.university}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button className="advisor-profile-btn-primary px-6 py-2 rounded-xl">
                <Users className="h-5 w-5 mr-2" />
                Request Mentorship
              </Button>
              <Button className="advisor-profile-btn-secondary px-6 py-2 rounded-xl">
                <Mail className="h-5 w-5 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="advisor-profile-stat-card">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--color-secondary)" }}
              >
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold gradient-text">
                  {mentor.stats.studentsGuided}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  Students Guided
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="advisor-profile-stat-card">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--color-secondary)" }}
              >
                <FileCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold gradient-text">
                  {mentor.stats.papersApproved}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  Papers Approved
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="advisor-profile-stat-card">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--color-secondary)" }}
              >
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold gradient-text">
                  {mentor.stats.yearsExperience}+
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  Years Experience
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card className="dashboard-card border-0">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "var(--color-secondary)" }}
                >
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold gradient-text">
                  About
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-base">
                {mentor.bio}
              </p>
            </CardContent>
          </Card>

          {/* Research Interests */}
          <Card className="dashboard-card border-0">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "var(--color-secondary)" }}
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold gradient-text">
                  Research Interests
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {mentor.researchInterests.map((interest, index) => (
                  <Badge
                    key={index}
                    className="px-4 py-2 text-sm font-semibold"
                    style={{
                      background: "var(--color-secondary)",
                      color: "white",
                    }}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mentored Works */}
          <Card className="dashboard-card border-0">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "var(--color-secondary)" }}
                >
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold gradient-text">
                    Mentored Works
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Papers guided to publication
                  </p>
                </div>
                <Badge
                  className="text-sm font-semibold px-4 py-2"
                  style={{
                    background: "var(--color-secondary)",
                    color: "white",
                  }}
                >
                  {mentor.mentoredWorks.length} Papers
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentor.mentoredWorks.map((work, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-all"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-base mb-1">{work.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        By {work.author} • {work.year}
                      </p>
                    </div>
                    {work.link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-4"
                        onClick={() => window.open(work.link, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Information */}
          <Card className="dashboard-card border-0">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "var(--color-secondary)" }}
                >
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold gradient-text">
                  Contact
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm break-all">
                  {mentor.contact.email}
                </span>
              </div>
              {mentor.contact.website && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <a
                    href={mentor.contact.website}
                    className="text-sm hover:underline break-all"
                    style={{ color: "var(--color-secondary)" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Personal Website
                  </a>
                </div>
              )}
              {mentor.contact.office && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{mentor.contact.office}</span>
                </div>
              )}
              {mentor.contact.officeHours && (
                <div className="p-3 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-bold">Office Hours</p>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
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
            <Card className="dashboard-card border-0">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ background: "var(--color-secondary)" }}
                  >
                    <ExternalLink className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold gradient-text">
                    Professional Links
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mentor.socialLinks.linkedin && (
                  <a
                    href={mentor.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      LinkedIn Profile
                    </span>
                  </a>
                )}
                {mentor.socialLinks.orcid && (
                  <a
                    href={mentor.socialLinks.orcid}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      ORCID Profile
                    </span>
                  </a>
                )}
                {mentor.socialLinks.googleScholar && (
                  <a
                    href={mentor.socialLinks.googleScholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      Google Scholar
                    </span>
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Publications */}
      <Card className="dashboard-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ background: "var(--color-secondary)" }}
              >
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold gradient-text">
                  Recent Publications
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Latest research papers and articles
                </p>
              </div>
            </div>
            <Badge
              className="text-sm font-semibold px-4 py-2"
              style={{
                background: "var(--color-secondary)",
                color: "white",
              }}
            >
              {mentor.publications.length} Publications
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {mentor.publications.length > 0 ? (
            <div className="space-y-5">
              {mentor.publications.map((publication, index) => (
                <HorizontalCardForAuthor
                  key={index}
                  id={index.toString()}
                  title={publication.title}
                  journal={publication.journal}
                  year={publication.year}
                  downloads={publication.downloads || "0"}
                  abstract={publication.abstract || "No abstract available."}
                  tags={
                    publication.tags || mentor.researchInterests.slice(0, 3)
                  }
                  image={
                    publication.image ||
                    "https://idpdefault.s3.ap-south-1.amazonaws.com/589465a620a8be4fd4220240116115232.jpg"
                  }
                  star={publication.star || "0"}
                  onViewPaper={() =>
                    publication.link && window.open(publication.link, "_blank")
                  }
                  onDownloadPDF={() =>
                    publication.link && window.open(publication.link, "_blank")
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-base">
                No publications yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
