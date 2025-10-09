"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import HorizontalCard from "@/components/card/HorizontalCard";
import { useGetPapersWithPaginationQuery } from "@/feature/apiSlice/paperApi";
import { Paper } from "@/types/paperType";

// Translated categories and popular searches will be fetched from translation files
export default function BrowsePage() {
  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);

  // Fetch papers from API
  const {
    data: papersResponse,
    error: papersError,
    isLoading: papersLoading,
    isSuccess: papersSuccess,
  } = useGetPapersWithPaginationQuery({
    page: currentPage.toString(),
    size: pageSize.toString(),
  });

  // Transform API data to match UI expectations
  const apiPapers = useMemo(() => {
    if (!papersResponse?.papers?.content) return [];
    
    return papersResponse.papers.content.map((paper: Paper) => ({
      id: paper.uuid,
      title: paper.title,
      authors: [`Author ${paper.authorUuid.slice(0, 8)}`], // You may want to fetch actual author names
      journal: "Unknown Journal", // Not available in current API response
      year: new Date(paper.publishedAt || paper.createdAt).getFullYear().toString(),
      views: "0", // Not available in current API response
      thumbnail: paper.thumbnailUrl || "/subject-logo/default.png",
      snippet: paper.abstractText,
      tags: paper.categoryNames || [],
      isFavorited: false,
    }));
  }, [papersResponse]);

  // Categories and popular searches from translation files
  const categories = [
    t("categoriesList.allCategories"),
    t("categoriesList.machineLearning"),
    t("categoriesList.aiEthics"),
    t("categoriesList.computerVision"),
    t("categoriesList.nlp"),
    t("categoriesList.quantumComputing"),
    t("categoriesList.dataScience"),
    t("categoriesList.robotics"),
    t("categoriesList.cybersecurity"),
  ];

  const popularSearches = [
    t("popularSearchesList.machineLearning"),
    t("popularSearchesList.quantumComputing"),
    t("popularSearchesList.climateChange"),
    t("popularSearchesList.artificialIntelligence"),
  ];

  // Memoized sample search results data (static, consider backend for translations)
  const searchResults = useMemo(
    () => [
      {
        id: "1",
        title:
          "Advancements in Quantum Computing: A Comprehensive Review of Error Correction Methods",
        authors: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
        journal: "Nature",
        year: "2024",
        views: "156",
        thumbnail: "/subject-logo/blockchain.png",
        snippet:
          "This paper presents a comprehensive review of recent advancements in quantum computing, focusing on error correction methods and their applications in modern quantum systems.",
        tags: ["#Quantum Computing", "#Error Correction"],
        isFavorited: false,
      },
      {
        id: "2",
        title:
          "Machine Learning Applications in Climate Change Prediction Models",
        authors: ["Dr. Emily Rodriguez", "Prof. David Kim"],
        journal: "Science",
        year: "2024",
        views: "89",
        thumbnail: "/subject-logo/dataanalix.png",
        snippet:
          "An innovative approach to climate modeling using advanced machine learning algorithms to predict long-term climate patterns and extreme weather events.",
        tags: ["#Machine Learning", "#Climate Change"],
        isFavorited: true,
      },
      {
        id: "3",
        title:
          "Blockchain Technology in Supply Chain Management: A Systematic Review",
        authors: ["Prof. James Wilson", "Dr. Lisa Thompson"],
        journal: "IEEE Transactions",
        year: "2024",
        views: "234",
        thumbnail: "/subject-logo/blockchain.png",
        snippet:
          "This systematic review examines the implementation of blockchain technology in supply chain management and its impact on transparency and efficiency.",
        tags: ["#Blockchain", "#Supply Chain"],
        isFavorited: false,
      },
      {
        id: "4",
        title:
          "DevOps Practices in Modern Software Development: Best Practices and Implementation",
        authors: ["Dr. Robert Chen", "Prof. Amanda Davis"],
        journal: "ACM Computing Surveys",
        year: "2024",
        views: "167",
        thumbnail: "/subject-logo/devops.png",
        snippet:
          "A comprehensive analysis of DevOps methodologies, tools, and best practices for implementing continuous integration and deployment in software projects.",
        tags: ["#DevOps", "#Software Development"],
        isFavorited: false,
      },
      {
        id: "5",
        title:
          "Data Science Approaches to Healthcare Analytics: Improving Patient Outcomes",
        authors: ["Dr. Maria Garcia", "Prof. Thomas Brown"],
        journal: "Journal of Medical Internet Research",
        year: "2024",
        views: "198",
        thumbnail: "/subject-logo/dataanalix.png",
        snippet:
          "This research explores how data science and analytics can be leveraged to improve healthcare delivery and patient outcomes through predictive modeling.",
        tags: ["#Data Science", "#Healthcare"],
        isFavorited: true,
      },
      {
        id: "6",
        title:
          "Spring Framework Integration Patterns: A Developer’s Guide to Enterprise Applications",
        authors: ["Prof. Kevin Lee", "Dr. Jennifer White"],
        journal: "IEEE Software",
        year: "2024",
        views: "145",
        thumbnail: "/subject-logo/spring.png",
        snippet:
          "A comprehensive guide to implementing Spring Framework integration patterns for building scalable and maintainable enterprise applications.",
        tags: ["#Spring Framework", "#Enterprise"],
        isFavorited: false,
      },
    ],
    []
  );

  // Memoized recommendation data (static, consider backend for translations)
  const recommendations = useMemo(
    () => [
      {
        id: "1",
        title: "Deep Learning for Flutter Development in Mobile Application",
        authors: ["Dr. Anna Chen", "Prof. Mark Johnson"],
        year: "2024",
        type: "Flutter",
        icon: "F",
        badge: "TRISTATE",
        decoration: "flutter",
      },
      {
        id: "2",
        title: "Deep Learning for UX/UI Design in Web Application",
        authors: ["Dr. Anna Chen", "Prof. Mark Johnson"],
        year: "2024",
        type: "UI/UX Design",
        icon: "UI UX DESIGN",
        badge: "RECOMMENDATIONS",
        decoration: "ui-ux",
      },
      {
        id: "3",
        title: "Deep Learning for Medical Image Analysis",
        authors: ["Dr. Anna Chen", "Prof. Mark Johnson"],
        year: "2024",
        type: "Blockchain Technology",
        icon: "BLOCKCHAIN TECHNOLOGY",
        decoration: "blockchain",
      },
      {
        id: "4",
        title: "Deep Learning for Medical Image Analysis",
        authors: ["Dr. Anna Chen", "Prof. Mark Johnson"],
        year: "2024",
        type: "DevOps",
        icon: "DevOps",
        subtitle: "In Digital Transformation",
        badge: "Cloud&Code",
        decoration: "devops",
      },
      {
        id: "5",
        title: "Deep Learning for Medical Image Analysis",
        authors: ["Dr. Anna Chen", "Prof. Mark Johnson"],
        year: "2024",
        type: "DevOps",
        icon: "DevOps",
        subtitle: "In Digital Transformation",
        badge: "Cloud&Code",
        decoration: "devops",
      },
      {
        id: "6",
        title: "Deep Learning for Medical Image Analysis",
        authors: ["Dr. Anna Chen", "Prof. Mark Johnson"],
        year: "2024",
        type: "Blockchain Technology",
        icon: "BLOCKCHAIN TECHNOLOGY",
        decoration: "blockchain",
      },
    ],
    []
  );

  // Memoized featured researchers data (static, consider backend for translations)
  const featuredResearchers = useMemo(
    () => [
      {
        id: "1",
        name: "Mr. But SeavThong",
        field: "Quantum Computing",
        institution: "MIT",
        papers: "47",
        citations: "2.3k",
        avatar: "/memberTeam/BUTSEAVTHONG.jpg",
      },
      {
        id: "2",
        name: "Mr. Kry Sobothty",
        field: "Machine Learning",
        institution: "Stanford",
        papers: "89",
        citations: "5.1k",
        avatar: "/memberTeam/KRYSOBOTHTY.jpg",
      },
      {
        id: "3",
        name: "Ms. Chim Theara",
        field: "Climate Science",
        institution: "UC Berkeley",
        papers: "34",
        citations: "1.8k",
        avatar: "/memberTeam/ChimTheara.jpg",
      },
    ],
    []
  );

  const toggleFavorite = (id: string) => {
    console.log("Toggling favorite for:", id);
  };

  // Helper function to render card decoration based on type
  const renderCardDecoration = (decoration: string) => {
    switch (decoration) {
      case "flutter":
        return (
          <>
            <div className="absolute top-2 right-2 text-small-text text-blue-200">
              {t("tristate")}
            </div>
            <div className="absolute bottom-2 right-2 w-8 h-12 bg-blue-300 rounded border-2 border-white"></div>
          </>
        );
      case "ui-ux":
        return (
          <>
            <div className="absolute bottom-2 right-2 w-8 h-12 bg-blue-300 rounded border-2 border-white flex flex-col items-center justify-center">
              <div className="w-4 h-1 bg-white mb-1"></div>
              <div className="w-4 h-1 bg-white mb-1"></div>
              <div className="w-4 h-1 bg-white"></div>
            </div>
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
      case "devops":
        return (
          <>
            <div className="absolute top-2 right-2 text-small-text text-blue-200">
              {t("cloudAndCode")}
            </div>
            <div className="absolute bottom-2 right-2 w-12 h-12 border-4 border-blue-300 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-400 rounded-full"></div>
            </div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400 rounded-full"></div>
          </>
        );
      default:
        return null;
    }
  };

  // Filter search results based on query and category
  const filteredResults = useMemo(() => {
    console.log(
      "🔍 Browse Page - Filtering with query:",
      searchQuery,
      "category:",
      selectedCategory,
      "API papers count:",
      apiPapers.length
    );
    
    // Use API data if available, otherwise fall back to static data
    const dataToFilter = apiPapers.length > 0 ? apiPapers : searchResults;
    
    return dataToFilter.filter((result) => {
      const matchesQuery =
        !searchQuery ||
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.authors.some((author) =>
          author.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (result.journal && result.journal.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        !selectedCategory ||
        selectedCategory === t("categoriesList.allCategories") ||
        result.tags.some(
          (tag) =>
            tag.replace("#", "").toLowerCase() ===
            selectedCategory.toLowerCase()
        );

      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, selectedCategory, t, apiPapers, searchResults]);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Search Section */}
      <section className="py-25 px-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/browse.jpg"
            alt={t("exploreAcademicResearch")}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-hero-title font-bold text-white mb-4 drop-shadow-lg">
            {t("exploreAcademicResearch")}
          </h1>
          <p className="text-body-text text-white/90 mb-8 drop-shadow-md">
            {t("searchPlaceholder")}
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
                    placeholder={t("searchPlaceholder")}
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
              {t("popularSearches")}:{" "}
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
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
                  {t("searchResults")}
                </h2>
                <span className="text-small-text text-foreground">
                  {t("showingResults", { count: filteredResults.length })}
                </span>
              </div>

              {papersLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-card rounded-lg border border-border p-6 animate-pulse">
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
                  <div className="text-red-600 mb-2">⚠️ Error loading papers</div>
                  <p className="text-foreground">{JSON.stringify(papersError)}</p>
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
                        journal={result.journal || "Unknown Journal"}
                        year={result.year}
                        citations={result.views}
                        abstract={result.snippet}
                        tags={result.tags.map((tag) => tag.replace("#", ""))}
                        image={result.thumbnail}
                        isBookmarked={result.isFavorited}
                        authorImage={result.thumbnail}
                        onDownloadPDF={() =>
                          console.log("Download PDF:", result.id)
                        }
                        onToggleBookmark={() => toggleFavorite(result.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {papersResponse?.papers?.totalPages && papersResponse.papers.totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-8">
                      <button
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="px-4 py-2 bg-secondary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-hover"
                      >
                        Previous
                      </button>
                      <span className="text-foreground">
                        Page {currentPage + 1} of {papersResponse.papers.totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(papersResponse.papers.totalPages - 1, currentPage + 1))}
                        disabled={currentPage >= papersResponse.papers.totalPages - 1}
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
                  <p className="text-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>

            {/* Right Column - Filters */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-30">
                <h3 className="text-subheadings font-semibold text-foreground mb-4 flex items-center">
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
                  {t("filters")}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-small-text font-medium text-foreground mb-2">
                      {t("categories")}:
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full border border-border rounded-lg px-3 py-2 bg-card text-foreground hover:bg-card dark:bg-card dark:text-foreground dark:hover:bg-card focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    >
                      <option value="">{t("selectCategories")}</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-small-text font-medium text-foreground mb-2">
                      {t("selectedCategories")}:
                    </h4>
                    <div className="space-y-2">
                      {categories.slice(0, 4).map((category, index) => (
                        <label key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-border bg-card text-secondary dark:bg-card focus:ring-secondary"
                          />
                          <span className="ml-2 text-small-text text-foreground hover:text-foreground dark:hover:text-foreground">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended for You Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
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
                  {t("recommendedForYou")}
                </h2>
              </div>
              <button className="text-secondary hover:text-secondary-hover text-small-text font-medium transition-colors">
                {t("viewAllRecommendations")}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-32 bg-secondary relative overflow-hidden">
                    {recommendation.type === "Flutter" ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl font-bold text-blue-300 mb-2">
                            {recommendation.icon}
                          </div>
                          <div className="text-white text-small-text">
                            {recommendation.type}
                          </div>
                        </div>
                      </div>
                    ) : recommendation.type === "UI/UX Design" ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center border-4 border-blue-400">
                          <span className="text-white text-small-text font-bold text-center leading-tight line-clamp-2 px-2">
                            {recommendation.icon}
                          </span>
                        </div>
                      </div>
                    ) : recommendation.type === "Blockchain Technology" ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center border-4 border-blue-400">
                          <span className="text-white text-small-text font-bold text-center leading-tight">
                            {recommendation.icon}
                          </span>
                        </div>
                      </div>
                    ) : recommendation.type === "DevOps" ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-white font-bold text-2xl">
                            {recommendation.icon}
                          </div>
                          {recommendation.subtitle && (
                            <div className="text-white text-small-text">
                              {recommendation.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                    {renderCardDecoration(recommendation.decoration)}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {recommendation.title}
                    </h3>
                    <p className="text-small-text text-foreground mb-3 line-clamp-1">
                      {recommendation.authors.join(", ")} •{" "}
                      {recommendation.year}
                    </p>
                    <button className="w-full bg-secondary hover:bg-secondary-hover text-white py-2 px-4 rounded-lg text-small-text font-medium transition-colors">
                      {t("viewPaper")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Researchers Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-section-headings font-bold text-foreground mb-4">
              {t("featuredResearchers")}
            </h2>
            <p className="text-body-text text-foreground">
              {t("meetLeadingExperts")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredResearchers.map((researcher) => (
              <div
                key={researcher.id}
                className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                <div className="flex items-center mb-4">
                  <Image
                    src={researcher.avatar}
                    alt={researcher.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover mr-4"
                  />
                  <div>
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
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-secondary">
                      {researcher.papers}
                    </div>
                    <div className="text-small-text text-foreground">
                      {t("papers")}
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-accent">
                      {researcher.citations}
                    </div>
                    <div className="text-small-text text-foreground">
                      {t("citations")}
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-muted hover:bg-muted/80 text-foreground py-2 px-4 rounded-lg text-small-text font-medium transition-colors">
                  {t("viewProfile")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
