"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import HorizontalCard from "@/components/card/HorizontalCard";
import { useGetAllPublishedPapersQuery } from "@/feature/paperSlice/papers";
import { useGetAllCategoriesQuery } from "@/feature/categoriesSlice/categoriesSlices";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);

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
    page: currentPage,
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

  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentPage(0);
  };

  // Handle search from popular searches
  const handlePopularSearch = (search: string) => {
    setSearchQuery(search);
    setSelectedCategory("");
    setCurrentPage(0);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setCurrentPage(0);
  };

  // Filter papers based on search query and category
  const filteredResults = useMemo(() => {
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

    return results;
  }, [searchQuery, selectedCategory, apiPapers, t]);

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
        field: "Quantum Computing",
        institution: "MIT",
        papers: "47",
        citations: "2.3k",
        avatar: "/memberTeam/BUTSEAVTHONG.jpg", // Fixed path
      },
      {
        id: "2",
        name: "Mr. Kry Sobothty",
        field: "Machine Learning",
        institution: "Stanford",
        papers: "89",
        citations: "5.1k",
        avatar: "/memberTeam/KrySobothty.jpg", // Fixed path
      },
      {
        id: "3",
        name: "Ms. Chim Theara",
        field: "Climate Science",
        institution: "UC Berkeley",
        papers: "34",
        citations: "1.8k",
        avatar: "/memberTeam/ChimTheara.JPG", // Fixed path
      },
      {
        id: "4",
        name: "Ms.Khim Sokha",
        field: "Quantum Computing",
        institution: "MIT",
        papers: "47",
        citations: "2.3k",
        avatar: "/memberTeam/KHIMSOKHA.jpg", // Fixed path
      },
      {
        id: "5",
        name: "Mr. Sim Pengseang",
        field: "Machine Learning",
        institution: "Stanford",
        papers: "89",
        citations: "5.1k",
        avatar: "/memberTeam/PengSeangSim.JPG", // Fixed path
      },
      {
        id: "6",
        name: "Ms. Sorn Sophamarinet",
        field: "Climate Science",
        institution: "UC Berkeley",
        papers: "34",
        citations: "1.8k",
        avatar: "/memberTeam/SornSophamarinet.JPG", // Fixed path
      },
      {
        id: "7",
        name: "Mr. Vyra Vanarith",
        field: "Machine Learning",
        institution: "Stanford",
        papers: "89",
        citations: "5.1k",
        avatar: "/memberTeam/VannarithVr.JPG", // Fixed path
      },
      {
        id: "8",
        name: "Mr. Pho Hongleap",
        field: "Climate Science",
        institution: "UC Berkeley",
        papers: "34",
        citations: "1.8k",
        avatar: "/memberTeam/PhoHongleap.JPG", // Fixed path
      },
    ],
    []
  );

  // Handle paper actions
  const toggleFavorite = (id: string) => {
    console.log("Toggling favorite for:", id);
  };

  const handleDownloadPDF = (paperId: string, fileUrl: string) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  const handleViewPaper = (paperId: string) => {
    // Navigate to paper detail page or open modal
    console.log("View paper:", paperId);
  };

  // Helper function to render card decoration based on type
  const renderCardDecoration = (decoration: string) => {
    switch (decoration) {
      case "devops":
        return (
          <>
            <div className="absolute top-2 right-2 text-small-text text-blue-200">
              {t("cloudAndCode") || "Cloud & Code"}
            </div>
            <div className="absolute bottom-2 right-2 w-12 h-12 border-4 border-blue-300 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-400 rounded-full"></div>
            </div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400 rounded-full"></div>
          </>
        );
      case "cloud":
        return (
          <>
            <div className="absolute top-2 right-2 text-small-text text-blue-200">
              CLOUD
            </div>
            <div className="absolute bottom-2 right-2 w-8 h-12 bg-blue-300 rounded border-2 border-white"></div>
          </>
        );
      case "blockchain":
        return (
          <>
            <div className="absolute top-2 left-2 w-3 h-3 bg-blue-400 rounded"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-blue-400 rounded"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-blue-400 rounded"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-blue-400 rounded"></div>
          </>
        );
      case "security":
        return (
          <>
            <div className="absolute top-2 right-2 text-small-text text-green-200">
              SECURE
            </div>
            <div className="absolute bottom-2 right-2 w-8 h-12 bg-green-300 rounded border-2 border-white flex flex-col items-center justify-center">
              <div className="w-4 h-1 bg-white mb-1"></div>
              <div className="w-4 h-1 bg-white mb-1"></div>
              <div className="w-4 h-1 bg-white"></div>
            </div>
          </>
        );
      case "ai":
        return (
          <>
            <div className="absolute top-2 right-2 text-small-text text-purple-200">
              AI
            </div>
            <div className="absolute bottom-2 right-2 w-10 h-10 bg-purple-300 rounded-lg border-2 border-white flex items-center justify-center">
              <span className="text-white font-bold text-xs">ML</span>
            </div>
          </>
        );
      case "data":
        return (
          <>
            <div className="absolute top-2 right-2 text-small-text text-orange-200">
              DATA
            </div>
            <div className="absolute bottom-2 right-2 w-10 h-10 bg-orange-300 rounded-lg border-2 border-white flex items-center justify-center">
              <span className="text-white font-bold text-xs">DS</span>
            </div>
          </>
        );
      case "nlp":
        return (
          <>
            <div className="absolute top-2 right-2 text-small-text text-teal-200">
              NLP
            </div>
            <div className="absolute bottom-2 right-2 w-10 h-10 bg-teal-300 rounded-lg border-2 border-white flex items-center justify-center">
              <span className="text-white font-bold text-xs">NL</span>
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="absolute top-2 right-2 text-small-text text-gray-200">
              NEW
            </div>
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-gray-300 rounded border-2 border-white"></div>
          </>
        );
    }
  };

  return (
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
                <h2 className="text-subheadings font-bold text-foreground">
                  {t("searchResults") || "Search Results"}
                </h2>
                <div className="flex items-center space-x-4">
                  {(searchQuery || selectedCategory) && (
                    <button
                      onClick={clearFilters}
                      className="text-small-text text-secondary hover:text-secondary-hover font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                  {selectedCategory && (
                    <span className="text-small-text text-foreground bg-secondary/20 px-3 py-1 rounded-full">
                      Category: {selectedCategory}
                    </span>
                  )}
                  <span className="text-small-text text-foreground">
                    Showing {filteredResults.length} of{" "}
                    {papersResponse?.papers?.totalElements || 0} results
                  </span>
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
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-hover"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredResults.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {filteredResults.map((result) => (
                      <HorizontalCard
                        id={result.id}
                        key={result.id}
                        title={result.title}
                        authors={result.authors}
                        journal={result.journal}
                        year={result.year}
                        citations={result.citations}
                        abstract={result.abstract}
                        tags={result.tags}
                        image={result.thumbnail}
                        isBookmarked={result.isBookmarked}
                        authorImage={result.thumbnail}
                        onDownloadPDF={() =>
                          handleDownloadPDF(result.id, result.fileUrl)
                        }
                        onToggleBookmark={() => toggleFavorite(result.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {!searchQuery &&
                    !selectedCategory &&
                    papersResponse?.papers?.totalPages &&
                    papersResponse.papers.totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-4 mt-8">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(0, currentPage - 1))
                          }
                          disabled={currentPage === 0}
                          className="px-4 py-2 bg-secondary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-hover"
                        >
                          Previous
                        </button>
                        <span className="text-foreground">
                          Page {currentPage + 1} of{" "}
                          {papersResponse.papers.totalPages}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(
                                papersResponse.papers.totalPages - 1,
                                currentPage + 1
                              )
                            )
                          }
                          disabled={
                            currentPage >= papersResponse.papers.totalPages - 1
                          }
                          className="px-4 py-2 bg-secondary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-hover"
                        >
                          Next
                        </button>
                      </div>
                    )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-foreground mb-2">📄 No papers found</div>
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
              <div className="bg-card rounded-lg border border-border p-6 sticky top-30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-subheadings font-semibold text-foreground flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t("filters") || "Filters"}
                  </h3>
                  {(searchQuery || selectedCategory) && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-secondary hover:text-secondary-hover"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-small-text font-medium text-foreground mb-2">
                      {t("categories") || "Categories"}:
                    </label>
                    {categoriesLoading ? (
                      <div className="w-full border border-border rounded-lg px-3 py-2 bg-card">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                      </div>
                    ) : (
                      <select
                        value={selectedCategory}
                        onChange={(e) => handleCategorySelect(e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 bg-card text-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      >
                        <option value="">
                          {t("selectCategories") || "Select Categories"}
                        </option>
                        {finalCategories.map((category) => (
                          <option key={category.uuid} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="pt-4">
                    <h4 className="text-small-text font-medium text-foreground mb-2">
                      {t("popularCategories") || "Popular Categories"}:
                    </h4>
                    <div className="space-y-2">
                      {finalCategories.slice(0, 6).map((category) => (
                        <button
                          key={category.uuid}
                          onClick={() => handleCategorySelect(category.name)}
                          className={`flex items-center w-full text-left p-2 rounded transition-colors ${
                            selectedCategory === category.name
                              ? "bg-secondary/20 text-secondary border border-secondary/30"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-3 ${
                              selectedCategory === category.name
                                ? "bg-secondary"
                                : "bg-border"
                            }`}
                          ></div>
                          <span className="text-small-text text-foreground">
                            {category.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended for You Section with Real Papers */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-accent mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <h2 className="text-section-headings font-bold text-foreground">
                  {t("recommendedForYou") || "Recommended For You"}
                </h2>
              </div>
              <button className="text-secondary hover:text-secondary-hover text-small-text font-medium transition-colors">
                {t("viewAllRecommendations") || "View All Recommendations"}
              </button>
            </div>

            {recommendedPapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="h-32 bg-gradient-to-br from-secondary to-secondary/80 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-white/90 mb-2">
                            {paper.icon}
                          </div>
                          <div className="text-white text-small-text font-medium">
                            {paper.type}
                          </div>
                        </div>
                      </div>
                      {paper.badge && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            {paper.badge}
                          </span>
                        </div>
                      )}
                      {renderCardDecoration(paper.decoration)}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 leading-tight">
                        {paper.title}
                      </h3>
                      <p className="text-small-text text-foreground mb-3 line-clamp-1">
                        {paper.authors.join(", ")} • {paper.year}
                      </p>
                      {paper.subtitle && (
                        <p className="text-xs text-foreground/70 mb-3">
                          {paper.subtitle}
                        </p>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-foreground/70">
                          {paper.downloads} downloads
                        </span>
                      </div>
                      <button
                        onClick={() => handleViewPaper(paper.id)}
                        className="w-full bg-secondary hover:bg-secondary-hover text-white py-2 px-4 rounded-lg text-small-text font-medium transition-colors"
                      >
                        {t("viewPaper") || "View Paper"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-foreground mb-2">
                  🌟 No recommendations available
                </div>
                <p className="text-foreground">
                  More recommendations will appear as papers are published
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Researchers Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-section-headings font-bold text-foreground mb-4">
              {t("featuredResearchers") || "Featured Researchers"}
            </h2>
            <p className="text-body-text text-foreground max-w-2xl mx-auto">
              {t("meetLeadingExperts") ||
                "Meet our leading experts and researchers who are pushing the boundaries of knowledge"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredResearchers.map((researcher) => (
              <div
                key={researcher.id}
                className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                <div className="flex items-center mb-4">
                  <div className="relative w-24 h-24">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-secondary to-accent border-4 border-secondary/20">
                      <Image
                        src={researcher.avatar}
                        alt={researcher.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                              ${researcher.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>`;
                          }
                        }}
                        priority
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-subheadings font-semibold text-foreground">
                      {researcher.name}
                    </h3>
                    <p className="text-small-text text-foreground">
                      {researcher.field}
                    </p>
                    <p className="text-small-text text-foreground">
                      {researcher.institution}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center mb-4">
                  <div>
                    <div className="text-xl font-bold text-secondary">
                      {researcher.papers}
                    </div>
                    <div className="text-small-text text-foreground">
                      {t("papers") || "Papers"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-accent">
                      {researcher.citations}
                    </div>
                    <div className="text-small-text text-foreground">
                      {t("citations") || "Citations"}
                    </div>
                  </div>
                </div>
                <button className="w-full bg-muted hover:bg-muted/80 text-foreground py-2 px-4 rounded-lg text-small-text font-medium transition-colors">
                  {t("viewProfile") || "View Profile"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
