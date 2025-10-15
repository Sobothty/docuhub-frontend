"use client";

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
import { useTranslation } from "react-i18next";

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
      "This document provides a detailed overview of GlobalCorp’s financial performance for the fiscal year 2024, including revenue, expenses, and projections for 2025.",
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
    userTitle: "ISTAD’s Student",
    content:
      "IPUB AcademicHub helped me publish my first research paper and connect with mentors who guided me every step of the way.",
    rating: 5,
    userImage: "/memberTeam/ChimTheara.JPG",
  },
  {
    id: "2",
    userName: "Sorn Sophamarinet",
    userTitle: "ISTAD’s Student",
    content:
      "The platform streamlines mentorship and feedback, making it easier to guide multiple students and track their progress.",
    rating: 4,
    userImage: "/memberTeam/SornSophamarinet.JPG",
  },
  {
    id: "3",
    userName: "BUT SEAVTHONG",
    userTitle: "ISTAD’s Student",
    content:
      "I discovered valuable research in my field and received constructive feedback that greatly improved a lot of my works.",
    rating: 5,
    userImage: "/memberTeam/BUTSEAVTHONG.jpg",
  },
  {
    id: "4",
    userName: "KRY SOBOTHTY",
    userTitle: "ISTAD’s Student",
    content:
      "The advanced search and project discovery features helped me find relevant studies and collaborate with peers worldwide.",
    rating: 4,
    userImage: "/memberTeam/KrySobothty.JPG",
  },
];

const getYear = (paper: { publishedAt?: string | null; createdAt?: string | null }) => {
  const dateStr = paper.publishedAt || paper.createdAt;
  if (!dateStr || dateStr === "null") return "";

  const year = new Date(dateStr).getFullYear();
  return isNaN(year) ? "" : year.toString();
};

export default function Home() {
  const { t } = useTranslation("common");

  const handleViewPaper = (paperId: number) => {
    window.location.href = `/papers/${paperId}`;
  };
  const handleDownloadPDF = (paperId: number) =>
    console.log("Download PDF:", paperId);
  const handleToggleBookmark = (paperId: number) =>
    console.log("Toggle bookmark:", paperId);

  // Fetch papers using RTK Query
  const { data: papersData, isLoading, error } = useGetAllPublishedPapersQuery({});

  const papers = papersData?.papers.content ?? [];
  console.log("Papers : ", papersData)

  type PaperType = {
    uuid: string;
    title: string;
    authorUuid?: string;
    categoryNames?: string[];
    publishedAt?: string | null;
    createdAt?: string | null;
    abstractText?: string;
    thumbnailUrl?: string | null; // allow null
    citations?: string;
    fileUrl?: string;
  };

  // Fix type for papers mapping
  const apiPapers = papers.map((paper: PaperType) => ({
    id: paper.uuid, // always string
    title: paper.title,
    authorUuid: paper.authorUuid,
    authors: [paper.authorUuid ?? "Unknown Author"],
    authorImage: "/default-author.png",
    journal: paper.categoryNames?.[0] ?? "",
    year: getYear(paper), // always string
    abstract: paper.abstractText ?? "",
    tags: paper.categoryNames ?? [],
    isBookmarked: false,
    image: paper.thumbnailUrl ?? "/default-image.png",
    citations: paper.citations ?? "",
    thumbnailUrl: paper.thumbnailUrl ?? undefined, // always string | undefined
    publishedAt: paper.publishedAt ?? undefined, // always string | undefined
    fileUrl: paper.fileUrl,
  }));

  const papersToShow = apiPapers.length > 0 ? apiPapers : researchPapers;

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Hero Section */}
      <HeroSection />

      <DevelopmentServicesBanner />

      {/* Card Section */}
      <section className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[var(--color-foreground)] mb-2 sm:mb-4 md:mb-6 lg:mb-8">
          New Documents
        </h2>
        <div className="mb-2 sm:mb-4 md:mb-6">
          <ButtonScrollHorizontal />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading papers...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Failed to load papers from API</p>
            <p className="text-sm text-gray-500">Showing sample data instead</p>
          </div>
        )}

        {/* Papers Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {papersToShow.map((paper) => (
              <PaperCardWithAuthor
                key={paper.id}
                paper={paper}
                onDownloadPDF={() => handleDownloadPDF(Number(paper.id))}
                onToggleBookmark={() => handleToggleBookmark(Number(paper.id))}
              />
            ))}
          </div>
        )}
      </section>

      {/* Most Popular Documents */}
      <section className="w-full px-2 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 bg-background">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-section-headings text-center mb-6 sm:mb-8 md:mb-10">
          Popular Documents
        </h2>
        <HorizontalCardCarousel
          papers={researchPapers}
          onViewPaper={handleViewPaper}
          onDownloadPDF={handleDownloadPDF}
          onToggleBookmark={handleToggleBookmark}
        />
      </section>

      {/* Feature Section */}
      <FeatureCardGrid />
      <AdventureSection />
      <WorksCardGrid />
      <DiscussionForumSection />

      {/* Feedback Section */}
      <section className="w-full py-6 sm:py-8 md:py-12">
        {/* Banner */}
        <div className="relative w-full h-40 sm:h-56 md:h-72 lg:h-[28rem] bg-[url('/banner/feedbackBanner.png')] bg-cover bg-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Text Content */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 sm:px-4 md:px-6 text-center sm:text-left sm:pl-10 z-10">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 md:mb-4">
              Discover Academic Excellence
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-200">
              Access thousands of research papers and connect with academic mentors
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="max-w-[90%] sm:max-w-[85%] md:max-w-7xl mx-auto -mt-16 sm:-mt-20 md:-mt-32 mb-8 sm:mb-12 md:mb-20 px-2 sm:px-4 md:px-6 lg:px-8">
          <FeedbackCardCarousel
            feedbacks={feedbacksData}
            autoPlay
            autoPlayInterval={6000}
            showControls
            showIndicators
          />
        </div>
      </section>
    </div>
  );
}

