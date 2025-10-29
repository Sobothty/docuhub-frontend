"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Globe,
  ExternalLink,
  BookOpen,
  User,
  GraduationCap,
  FileText,
  Clock,
  Sparkles,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";

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
  // Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  // Show toast notification
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Handle download with notification
  const handleDownload = (paperTitle: string, paperLink?: string) => {
    if (!paperLink) {
      showToast("Paper link is not available", "error");
      return;
    }

    try {
      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = paperLink;
      link.target = "_blank";
      link.download = `${paperTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success notification
      showToast(`Downloading "${paperTitle}"`, "success");
    } catch {
      showToast("Failed to download the paper. Please try again.", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="student-profile-page-header">
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Student Profile
        </h1>
        <p className="text-muted-foreground text-lg">
          Academic profile and published research
        </p>
      </div>

      {/* Main Content and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card with Accent */}
          <Card className="student-profile-header-card">
            <div className="student-profile-accent-bar" />
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative">
                  <Avatar
                    className="h-32 w-32 mx-auto md:mx-0 border-4 shadow-lg"
                    style={{ borderColor: "var(--color-secondary)" }}
                  >
                    <AvatarImage
                      src={student.avatar || "/placeholder.svg"}
                      alt={student.name}
                    />
                    <AvatarFallback
                      className="text-2xl"
                      style={{
                        backgroundColor: "var(--color-secondary)",
                        color: "white",
                      }}
                    >
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold gradient-text mb-2">
                    {student.name}
                  </h2>
                  <p className="text-xl text-muted-foreground mb-3">
                    {student.year}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-2">
                    <GraduationCap
                      className="h-5 w-5"
                      style={{ color: "var(--color-secondary)" }}
                    />
                    <span className="text-base">
                      {student.major}, {student.school}
                    </span>
                  </div>
                  {student.mentor && student.mentor.name !== "Not assigned" && (
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mt-3">
                      <User
                        className="h-5 w-5"
                        style={{ color: "var(--color-secondary)" }}
                      />
                      <span className="text-base">
                        Mentored by{" "}
                        {student.mentor.profileLink &&
                        student.mentor.profileLink !== "#" ? (
                          <a
                            href={student.mentor.profileLink}
                            className="font-semibold hover:underline"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            {student.mentor.name}
                          </a>
                        ) : (
                          <span
                            className="font-semibold"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            {student.mentor.name}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-5">
            <Card className="student-profile-stat-card text-center">
              <CardHeader>
                <div
                  className="mx-auto mb-2 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-secondary)" }}
                >
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold gradient-text">
                  {student.stats.papersPublished}
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  Published Papers
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="student-profile-stat-card text-center">
              <CardHeader>
                <div
                  className="mx-auto mb-2 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-accent)" }}
                >
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-accent)" }}
                >
                  {student.stats.papersInProgress}
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  In Progress
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="student-profile-stat-card text-center">
              <CardHeader>
                <div
                  className="mx-auto mb-2 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-secondary)" }}
                >
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold gradient-text">
                  {student.stats.academicYear}
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  Academic Year
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* About Card */}
          <Card className="student-profile-content-card">
            <div className="student-profile-accent-bar" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User
                  className="h-5 w-5"
                  style={{ color: "var(--color-secondary)" }}
                />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-base">
                {student.bio}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (Right Column) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Information */}
          <Card className="student-profile-content-card">
            <div className="student-profile-accent-bar" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail
                  className="h-5 w-5"
                  style={{ color: "var(--color-secondary)" }}
                />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="student-profile-contact-item flex items-center gap-3">
                <Mail
                  className="h-5 w-5"
                  style={{ color: "var(--color-secondary)" }}
                />
                <span className="text-sm break-all">
                  {student.contact.email}
                </span>
              </div>
              {student.contact.portfolio && (
                <div className="student-profile-contact-item flex items-center gap-3">
                  <Globe
                    className="h-5 w-5"
                    style={{ color: "var(--color-secondary)" }}
                  />
                  <a
                    href={student.contact.portfolio}
                    className="text-sm hover:underline"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    Portfolio Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mentor Information */}
          {student.mentor && student.mentor.name !== "Not assigned" && (
            <Card className="student-profile-content-card">
              <div className="student-profile-accent-bar" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User
                    className="h-5 w-5"
                    style={{ color: "var(--color-accent)" }}
                  />
                  Mentor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="student-profile-mentor-box">
                  <h4 className="font-semibold text-lg mb-1">
                    {student.mentor.name}
                  </h4>
                  {student.mentor.title && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {student.mentor.title}
                    </p>
                  )}
                  {student.mentor.profileLink &&
                    student.mentor.profileLink !== "#" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 gap-2 text-white border-0"
                        style={{ backgroundColor: "var(--color-accent)" }}
                      >
                        <User className="h-4 w-4" />
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
            <Card className="student-profile-content-card">
              <div className="student-profile-accent-bar" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ExternalLink
                    className="h-5 w-5"
                    style={{ color: "var(--color-secondary)" }}
                  />
                  Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {student.socialLinks.linkedin && (
                  <a
                    href={student.socialLinks.linkedin}
                    className="student-profile-social-link flex items-center gap-3 text-sm hover:underline"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    LinkedIn Profile
                  </a>
                )}
                {student.socialLinks.github && (
                  <a
                    href={student.socialLinks.github}
                    className="student-profile-social-link flex items-center gap-3 text-sm hover:underline"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    GitHub Profile
                  </a>
                )}
                {student.socialLinks.orcid && (
                  <a
                    href={student.socialLinks.orcid}
                    className="student-profile-social-link flex items-center gap-3 text-sm hover:underline"
                    style={{ color: "var(--color-secondary)" }}
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
      <div className="grid grid-cols-1 gap-6 mb-20">
        {/* Research Interests */}
        {student.researchInterests.length > 0 && (
          <Card className="student-profile-content-card">
            <div className="student-profile-accent-bar" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles
                  className="h-6 w-6"
                  style={{ color: "var(--color-secondary)" }}
                />
                Research Interests
              </CardTitle>
              <CardDescription className="text-base">
                Areas of academic focus and research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {student.researchInterests.map((interest, index) => (
                  <Badge
                    key={index}
                    className="px-4 py-2 text-sm font-semibold text-white border-0"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Published Papers */}
        <Card className="student-profile-content-card">
          <div className="student-profile-accent-bar" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen
                    className="h-6 w-6"
                    style={{ color: "var(--color-secondary)" }}
                  />
                  Published Papers
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Academic papers and publications
                </CardDescription>
              </div>
              <Badge
                className="px-4 py-2 text-lg font-bold text-white border-0"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                {student.publishedPapers.length}{" "}
                {student.publishedPapers.length === 1 ? "Paper" : "Papers"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {student.publishedPapers.length > 0 ? (
              <div className="space-y-4">
                {student.publishedPapers.map((paper, index) => (
                  <div
                    key={index}
                    className="student-profile-paper-card hover:shadow-xl"
                  >
                    <div className="flex flex-col md:flex-row gap-4 p-4">
                      {/* Paper Info */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="horizontal-paper-card-title text-xl mb-2">
                            {paper.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <User className="h-4 w-4" />
                              <span>{student.name}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              <span>{paper.year}</span>
                            </div>
                            <span>•</span>
                            <Badge
                              className="text-xs px-2 py-1"
                              style={{
                                backgroundColor: "rgba(37, 99, 235, 0.1)",
                                color: "var(--color-secondary)",
                                border: "1px solid var(--color-secondary)",
                              }}
                            >
                              {paper.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-wrap">
                          {paper.link && (
                            <Button
                              onClick={() => window.open(paper.link, "_blank")}
                              size="sm"
                              className="gap-2 text-white border-0"
                              style={{
                                backgroundColor: "var(--color-secondary)",
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                              View Paper
                            </Button>
                          )}
                          <Button
                            onClick={() =>
                              handleDownload(paper.title, paper.link)
                            }
                            size="sm"
                            variant="outline"
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div
                  className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(37, 99, 235, 0.1)" }}
                >
                  <FileText
                    className="h-10 w-10"
                    style={{ color: "var(--color-secondary)" }}
                  />
                </div>
                <p className="text-muted-foreground text-lg font-medium">
                  No published papers yet
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Papers will appear here once published
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl animate-in slide-in-from-bottom-5 duration-300"
          style={{
            backgroundColor:
              toast.type === "success"
                ? "var(--color-secondary)"
                : "rgb(239, 68, 68)",
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-white" />
          ) : (
            <XCircle className="h-5 w-5 text-white" />
          )}
          <p className="text-white font-medium text-sm">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
