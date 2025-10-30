"use client";

import { useState } from "react";
import HeroSection from "@/components/heroSection/HeroSection";
import DevelopmentServicesBanner from "@/components/carousel/LogoCarousel";
import ButtonScrollHorizontal from "@/components/scrollHorizontal/buttonScrollHorizontal";
import VerticalCard from "@/components/card/verticalCard";
import HorizontalCardCarousel from "@/components/carousel/HorizontalCardCarousel.tsx";
import FeatureCardGrid from "@/components/cardGrid/FeatureCardGrid";
import AdventureSection from "@/components/ctaBanner/CtaBanner";
import WorksCardGrid from "@/components/cardGrid/WorksCardGrid";
import DiscussionForumSection from "@/components/ctaBanner/DiscussionForumSection";
import FeedbackCardCarousel from "@/components/carousel/FeedbackCarousel";
import { motion, useScroll } from "motion/react";
import { useGetAllPublishedPapersQuery } from "@/feature/paperSlice/papers";
import { useGetUserByIdQuery } from "@/feature/users/usersSlice";

// Sample research paper data
const researchPapers = [
  {
    id: "1",
    title: "Annual Financial Report 2024",
    authors: ["Finance Department"],
    authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    journal: "GlobalCorp Ltd",
    year: "2024",
    citations: "120",
    abstract:
      "This document provides a detailed overview of GlobalCorp's financial performance for the fiscal year 2024, including revenue, expenses, and projections for 2025.",
    tags: ["Finance", "Reports"],
    isBookmarked: false,
    image:
      "https://storage.googleapis.com/bukas-website-v3-prd/website_v3/images/Article_Image_College_Courses_x_Computer_and_I.width-800.png",
  },
  {
    id: "2",
    title: "Public Health Guidelines for 2025",
    authors: ["Ministry of Health"],
    authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    journal: "National Health Council",
    year: "2025",
    citations: "85",
    abstract:
      "Updated public health guidelines outlining preventive measures, vaccination strategies, and emergency preparedness protocols for 2025.",
    tags: ["Health", "Guidelines"],
    isBookmarked: true,
    image:
      "https://picnie-data.s3.ap-south-1.amazonaws.com/templates_output_images/new_7178_230917084321.jpg",
  },
  {
    id: "3",
    title: "Smart City Development Plan",
    authors: ["Urban Development Authority"],
    authorImage: "https://randomuser.me/api/portraits/men/56.jpg",
    journal: "City Council",
    year: "2024",
    citations: "65",
    abstract:
      "A strategic plan detailing infrastructure, technology integration, and sustainability projects for the upcoming Smart City initiative.",
    tags: ["Urban Planning", "Sustainability"],
    isBookmarked: false,
    image:
      "https://idpdefault.s3.ap-south-1.amazonaws.com/589465a620a8be4fd4220240116115232.jpg",
  },
  {
    id: "4",
    title: "Environmental Impact Assessment",
    authors: ["Eco Analytics Team"],
    authorImage: "https://randomuser.me/api/portraits/women/68.jpg",
    journal: "Green Earth Foundation",
    year: "2024",
    citations: "150",
    abstract:
      "This report analyzes the environmental impact of industrial projects across regions and provides recommendations for eco-friendly practices.",
    tags: ["Environment", "Assessment"],
    isBookmarked: false,
    image:
      "https://data-flair.training/wp-content/uploads/2020/06/free-python-certification-course-thumbnail.webp",
  },
  {
    id: "5",
    title: "Digital Transformation Strategy",
    authors: ["IT Strategy Board"],
    authorImage: "https://randomuser.me/api/portraits/men/70.jpg",
    journal: "TechVision Group",
    year: "2024",
    citations: "95",
    abstract:
      "A roadmap for implementing digital technologies across various business units, focusing on automation, AI adoption, and data security.",
    tags: ["Technology", "Business"],
    isBookmarked: true,
    image:
      "https://instructor-academy.onlinecoursehost.com/content/images/2020/10/react-2.png",
  },
  {
    id: "6",
    title: "Tourism Development Report",
    authors: ["Tourism Authority"],
    authorImage: "https://randomuser.me/api/portraits/women/55.jpg",
    journal: "National Tourism Board",
    year: "2025",
    citations: "78",
    abstract:
      "An official report highlighting growth opportunities, investment plans, and cultural preservation strategies for the tourism sector.",
    tags: ["Tourism", "Development"],
    isBookmarked: false,
    image:
      "https://data-flair.training/wp-content/uploads/2023/06/free-javascript-certification-course-thumbnail-hindi.webp",
  },
];

