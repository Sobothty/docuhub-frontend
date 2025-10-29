"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import HorizontalCard from "@/components/card/HorizontalCardForAuthor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAllPublishedPapersQuery } from "@/feature/paperSlice/papers";
import { useGetAllCategoriesQuery } from "@/feature/categoriesSlice/categoriesSlices";
import { useGetStarCountQuery } from "@/feature/star/StarSlice";
import { motion, useScroll } from "motion/react";

// Fallback categories based on your API response
const FALLBACK_CATEGORIES = [
  { uuid: "devops", name: "DevOps", slug: "devops" },
  { uuid: "cloud-engineer", name: "Cloud Engineer", slug: "cloud-engineer" },
  { uuid: "block-chain", name: "Block Chain", slug: "block-chain" },
  { uuid: "cybersecurity", name: "Cybersecurity", slug: "cybersecurity" },
  {
    uuid: "machine-learning",
    name: "Machine Learning",
    slug: "machine-learning",
  },
  { uuid: "robotics", name: "Robotics", slug: "robotics" },
  {
    uuid: "natural-language-processing",
    name: "Natural Language Processing",
    slug: "natural-language-processing",
  },
];

// Helper function to get decoration type based on category - MOVED TO TOP LEVEL
const getDecorationType = (category: string = "") => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes("devops")) return "devops";
  if (categoryLower.includes("cloud")) return "cloud";
  if (
    categoryLower.includes("blockchain") ||
    categoryLower.includes("block chain")
  )
    return "blockchain";
  if (categoryLower.includes("cyber") || categoryLower.includes("security"))
    return "security";
  if (
    categoryLower.includes("machine") ||
    categoryLower.includes("ai") ||
    categoryLower.includes("artificial")
  )
    return "ai";
  if (categoryLower.includes("data")) return "data";
  if (categoryLower.includes("natural") || categoryLower.includes("nlp"))
    return "nlp";
  return "default";
};