// PaperCardWithAuthor props and types
interface PaperCardWithAuthorProps {
  paper: {
    id: string; // always string
    title: string;
    authors: string[];
    authorImage?: string;
    journal?: string;
    year?: string;
    citations?: string;
    abstract?: string;
    tags?: string[];
    isBookmarked?: boolean;
    image?: string;
    authorUuid?: string;
    thumbnailUrl?: string;
    publishedAt?: string;
    fileUrl?: string;
  };
  onDownloadPDF: (fileUrl?: string) => void;
  onToggleBookmark: (id: string) => void;
}

function PaperCardWithAuthor({ paper, onDownloadPDF, onToggleBookmark }: PaperCardWithAuthorProps) {
  const {
    data: author,
    isLoading: authorLoading
  } = useGetUserByIdQuery(paper.authorUuid ?? "", {
    skip: !paper.authorUuid,
  });

  return (
    <VerticalCard
      key={paper.id}
      paperId={paper.id} // always string
      title={paper.title}
      authors={authorLoading ? ["Loading..."] : author ? [author.fullName || "Unknown Author"] : ["Unknown Author"]}
      authorImage={
        author?.imageUrl ||
        "./placeholder.svg"
      }
      journal={paper.journal}
      year={paper.year} // pass year, not publishedAt
      citations={paper.citations}
      abstract={paper.abstract}
      tags={paper.tags}
      isBookmarked={paper.isBookmarked}
      image={
        paper.thumbnailUrl ??
        "https://storage.googleapis.com/bukas-website-v3-prd/website_v3/images/Article_Image_College_Courses_x_Computer_and_I.width-800.png"
      }
      onDownloadPDF={() => onDownloadPDF(paper.fileUrl)}
      onToggleBookmark={() => onToggleBookmark(paper.id)}
    />
  );
}