const feedbacksData = [
  {
    id: "1",
    userName: "Chim Theara",
    userTitle: "ISTAD's Student",
    content:
      "IPUB AcademicHub helped me publish my first research paper and connect with mentors who guided me every step of the way.",
    rating: 5,
    userImage: "/memberTeam/ChimTheara.JPG",
  },
  {
    id: "2",
    userName: "Sorn Sophamarinet",
    userTitle: "ISTAD's Student",
    content:
      "The platform streamlines mentorship and feedback, making it easier to guide multiple students and track their progress.",
    rating: 4,
    userImage: "/memberTeam/SornSophamarinet.JPG",
  },
  {
    id: "3",
    userName: "BUT SEAVTHONG",
    userTitle: "ISTAD's Student",
    content:
      "I discovered valuable research in my field and received constructive feedback that greatly improved a lot of my works.",
    rating: 5,
    userImage: "/memberTeam/BUTSEAVTHONG.jpg",
  },
  {
    id: "4",
    userName: "KRY SOBOTHTY",
    userTitle: "ISTAD's Student",
    content:
      "The advanced search and project discovery features helped me find relevant studies and collaborate with peers worldwide.",
    rating: 4,
    userImage: "/memberTeam/KrySobothty.JPG",
  },
  {
    id: "5",
    userName: "SIM PENGSEANG",
    userTitle: "ISTAD's Student",
    content:
      "Docuhub AcademicHub has been a game-changer for my research journey. The resources and support available are unparalleled.",
    rating: 4,
    userImage: "/memberTeam/PengSeangSim.JPG",
  },
  {
    id: "6",
    userName: "PHO HONGLEAP",
    userTitle: "ISTAD's Student",
    content:
      "I highly recommend IPUB AcademicHub to any student or researcher looking to elevate their work and connect with a vibrant academic community.",
    rating: 4,
    userImage: "/memberTeam/PhoHongleap.JPG",
  },
];