export default function BrowsePage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [pageSize] = useState(100);

  // Fetch categories from API - with error handling for 404
  const {
    data: apiCategoriesResponse,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery();

  // Extract categories array from response
  const apiCategories = useMemo(() => {
    if (!apiCategoriesResponse?.content) return [];
    return apiCategoriesResponse.content;
  }, [apiCategoriesResponse]);

  // Fetch published papers from API
  const {
    data: papersResponse,
    error: papersError,
    isLoading: papersLoading,
    isFetching: papersFetching,
  } = useGetAllPublishedPapersQuery({
    page: 0,
    size: pageSize,
    sortBy: "publishedAt",
    direction: "desc",
  });
  // Extract unique categories from papers as another fallback
  const categoriesFromPapers = useMemo(() => {
    if (!papersResponse?.papers?.content) return [];

    const uniqueCategories = new Set<string>();
    papersResponse.papers.content.forEach((paper) => {
      paper.categoryNames?.forEach((category) => {
        uniqueCategories.add(category);
      });
    });

    return Array.from(uniqueCategories).map((category) => ({
      uuid: category.toLowerCase().replace(/\s+/g, "-"),
      name: category,
      slug: category.toLowerCase().replace(/\s+/g, "-"),
    }));
  }, [papersResponse]);

  // Final categories to use - prioritize API categories, then paper categories, then fallback
  const finalCategories = useMemo(() => {
    const allCategoriesOption = {
      uuid: "all",
      name: t("categoriesList.allCategories") || "All Categories",
      slug: "",
    };

    if (apiCategories.length > 0 && !categoriesError) {
      return [allCategoriesOption, ...apiCategories];
    } else if (categoriesFromPapers.length > 0) {
      return [allCategoriesOption, ...categoriesFromPapers];
    } else {
      return [allCategoriesOption, ...FALLBACK_CATEGORIES];
    }
  }, [apiCategories, categoriesFromPapers, categoriesError, t]);

  // Transform API papers to match UI expectations
  const apiPapers = useMemo(() => {
    if (!papersResponse?.papers?.content) return [];

    return papersResponse.papers.content.map((paper) => ({
      id: paper.uuid,
      title: paper.title,
      authors: [`Author ${paper.authorUuid?.slice(0, 8) || "Unknown"}`],
      journal: "Research Journal",
      year: paper.publishedAt
        ? new Date(paper.publishedAt).getFullYear().toString()
        : paper.createdAt
        ? new Date(paper.createdAt).getFullYear().toString()
        : "2024",
      citations: paper.downloads?.toString() || "0",
      downloads: paper.downloads?.toString() || "0",
      thumbnail: paper.thumbnailUrl || "/subject-logo/default.png",
      abstract: paper.abstractText || "No abstract available",
      tags: paper.categoryNames || [],
      isBookmarked: false,
      fileUrl: paper.fileUrl,
      status: paper.status,
      isPublished: paper.isPublished,
    }));
  }, [papersResponse]);

  // Popular searches from translation files
  const popularSearches = [
    t("popularSearchesList.machineLearning") || "Machine Learning",
    t("popularSearchesList.quantumComputing") || "Quantum Computing",
    t("popularSearchesList.climateChange") || "Climate Change",
    t("popularSearchesList.artificialIntelligence") ||
      "Artificial Intelligence",
  ];

  const { scrollYProgress } = useScroll();

  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1);
  };

  // Handle search from popular searches
  const handlePopularSearch = (search: string) => {
    setSearchQuery(search);
    setSelectedCategory("");
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  // Filter, sort and paginate papers 
  const filteredAndSortedResults = useMemo(() => {
    let results = apiPapers;

    // Apply category filter
    if (
      selectedCategory &&
      selectedCategory !==
        (t("categoriesList.allCategories") || "All Categories")
    ) {
      results = results.filter((paper) =>
        paper.tags.some(
          (tag) => tag.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }

    // Apply search query filter
    if (searchQuery) {
      results = results.filter((paper) => {
        const matchesTitle = paper.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesAuthors = paper.authors.some((author) =>
          author.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesAbstract = paper.abstract
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesTags = paper.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return matchesTitle || matchesAuthors || matchesAbstract || matchesTags;
      });
    }

    // Sort by year (latest first)
    results.sort((a, b) => parseInt(b.year) - parseInt(a.year));

    return results;
  }, [searchQuery, selectedCategory, apiPapers, t]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPapers = filteredAndSortedResults.slice(startIndex, endIndex);

  // Get recommended papers (most downloaded or recent papers)
  const recommendedPapers = useMemo(() => {
    if (!apiPapers.length) return [];

    // Sort by downloads (citations) and take top 6
    return [...apiPapers]
      .sort((a, b) => parseInt(b.citations) - parseInt(a.citations))
      .slice(0, 6)
      .map((paper, index) => ({
        id: paper.id,
        title: paper.title,
        authors: paper.authors,
        year: paper.year,
        type: paper.tags[0] || "Research",
        icon: paper.tags[0]?.charAt(0) || "R",
        badge: index === 0 ? "MOST POPULAR" : index < 3 ? "TRENDING" : "NEW",
        decoration: getDecorationType(paper.tags[0]), // Now this function is defined
        subtitle: paper.tags.length > 1 ? `In ${paper.tags[1]}` : undefined,
        downloads: paper.downloads,
        thumbnail: paper.thumbnail,
      }));
  }, [apiPapers]);

  // Memoized featured researchers data with fixed avatar paths
  const featuredResearchers = useMemo(
    () => [
      {
        id: "1",
        name: "Mr. But SeavThong",
        field: "Team Leader",
        institution: "ISTAD",
        papers: "47",
        citations: "2.3k",
        avatar: "/memberTeam/BUTSEAVTHONG.jpg", // Fixed path
      },
      {
        id: "2",
        name: "Mr. Kry Sobothty",
        field: "Full Stack Developer",
        institution: "ISTAD",
        papers: "89",
        citations: "5.1k",
        avatar: "/memberTeam/KrySobothty.jpg", // Fixed path
      },

      {
        id: "5",
        name: "Mr. Sim Pengseang",
        field: "Full Stack Developer",
        institution: "ISTAD",
        papers: "89",
        citations: "5.1k",
        avatar: "/memberTeam/PengSeangSim.JPG", // Fixed path
      },
      {
        id: "3",
        name: "Ms. Chim Theara",
        field: "Frontend Developer",
        institution: "ISTAD",
        papers: "34",
        citations: "1.8k",
        avatar: "/memberTeam/ChimTheara.JPG", // Fixed path
      },
      {
        id: "4",
        name: "Ms.Khim Sokha",
        field: "Ux/UI Designer",
        institution: "ISTAD",
        papers: "47",
        citations: "2.3k",
        avatar: "/memberTeam/KHIMSOKHA.jpg", // Fixed path
      },
      {
        id: "6",
        name: "Ms. Sorn Sophamarinet",
        field: "Frontend Developer",
        institution: "ISTAD",
        papers: "34",
        citations: "1.8k",
        avatar: "/memberTeam/SornSophamarinet.JPG", // Fixed path
      },
      {
        id: "7",
        name: "Mr. Vyra Vanarith",
        field: "Backend Developer",
        institution: "ISTAD",
        papers: "89",
        citations: "5.1k",
        avatar: "/memberTeam/VannarithVr.JPG", // Fixed path
      },
      {
        id: "8",
        name: "Mr. Pho Hongleap",
        field: "Frontend Developer",
        institution: "ISTAD",
        papers: "34",
        citations: "1.8k",
        avatar: "/memberTeam/PhoHongleap.JPG", // Fixed path
      },
    ],
    []
  );

  // Component to wrap HorizontalCard with star count
  interface PaperData {
    id: string;
    title: string;
    authors: string[];
    journal: string;
    year: string;
    citations: string;
    downloads: string;
    thumbnail: string;
    abstract: string;
    tags: string[];
    isBookmarked: boolean;
    fileUrl: string;
    status: string;
    isPublished: boolean;
  }

  interface HorizontalCardWithStarCountProps {
    paper: PaperData;
  }

  function HorizontalCardWithStarCount({
    paper,
  }: HorizontalCardWithStarCountProps) {
    const { data: starCount = 0, isLoading } = useGetStarCountQuery(paper.id);

    return (
      <HorizontalCard
        key={paper.id}
        id={paper.id}
        title={paper.title}
        journal={paper.tags.join(", ")}
        year={paper.year}
        downloads={paper.downloads}
        abstract={paper.abstract}
        tags={paper.tags}
        image={paper.thumbnail}
        star={isLoading ? "..." : starCount.toString()}
        onViewPaper={() => router.push(`/papers/${paper.id}`)}
        onDownloadPDF={() =>
          paper.fileUrl && window.open(paper.fileUrl, "_blank")
        }
      />
    );
  }

  return (
    <>
      <motion.div
        id="scroll-indicator"
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          top: 129,
          left: 0,
          right: 0,
          height: 5,
          originX: 0,
          backgroundColor: "#f59e0b",
          zIndex: 9999,
        }}
      />
      <div className="min-h-screen bg-background">
        {/* Main Search Section */}
        <section className="py-25 px-6 bg-background relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/img/browse.jpg"
              alt={t("exploreAcademicResearch") || "Explore Academic Research"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-hero-title font-bold text-white mb-4 drop-shadow-lg">
              {t("exploreAcademicResearch") || "Explore Academic Research"}
            </h1>
            <p className="text-body-text text-white/90 mb-8 drop-shadow-md">
              {t("searchPlaceholder") ||
                "Search through thousands of research papers"}
            </p>
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-black/30 dark:bg-black/50 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-white/10">
                <div className="flex">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-4 w-5 text-white/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder={
                        t("searchPlaceholder") || "Search research papers..."
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 text-white placeholder-white/70 caret-white bg-transparent border-0 focus:outline-none focus:ring-0 text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-left max-w-2xl mx-auto">
              <span className="text-small-text text-white/80 drop-shadow-md">
                {t("popularSearches") || "Popular Searches"}:
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(search)}
                    className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 text-small-text font-medium px-3 py-1 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Search Results and Filters Section */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Left Column - Search Results */}
              <div className="lg:col-span-3">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-bold gradient-text mb-2">
                      {t("searchResults") || "Search Results"}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Browse through latest published papers
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {(searchQuery || selectedCategory) && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="font-semibold"
                      >
                        Clear Filters
                      </Button>
                    )}
                    {selectedCategory && (
                      <Badge
                        className="text-sm font-semibold px-4 py-2"
                        style={{
                          background: "var(--color-secondary)",
                          color: "white",
                        }}
                      >
                        {selectedCategory}
                      </Badge>
                    )}
                    <Badge
                      className="text-sm font-semibold px-4 py-2"
                      style={{
                        background: "var(--color-secondary)",
                        color: "white",
                      }}
                    >
                      {filteredAndSortedResults.length} Papers
                    </Badge>
                  </div>
                </div>

                {papersLoading || papersFetching ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="bg-card rounded-lg border border-border p-6 animate-pulse"
                      >
                        <div className="flex space-x-4">
                          <div className="w-24 h-24 bg-muted rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                            <div className="h-3 bg-muted rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : papersError ? (
                  <div className="text-center py-12">
                    <div className="text-red-600 mb-2">
                      ⚠️ Error loading papers
                    </div>
                    <button
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          window.location.reload();
                        }
                      }}
                      className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-hover"
                    >
                      Retry
                    </button>
                  </div>
                ) : filteredAndSortedResults.length > 0 ? (
                  <>
                    <div className="space-y-6">
                      {currentPapers.map((result) => (
                        <HorizontalCardWithStarCount
                          key={result.id}
                          paper={result}
                        />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <Card className="dashboard-card border-0 mt-8">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            {/* Page Info */}
                            <div className="text-sm text-muted-foreground">
                              Showing {startIndex + 1} to{" "}
                              {Math.min(
                                endIndex,
                                filteredAndSortedResults.length
                              )}{" "}
                              of {filteredAndSortedResults.length} papers
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center gap-2">
                              {/* Previous Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(prev - 1, 1)
                                  )
                                }
                                disabled={currentPage === 1}
                                className="font-semibold"
                              >
                                Previous
                              </Button>

                              {/* Page Numbers */}
                              <div className="flex items-center gap-1">
                                {Array.from(
                                  { length: totalPages },
                                  (_, i) => i + 1
                                ).map((page) => {
                                  // Show first page, last page, current page, and pages around current
                                  if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 &&
                                      page <= currentPage + 1)
                                  ) {
                                    return (
                                      <Button
                                        key={page}
                                        variant={
                                          page === currentPage
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className={
                                          page === currentPage
                                            ? "font-bold text-white"
                                            : "font-semibold"
                                        }
                                        style={
                                          page === currentPage
                                            ? {
                                                background:
                                                  "var(--color-secondary)",
                                              }
                                            : {}
                                        }
                                      >
                                        {page}
                                      </Button>
                                    );
                                  } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                  ) {
                                    return (
                                      <span key={page} className="px-2">
                                        ...
                                      </span>
                                    );
                                  }
                                  return null;
                                })}
                              </div>

                              {/* Next Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                  )
                                }
                                disabled={currentPage === totalPages}
                                className="font-semibold"
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-foreground mb-2">
                      📄 No papers found
                    </div>
                    <p className="text-foreground mb-4">
                      {searchQuery || selectedCategory
                        ? "Try adjusting your search or filters"
                        : "No published papers available at the moment"}
                    </p>
                    {(searchQuery || selectedCategory) && (
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-hover"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column - Filters */}
              <div className="lg:col-span-1">
                <Card className="dashboard-card sticky top-30 border-0 shadow-lg">
                  {/* Header with gradient accent */}
                  <div
                    className="h-2 rounded-t-xl"
                    style={{
                      background:
                        "linear-gradient(to right, var(--color-secondary), var(--color-accent))",
                    }}
                  />

                  <CardContent className="p-6">
                    {/* Title Section */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: "var(--color-secondary)" }}
                        >
                          <svg
                            className="w-5 h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-card-foreground">
                            {t("filters") || "Filters"}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Refine your search
                          </p>
                        </div>
                      </div>
                      {(searchQuery || selectedCategory) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="text-xs font-semibold hover:bg-accent"
                          style={{ color: "var(--color-secondary)" }}
                        >
                          Clear All
                        </Button>
                      )}
                    </div>

                    {/* Categories Dropdown */}
                    <div className="space-y-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-card-foreground mb-3">
                          <svg
                            className="w-4 h-4"
                            style={{ color: "var(--color-secondary)" }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                          </svg>
                          {t("categories") || "All Categories"}
                        </label>
                        {categoriesLoading ? (
                          <div className="w-full border border-border rounded-xl px-4 py-3 bg-accent/20">
                            <div className="h-5 bg-accent/40 rounded animate-pulse"></div>
                          </div>
                        ) : (
                          <div className="relative">
                            <select
                              value={selectedCategory}
                              onChange={(e) =>
                                handleCategorySelect(e.target.value)
                              }
                              className="w-full border-2 rounded-xl px-4 py-3 bg-card text-card-foreground font-medium transition-all duration-200 focus:outline-none focus:ring-2 appearance-none cursor-pointer hover:border-opacity-70 shadow-sm"
                              style={{
                                borderColor: "var(--color-secondary)",
                              }}
                            >
                              <option value="">
                                {t("selectCategories") ||
                                  "🔍 Select a category..."}
                              </option>
                              {finalCategories.map((category) => (
                                <option
                                  key={category.uuid}
                                  value={category.name}
                                >
                                  {category.name}
                                </option>
                              ))}
                            </select>
                            {/* Custom dropdown arrow */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg
                                className="w-5 h-5"
                                style={{ color: "var(--color-secondary)" }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Popular Categories */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <svg
                            className="w-4 h-4"
                            style={{ color: "var(--color-accent)" }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <h4 className="text-sm font-semibold text-card-foreground">
                            {t("popularCategories") || "Popular Categories"}
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {finalCategories
                            .slice(0, 7)
                            .map((category, index) => (
                              <button
                                key={category.uuid}
                                onClick={() =>
                                  handleCategorySelect(category.name)
                                }
                                className={`group flex items-center justify-between w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                                  selectedCategory === category.name
                                    ? "shadow-md border-2"
                                    : "border-2 border-transparent hover:border-opacity-50"
                                }`}
                                style={
                                  selectedCategory === category.name
                                    ? {
                                        backgroundColor:
                                          "var(--color-secondary)",
                                        borderColor: "var(--color-secondary)",
                                      }
                                    : {
                                        backgroundColor: "var(--card)",
                                        borderColor: "var(--border)",
                                      }
                                }
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs transition-all duration-200 ${
                                      selectedCategory === category.name
                                        ? "bg-white/20 text-white"
                                        : "text-card-foreground"
                                    }`}
                                    style={
                                      selectedCategory !== category.name
                                        ? {
                                            backgroundColor:
                                              "var(--color-secondary)",
                                            color: "white",
                                            opacity: 0.8,
                                          }
                                        : {}
                                    }
                                  >
                                    {index + 1}
                                  </div>
                                  <span
                                    className={`text-sm font-semibold transition-colors ${
                                      selectedCategory === category.name
                                        ? "text-white"
                                        : "text-card-foreground group-hover:text-card-foreground"
                                    }`}
                                  >
                                    {category.name}
                                  </span>
                                </div>
                                {selectedCategory === category.name && (
                                  <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Active Filter Badge */}
                      {selectedCategory && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            Active Filter:
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                              className="px-3 py-1.5 font-semibold text-sm"
                              style={{
                                background: "var(--color-secondary)",
                                color: "white",
                              }}
                            >
                              {selectedCategory}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearFilters}
                              className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended for You Section with Real Papers */}
        <section className="py-16 px-6 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold gradient-text">
                    {t("recommendedForYou") || "Recommended For You"}
                  </h2>
                </div>
                <p className="text-muted-foreground ml-14">
                  Discover papers tailored to your interests
                </p>
              </div>
              <Button
                variant="outline"
                className="font-semibold group"
                style={{
                  borderColor: "var(--color-secondary)",
                  color: "var(--color-secondary)",
                }}
              >
                {t("viewAllRecommendations") || "View All"}
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </div>

            {recommendedPapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedPapers.map((paper, index) => (
                  <Card
                    key={paper.id}
                    className="group dashboard-card border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Top accent bar */}
                    <div
                      className="h-1.5"
                      style={{
                        background: "var(--color-secondary)",
                      }}
                    />

                    {/* Header with solid background */}
                    <div className="relative h-40 overflow-hidden">
                      <div
                        className="absolute inset-0"
                        style={{
                          background: "var(--color-secondary)",
                        }}
                      >
                        {/* Decorative circles */}
                        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
                      </div>

                      {/* Content */}
                      <div className="relative h-full flex flex-col items-center justify-center p-6">
                        <div className="text-6xl font-black text-white/90 mb-2">
                          {paper.icon}
                        </div>
                        <div className="text-white text-sm font-semibold px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                          {paper.type}
                        </div>
                      </div>

                      {/* Badge */}
                      {paper.badge && (
                        <div className="absolute top-3 left-3">
                          <Badge
                            className="text-xs font-bold px-2.5 py-1 shadow-lg text-white border-0"
                            style={{ background: "var(--color-secondary)" }}
                          >
                            {paper.badge === "MOST POPULAR" && "🔥 "}
                            {paper.badge === "TRENDING" && "📈 "}
                            {paper.badge === "NEW" && "✨ "}
                            {paper.badge}
                          </Badge>
                        </div>
                      )}

                      {/* Rank badge */}
                      <div className="absolute top-3 right-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                          style={{ backgroundColor: "var(--color-secondary)" }}
                        >
                          #{index + 1}
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      {/* Title */}
                      <h3 className="font-bold text-card-foreground mb-3 line-clamp-2 leading-tight text-lg min-h-[3.5rem]">
                        {paper.title}
                      </h3>

                      {/* Author and Year */}
                      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="line-clamp-1">
                          {paper.authors.join(", ")}
                        </span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="font-semibold">{paper.year}</span>
                      </div>

                      {/* Subtitle */}
                      {paper.subtitle && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-1 italic">
                          {paper.subtitle}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                        <div className="flex items-center gap-1.5 text-sm">
                          <svg
                            className="w-4 h-4"
                            style={{ color: "var(--color-secondary)" }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          <span className="font-semibold text-card-foreground">
                            {paper.downloads}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <svg
                            className="w-4 h-4"
                            style={{ color: "var(--color-accent)" }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-semibold text-card-foreground">
                            Recommended
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => router.push(`/papers/${paper.id}`)}
                        className="w-full font-semibold text-white shadow-md group"
                        style={{
                          background: "var(--color-secondary)",
                        }}
                      >
                        {t("viewPaper") || "View Paper"}
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="dashboard-card border-0">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--color-secondary)",
                        opacity: 0.1,
                      }}
                    >
                      <svg
                        className="w-10 h-10"
                        style={{ color: "var(--color-secondary)" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-card-foreground mb-2">
                        No Recommendations Yet
                      </h3>
                      <p className="text-muted-foreground">
                        More recommendations will appear as papers are published
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Featured Researchers Section */}
        <section className="py-16 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "var(--color-secondary)" }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold gradient-text">
                  {t("featuredResearchers") || "Featured Researchers"}
                </h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("meetLeadingExperts") ||
                  "Meet the leading experts in their fields"}
              </p>
            </div>

            {/* Researchers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResearchers.map((researcher) => (
                <Card
                  key={researcher.id}
                  className="dashboard-card border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  {/* Top accent bar */}
                  <div
                    className="h-1"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  />

                  <CardContent className="p-6">
                    {/* Avatar and Info */}
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="relative mb-4">
                        <div
                          className="relative w-20 h-20 rounded-full overflow-hidden border-4 shadow-lg transition-all duration-300 group-hover:scale-110"
                          style={{
                            borderColor: "var(--color-secondary)",
                          }}
                        >
                          <Image
                            src={researcher.avatar}
                            alt={researcher.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                            quality={100}
                            priority
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                const initials = researcher.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("");
                                parent.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center" style="background: var(--color-secondary)">
                      <span class="text-white font-bold text-xl">${initials}</span>
                    </div>
                  `;
                              }
                            }}
                          />
                        </div>
                        {/* Online indicator */}
                        <div
                          className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: "#22c55e" }}
                        />
                      </div>

                      <h3 className="text-lg font-bold text-card-foreground mb-1 group-hover:text-secondary transition-colors">
                        {researcher.name}
                      </h3>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">
                        {researcher.field}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {researcher.institution}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div
                        className="rounded-lg p-3 text-center border-2 transition-all duration-300"
                        style={{
                          borderColor: "var(--color-secondary)",
                          backgroundColor: "rgba(37, 99, 235, 0.05)",
                        }}
                      >
                        <div
                          className="text-2xl font-black mb-1"
                          style={{ color: "var(--color-secondary)" }}
                        >
                          {researcher.papers}
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground">
                          {t("papers") || "Papers"}
                        </div>
                      </div>
                      <div
                        className="rounded-lg p-3 text-center border-2 transition-all duration-300"
                        style={{
                          borderColor: "var(--color-secondary)",
                          backgroundColor: "rgba(37, 99, 235, 0.05)",
                        }}
                      >
                        <div
                          className="text-2xl font-black mb-1"
                          style={{ color: "var(--color-secondary)" }}
                        >
                          {researcher.citations}
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground">
                          {t("citations") || "Citations"}
                        </div>
                      </div>
                    </div>

                    {/* View Profile Button */}
                    <Button
                      className="w-full font-semibold text-white shadow-md group"
                      style={{ backgroundColor: "var(--color-secondary)" }}
                      onClick={() => {
                        // Handle profile view
                        console.log(`Viewing profile of ${researcher.name}`);
                      }}
                    >
                      {t("viewProfile") || "View Profile"}
                      <svg
                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
