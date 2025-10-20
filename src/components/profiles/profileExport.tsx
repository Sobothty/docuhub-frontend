"use client";

import React, { useState, useEffect, useMemo,  useCallback } from "react";
import {
  Download,
  User,
  BookOpen,
  Users,
  Search,
  Palette,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetPapersByAuthorQuery } from "@/feature/paperSlice/papers";
import { useGetAllAdvisersQuery } from "@/feature/users/studentSlice";
import DocuhubLoader from "../loader/docuhub-loading";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useGetCategoryNamesQuery } from "@/feature/categoriesSlice/categoriesSlices";
import { ExportData } from "@/types/profileExportType";

interface ProfileExportProps {
  userType: "student" | "adviser" | "admin";
}

const DEFAULT_COLORS = {
  primary: "#2563eb",
  secondary: "#1e40af",
  accent: "#3b82f6",
  textPrimary: "#ffffff",
  textSecondary: "#1f2937",
};

export default function ProfileExport({ userType }: ProfileExportProps) {
  // Use existing queries with proper error handling
  const {
    data: userProfile,
    isLoading: loadingProfile,
    error: profileError,
    refetch: refetchProfile,
  } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: papersData,
    isLoading: loadingPapers,
    error: papersError,
    refetch: refetchPapers,
  } = useGetPapersByAuthorQuery(
    {
      page: 0,
      size: 100,
    },
    {
      skip: !userProfile?.user?.uuid,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: advisers = [],
    isLoading: loadingAdvisers,
    error: advisersError,
    refetch: refetchAdvisers,
  } = useGetAllAdvisersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: categoryNames = ["all"], isLoading: loadingCategories } =
    useGetCategoryNamesQuery();

  const [selectedCategories, setSelectedCategories] = useState({
    papers: true,
    studentAdviser: true,
    studentInfo: true,
    researchTitles: true,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [researchCategory, setResearchCategory] = useState("all");
  const [previewContent, setPreviewContent] = useState<string>("");
  const [customColors, setCustomColors] = useState(DEFAULT_COLORS);
  const [iframeHeight, setIframeHeight] = useState(600);

  const categories = [
    { key: "papers", label: "Papers & Publications", icon: BookOpen },
    { key: "studentAdviser", label: "Adviser Relations", icon: Users },
    { key: "studentInfo", label: "Student Information", icon: User },
    { key: "researchTitles", label: "Research Titles", icon: BookOpen },
  ];

  // Check if there are any errors
  const hasErrors = profileError || papersError || advisersError;

  // Memoize prepared data to prevent unnecessary recalculations
  const exportData = useMemo(() => {
    if (!userProfile) return null;

    const data: ExportData = {};

    // Student Info
    if (selectedCategories.studentInfo && userProfile) {
      data.studentInfo = {
        uuid: userProfile.user.uuid,
        fullName: userProfile.user.fullName || "N/A",
        email: userProfile.user.email || "N/A",
        username: userProfile.user.userName || "N/A",
        gender: userProfile.user.gender || "N/A",
        bio: userProfile.user.bio || "N/A",
        imageUrl: userProfile.user.imageUrl || "/placeholder.svg",
        contactNumber: userProfile.user.contactNumber || "N/A",
        address: userProfile.user.address || "N/A",
        telegramId: userProfile.user.telegramId || "N/A",
        university: userProfile.student?.university || "N/A",
        major: userProfile.student?.major || "N/A",
        yearsOfStudy: userProfile.student?.yearsOfStudy || "N/A",
      };
    }

    // Papers
    if (selectedCategories.papers && papersData?.papers?.content) {
      let filteredPapers = papersData.papers.content;

      if (researchCategory !== "all") {
        filteredPapers = papersData.papers.content.filter((paper) =>
          paper.categoryNames.some((cat) =>
            cat.toLowerCase().includes(researchCategory.toLowerCase())
          )
        );
      }

      data.papers = filteredPapers.map((paper) => ({
        uuid: paper.uuid,
        title: paper.title,
        abstract: paper.abstractText || "No abstract available",
        categories: paper.categoryNames.join(", "),
        status: paper.status,
        isPublished: paper.isPublished,
        publishedAt: paper.publishedAt || "Not published",
        submittedAt: paper.submittedAt,
        downloads: paper.downloads || 0,
        isApproved: paper.isApproved,
      }));
    }

    // Adviser Relations
    if (selectedCategories.studentAdviser && advisers.length > 0) {
      data.studentAdviser = advisers.slice(0, 3).map((adviser) => ({
        adviserId: adviser.uuid,
        adviserName: adviser.fullName,
        adviserBio: adviser.bio || "No bio available",
        relationship: "Student-Adviser",
        status: adviser.status || "Active",
        startDate: new Date(adviser.createDate).toLocaleDateString(),
        researchArea: "Research collaboration",
      }));
    }

    // Research Titles
    if (selectedCategories.researchTitles && papersData?.papers?.content) {
      data.researchTitles = papersData.papers.content.map((paper) => ({
        title: paper.title,
        category: paper.categoryNames.join(", "),
        status: paper.status,
        submittedDate: paper.submittedAt,
      }));
    }

    return data;
  }, [userProfile, papersData, advisers, selectedCategories, researchCategory]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev],
    }));
  };

  // ✅ Wrapped with useCallback
  const generatePDFPreview = useCallback((data: ExportData, colors: typeof DEFAULT_COLORS) => {
    const styles = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important; 
        line-height: 1.6; 
        color: ${colors.textSecondary} !important;
        background: #f8fafc !important;
        padding: 20px;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background: white !important;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        position: relative;
      }
      .cv-header {
        background: ${colors.primary} !important;
        color: ${colors.textPrimary} !important;
        padding: 40px 30px 40px 60px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 25px;
        align-items: center;
        position: relative;
      }
      .profile-photo {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid ${colors.textPrimary} !important;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        background: white;
      }
      .profile-photo-placeholder {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2) !important;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4px solid ${colors.textPrimary} !important;
        color: ${colors.textPrimary} !important;
        font-size: 0.9rem;
      }
      .name-section h1 {
        font-size: 2.2rem;
        font-weight: 700;
        margin: 0;
        letter-spacing: 1px;
        color: ${colors.textPrimary} !important;
      }
      .name-section p {
        font-size: 1.2rem;
        margin: 8px 0 0 0;
        opacity: 0.95;
        color: ${colors.textPrimary} !important;
      }
      .contact-info {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        font-size: 0.9rem;
        color: ${colors.textPrimary} !important;
      }
      .contact-item {
        display: flex;
        align-items: center;
        gap: 10px;
        color: ${colors.textPrimary} !important;
      }
      .main-content {
        display: grid;
        grid-template-columns: 320px 1fr;
        min-height: 928px;
      }
      .sidebar {
        background: ${colors.primary} !important;
        color: ${colors.textPrimary} !important;
        padding: 35px 30px;
      }
      .sidebar-section {
        margin-bottom: 35px;
      }
      .sidebar-section h3 {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 15px;
        color: ${colors.textPrimary} !important;
        border-bottom: 2px solid ${colors.accent} !important;
        padding-bottom: 8px;
      }
      .sidebar-section p, .sidebar-section li {
        font-size: 0.9rem;
        line-height: 1.5;
        color: ${colors.textPrimary} !important;
        opacity: 0.9;
        margin-bottom: 10px;
      }
      .sidebar-section ul {
        list-style: none;
        padding: 0;
      }
      .sidebar-section li:before {
        content: "•";
        color: ${colors.accent} !important;
        font-weight: bold;
        display: inline-block;
        width: 1.2em;
      }
      .content-area {
        padding: 35px 30px;
        background: white !important;
      }
      .content-section {
        margin-bottom: 40px;
      }
      .content-section h3 {
        font-size: 1.3rem;
        font-weight: 700;
        color: ${colors.primary} !important;
        margin-bottom: 18px;
        position: relative;
        padding-bottom: 10px;
      }
      .content-section h3:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 70px;
        height: 3px;
        background: ${colors.secondary} !important;
      }
      .publication-item, .achievement-item {
        margin-bottom: 20px;
        padding-bottom: 18px;
        border-bottom: 1px solid #f3f4f6 !important;
      }
      .publication-item:last-child, .achievement-item:last-child {
        border-bottom: none !important;
      }
      .item-title {
        font-weight: 600;
        color: ${colors.textSecondary} !important;
        font-size: 1rem;
        margin-bottom: 6px;
      }
      .item-meta {
        color: #6b7280 !important;
        font-size: 0.85rem;
        font-style: italic;
      }
      .achievement-item {
        color: ${colors.textSecondary} !important;
        font-weight: 500;
        font-size: 0.95rem;
      }
      .badge {
        display: inline-block;
        padding: 4px 12px;
        background: ${colors.accent}20 !important;
        color: ${colors.primary} !important;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
      }
      @media print {
        body { 
          background: white !important; 
          padding: 0; 
        }
        .container { 
          box-shadow: none; 
          page-break-after: auto;
        }
        .cv-header, .sidebar {
          background: ${colors.primary} !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Professional Profile Export</title>
          <style>${styles}</style>
        </head>
        <body>
          <div class="container">
            <div class="cv-header">
              ${
                data.studentInfo?.imageUrl &&
                data.studentInfo.imageUrl !== "/placeholder.svg"
                  ? `<img class="profile-photo" src="${data.studentInfo.imageUrl}" alt="Profile" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'profile-photo-placeholder\\'>Photo</div>'+this.parentElement.innerHTML" />`
                  : `<div class="profile-photo-placeholder">Photo</div>`
              }
              <div class="name-section">
                <h1>${
                  data.studentInfo?.fullName?.toUpperCase() ||
                  "PROFESSIONAL NAME"
                }</h1>
                <p>${
                  userType === "student"
                    ? data.studentInfo?.major || "Student"
                    : "Academic Researcher"
                }</p>
              </div>
              <div class="contact-info">
                <div class="contact-item">Tel: ${
                  data.studentInfo?.contactNumber || "+123-456-7890"
                }</div>
                <div class="contact-item">Address: ${
                  data.studentInfo?.address || "University Address"
                }</div>
                <div class="contact-item">Email: ${
                  data.studentInfo?.email || "email@example.com"
                }</div>
                <div class="contact-item">Telegram: ${
                  data.studentInfo?.telegramId || "telegram.me/username"
                }</div>
              </div>
            </div>
            <div class="main-content">
              <div class="sidebar">
                <div class="sidebar-section">
                  <h3>ABOUT ME</h3>
                  <p>${
                    data.studentInfo?.bio ||
                    "Dedicated professional pursuing excellence with a passion for research and innovation."
                  }</p>
                </div>
                <div class="sidebar-section">
                  <h3>EDUCATION</h3>
                  <p><strong>${
                    data.studentInfo?.university || "University Name"
                  }</strong></p>
                  <p>${data.studentInfo?.major || "Field of Study"}</p>
                  <p>Year ${data.studentInfo?.yearsOfStudy || "N/A"}</p>
                </div>
                ${
                  data.studentAdviser && data.studentAdviser.length > 0
                    ? `
                  <div class="sidebar-section">
                    <h3>ADVISORS</h3>
                    ${data.studentAdviser
                      .slice(0, 2)
                      .map(
                        (adviser) =>
                          `<p><strong>${adviser.adviserName}</strong></p>`
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
              </div>
              <div class="content-area">
                ${
                  data.papers && data.papers.length > 0
                    ? `
                  <div class="content-section">
                    <h3>PUBLICATIONS</h3>
                    ${data.papers
                      .slice(0, 5)
                      .map(
                        (paper) => `
                      <div class="publication-item">
                        <div class="item-title">${paper.title}</div>
                        <div class="item-meta">${paper.categories} • ${paper.status} • ${paper.downloads} downloads</div>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
                <div class="content-section">
                  <h3>ACADEMIC ACHIEVEMENTS</h3>
                  <div class="achievement-item">✓ ${
                    data.papers ? data.papers.length : 0
                  } Published Research Papers</div>
                  <div class="achievement-item">✓ Academic Excellence Award</div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    return htmlContent;
  }, [userType]);

  // ✅ Auto-generate preview when colors or data changes - now includes generatePDFPreview
  useEffect(() => {
    if (exportData) {
      const preview = generatePDFPreview(exportData, customColors);
      setPreviewContent(preview);
    }
  }, [exportData, customColors, generatePDFPreview]);

  // Handle iframe height adjustment
  const handleIframeLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    const iframe = event.currentTarget;
    try {
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDocument) {
        setTimeout(() => {
          const body = iframeDocument.body;
          const html = iframeDocument.documentElement;
          const height = Math.max(
            body?.scrollHeight || 0,
            body?.offsetHeight || 0,
            html?.clientHeight || 0,
            html?.scrollHeight || 0,
            html?.offsetHeight || 0
          );
          const adjustedHeight = Math.max(height * 0.75 + 150, 400);
          setIframeHeight(adjustedHeight);
        }, 100);
      }
    } catch {
      console.log("Could not access iframe content for height calculation");
      setIframeHeight(900);
    }
  };

  const handleColorChange = (
    colorType: keyof typeof DEFAULT_COLORS,
    color: string
  ) => {
    setCustomColors((prev) => ({
      ...prev,
      [colorType]: color,
    }));
  };

  const resetToDefaultColors = () => {
    setCustomColors(DEFAULT_COLORS);
  };

  const exportToPDF = async (data: ExportData) => {
    try {
      // Create a temporary container for rendering
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "800px";
      tempContainer.style.overflow = "visible";

      // Create a complete HTML document with all styles inline
      const completeHTML = generatePDFPreview(data, customColors);
      tempContainer.innerHTML = completeHTML;

      // Append to body
      document.body.appendChild(tempContainer);

      // Wait for images to load
      const images = tempContainer.getElementsByTagName("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 3000);
          });
        })
      );

      // Wait for layout to fully render
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get the container element
      const container = tempContainer.querySelector(
        ".container"
      ) as HTMLElement;

      if (!container) {
        throw new Error("Container not found");
      }

      // Force all computed styles to be inline
      const applyComputedStyles = (element: HTMLElement) => {
        const computedStyle = window.getComputedStyle(element);
        Array.from(computedStyle).forEach((key) => {
          element.style.setProperty(
            key,
            computedStyle.getPropertyValue(key),
            "important"
          );
        });

        // Recursively apply to children
        Array.from(element.children).forEach((child) => {
          if (child instanceof HTMLElement) {
            applyComputedStyles(child);
          }
        });
      };

      // Apply computed styles to ensure they're captured
      applyComputedStyles(container);

      // Get the natural height
      const fullHeight = Math.max(
        container.scrollHeight,
        container.offsetHeight
      );

      console.log("Full content height:", fullHeight);

      // Capture with html2canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 800,
        height: fullHeight,
        windowWidth: 800,
        windowHeight: fullHeight,
        scrollY: 0,
        scrollX: 0,
        imageTimeout: 15000,
        removeContainer: false,
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      console.log("Image dimensions:", { imgWidth, imgHeight, pageHeight });

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png", 1.0);

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const fileName = `${
        data.studentInfo?.fullName?.replace(/\s+/g, "_") || "profile"
      }_CV_${new Date().toISOString().split("T")[0]}.pdf`;

      // Save the PDF
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const handleExport = async () => {
    if (!userProfile?.user?.uuid) {
      toast.error("Profile information not available");
      return;
    }

    if (!exportData || Object.keys(exportData).length === 0) {
      toast.info("No data selected for export");
      return;
    }

    setIsExporting(true);

    try {
      await exportToPDF(exportData);
      toast.success("Profile PDF downloaded successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export profile. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRetry = () => {
    refetchProfile();
    refetchPapers();
    refetchAdvisers();
    toast.info("Refreshing data...");
  };

  const isLoading =
    loadingProfile || loadingPapers || loadingAdvisers || loadingCategories;
  const hasAnySelectedCategories =
    Object.values(selectedCategories).some(Boolean);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-8">
          <DocuhubLoader />
        </div>
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Failed to Load Data
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading your profile data. Please try again.
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Loading Overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl">
            <DocuhubLoader />
            <p className="text-gray-700 font-medium text-lg">
              Generating your PDF...
            </p>
            <p className="text-gray-500 text-sm">
              Please wait while we prepare your professional CV
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto p-4">
        {/* Left Column - Controls */}
        <div className="bg-white rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Export Profile</h2>
            <div className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              PDF
            </div>
          </div>

          {/* Color Customization */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                <Palette className="w-4 h-4 inline mr-1" />
                Customize Colors
              </label>
              <button
                onClick={resetToDefaultColors}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
            <div className="space-y-3">
              {(
                [
                  {
                    key: "primary" as const,
                    label: "Primary Color",
                    description: "Headers and sidebar background",
                  },
                  {
                    key: "secondary" as const,
                    label: "Secondary Color",
                    description: "Accents and borders",
                  },
                  {
                    key: "accent" as const,
                    label: "Accent Color",
                    description: "Highlights and badges",
                  },
                  {
                    key: "textPrimary" as const,
                    label: "Header Text Color",
                    description: "Text on colored backgrounds",
                  },
                  {
                    key: "textSecondary" as const,
                    label: "Body Text Color",
                    description: "Main content text",
                  },
                ] as const
              ).map(({ key, label, description }) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors[key]}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                      title={`Choose ${label.toLowerCase()}`}
                    />
                    <input
                      type="text"
                      value={customColors[key]}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Category Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Search className="w-4 h-4 inline mr-1" />
              Filter by Research Category
            </label>
            <select
              value={researchCategory}
              onChange={(e) => setResearchCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23667'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.2em",
              }}
            >
              {categoryNames.map((categoryName) => (
                <option
                  key={categoryName}
                  value={categoryName}
                  className="text-sm bg-white text-gray-700"
                >
                  {categoryName === "all" ? "All Categories" : categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Data to Export
            </label>
            <div className="grid grid-cols-1 gap-3">
              {categories.map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCategories[key as keyof typeof selectedCategories]
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => handleCategoryToggle(key)}
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedCategories[key as keyof typeof selectedCategories]
                    }
                    onChange={() => handleCategoryToggle(key)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting || !hasAnySelectedCategories || !exportData}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              {isExporting ? "Generating PDF..." : "Download as PDF"}
            </button>
            <p className="text-xs text-gray-500 text-center">
              Downloads directly as a PDF file with all colors and formatting
              preserved.
            </p>
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="bg-white rounded-lg shadow-lg lg:col-span-3">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">Live Preview</h3>
            <p className="text-sm text-gray-600">Professional CV Template</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-gray-500">Colors:</span>
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: value }}
                    title={key}
                  />
                  <span className="text-xs text-gray-400">{key}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-h-[100vh] min-h-[600px]">
            {!previewContent ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <DocuhubLoader />
                  <p className="text-gray-600 mt-4">Generating preview...</p>
                </div>
              </div>
            ) : (
              <iframe
                srcDoc={previewContent}
                className="w-full border-none transform scale-75 origin-top-left"
                style={{
                  width: "133.33%",
                  height: `${iframeHeight}px`,
                  minHeight: "400px",
                }}
                title="Live Preview"
                onLoad={handleIframeLoad}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}