const getYear = (paper: {
  publishedAt?: string | null;
  createdAt?: string | null;
}) => {
  const dateStr = paper.publishedAt || paper.createdAt;
  if (!dateStr || dateStr === "null") return "";

  const year = new Date(dateStr).getFullYear();
  return isNaN(year) ? "" : year.toString();
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleViewPaper = (paperId: number) => {
    if (typeof window !== "undefined") {
      window.location.href = `/papers/${paperId}`;
    }
  };

  const handleDownloadPDF = (paperId: number) =>
    console.log("Download PDF:", paperId);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  // Fetch papers using RTK Query
  const {
    data: papersData,
    isLoading,
    error,
  } = useGetAllPublishedPapersQuery({});

  const papers = papersData?.papers.content ?? [];

  type PaperType = {
    uuid: string;
    title: string;
    authorUuid?: string;
    categoryNames?: string[];
    publishedAt?: string | null;
    createdAt?: string | null;
    abstractText?: string;
    thumbnailUrl?: string | null;
    citations?: string;
    fileUrl?: string;
  };

  const apiPapers = papers.map((paper: PaperType) => ({
    id: paper.uuid,
    title: paper.title,
    authorUuid: paper.authorUuid,
    authors: [paper.authorUuid ?? "Unknown Author"],
    authorImage: "/default-author.png",
    journal: paper.categoryNames?.[0] ?? "",
    year: getYear(paper),
    abstract: paper.abstractText ?? "",
    tags: paper.categoryNames ?? [],
    image: paper.thumbnailUrl ?? "/default-image.png",
    citations: paper.citations ?? "",
    thumbnailUrl: paper.thumbnailUrl ?? undefined,
    publishedAt: paper.publishedAt ?? undefined,
    fileUrl: paper.fileUrl,
  }));

  const allPapers = apiPapers.length > 0 ? apiPapers : researchPapers;

  // Filter papers by categoryName and title
  const papersToShow = allPapers.filter((paper) => {
    if (selectedFilter === "All") return true;

    // Check if the filter matches any category name
    const matchesCategory = paper.tags?.some(
      (tag) =>
        tag.toLowerCase().includes(selectedFilter.toLowerCase()) ||
        selectedFilter.toLowerCase().includes(tag.toLowerCase())
    );

    // Check if the filter matches the title
    const matchesTitle = paper.title
      .toLowerCase()
      .includes(selectedFilter.toLowerCase());

    return matchesCategory || matchesTitle;
  });

  return (
    <>
      <motion.div
        id="scroll-indicator"
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          top: 115,
          left: 0,
          right: 0,
          height: 5,
          originX: 0,
          backgroundColor: "#f59e0b",
          zIndex: 9999,
        }}
      />

      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <HeroSection />
        <DevelopmentServicesBanner />

        {/* Card Section */}
        <section className="dashboard-background w-full px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="max-w-[1400px] mx-auto">
            <div className="home-section-header text-center">
              <h2 className="home-section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3">
                New Documents
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Explore the latest academic papers and research publications
              </p>
            </div>
            <div className="mb-8 md:mb-10">
              <ButtonScrollHorizontal onFilterChange={handleFilterChange} />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="home-section-card flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <span className="ml-3 text-lg font-medium text-foreground">
                  Loading papers...
                </span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="home-section-card text-center py-12">
                <p className="text-red-500 mb-2 text-lg font-semibold">
                  Failed to load papers from API
                </p>
                <p className="text-base text-muted-foreground">
                  Showing sample data instead
                </p>
              </div>
            )}

            {/* Papers Grid */}
            {!isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {papersToShow.map((paper) => (
                  <PaperCardWithAuthor
                    key={paper.id}
                    paper={paper}
                    onDownloadPDF={() => handleDownloadPDF(Number(paper.id))}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Most Popular Documents */}
        <section className="dashboard-background w-full px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="max-w-[1400px] mx-auto">
            <div className="home-section-header text-center">
              <h2 className="home-section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3">
                Popular Documents
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Discover the most viewed and cited research papers
              </p>
            </div>
            <HorizontalCardCarousel
              papers={researchPapers}
              onViewPaper={handleViewPaper}
              onDownloadPDF={handleDownloadPDF}
              onToggleBookmark={() => {}}
            />
          </div>
        </section>

        {/* Feature Section */}
        <FeatureCardGrid />
        <AdventureSection />
        <WorksCardGrid />
        <DiscussionForumSection />

        {/* Feedback Section */}
        <section className="dashboard-background w-full py-8 md:py-12 lg:py-16">
          <div className="max-w-[1400px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="home-section-header text-center mb-8">
              <h2 className="home-section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3">
                Student Testimonials
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Hear from our community of students and researchers
              </p>
            </div>

            <div className="relative w-full h-40 sm:h-56 md:h-72 lg:h-[28rem] bg-[url('/banner/feedbackBanner.png')] bg-cover bg-center rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-600/50"></div>
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 sm:px-4 md:px-6 text-center sm:text-left sm:pl-10 z-10">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-7xl font-bold text-white mb-1 sm:mb-2 md:mb-4">
                  We Prominent Truly Trusted IT Student
                </h1>
              </div>
            </div>

            <div className="home-section-card -mt-16 sm:-mt-20 md:-mt-32 mb-8 sm:mb-12">
              <FeedbackCardCarousel
                feedbacks={feedbacksData}
                autoPlay
                autoPlayInterval={6000}
                showIndicators
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

interface PaperCardWithAuthorProps {
  paper: {
    id: string;
    title: string;
    authors: string[];
    authorImage?: string;
    journal?: string;
    year?: string;
    citations?: string;
    abstract?: string;
    tags?: string[];
    image?: string;
    authorUuid?: string;
    thumbnailUrl?: string;
    publishedAt?: string;
    fileUrl?: string;
  };
  onDownloadPDF: (fileUrl?: string) => void;
}

function PaperCardWithAuthor({
  paper,
  onDownloadPDF,
}: PaperCardWithAuthorProps) {
  const { data: author, isLoading: authorLoading } = useGetUserByIdQuery(
    paper.authorUuid ?? "",
    {
      skip: !paper.authorUuid,
    }
  );

  return (
    <VerticalCard
      key={paper.id}
      paperId={paper.id}
      title={paper.title}
      authors={
        authorLoading
          ? ["Loading..."]
          : author
          ? [author.fullName || "Unknown Author"]
          : ["Unknown Author"]
      }
      authorImage={author?.imageUrl || "./placeholder.svg"}
      journal={paper.journal}
      year={paper.year}
      citations={paper.citations}
      abstract={paper.abstract}
      tags={paper.tags}
      image={
        paper.thumbnailUrl ??
        "https://storage.googleapis.com/bukas-website-v3-prd/website_v3/images/Article_Image_College_Courses_x_Computer_and_I.width-800.png"
      }
      authorUuid={paper.authorUuid}
      onDownloadPDF={() => onDownloadPDF(paper.fileUrl)}
    />
  );
}
