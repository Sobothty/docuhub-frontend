"use client";

import { StudentPublicProfile } from "@/components/profiles/student-public-profile";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetPapersByAuthorQuery } from "@/feature/paperSlice/papers";
import Loading from "@/app/loading";

export default function StudentProfilePage() {
  // Fetch complete user profile data
  const {
    data: userProfile,
    isLoading: userLoading,
    error: userError,
  } = useGetUserProfileQuery();

  // Fetch student's papers
  const { data: papersData, isLoading: papersLoading } =
    useGetPapersByAuthorQuery({});

  if (userLoading || papersLoading) {
    return <Loading />;
  }

  if (userError || !userProfile) {
    return (
      <div className="min-h-screen bg-background py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500">Student not found</h1>
          <p className="text-muted-foreground mt-2">
            The student profile you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  // Transform API data to match StudentPublicProfile expected format
  const studentData = {
    name:
      userProfile.user.fullName ||
      `${userProfile.user.firstName} ${userProfile.user.lastName}`,
    school: userProfile.student?.university || "University",
    year: `Graduate Student - ${
      userProfile.student?.yearsOfStudy || "N/A"
    } Year`,
    major: userProfile.student?.major || "N/A",
    avatar: userProfile.user.imageUrl || "/placeholder.svg",
    bio: userProfile.user.bio || "No bio available",
    researchInterests: [], // Add if available in your API
    publishedPapers:
      papersData?.papers?.content?.map((paper) => ({
        title: paper.title,
        year: new Date(paper.publishedAt || paper.createdAt)
          .getFullYear()
          .toString(),
        status: paper.isPublished ? "published" : "under review",
        link: `/papers/${paper.uuid}`,
      })) || [],
    mentor: {
      name: "Not assigned", // Add mentor info if available
      title: "",
      profileLink: "#",
    },
    stats: {
      papersPublished:
        papersData?.papers?.content?.filter((p) => p.isPublished).length || 0,
      papersInProgress:
        papersData?.papers?.content?.filter((p) => !p.isPublished).length || 0,
      academicYear: userProfile.student?.yearsOfStudy?.toString() || "N/A",
    },
    contact: {
      email: userProfile.user.email || "",
      portfolio: "", // Add if available
    },
    socialLinks: {
      linkedin: "",
      github: "",
      orcid: "",
    },
  };

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <StudentPublicProfile student={studentData} />
    </div>
  );
}
