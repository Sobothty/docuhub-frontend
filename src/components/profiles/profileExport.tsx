"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Download,
  User,
  BookOpen,
  Users,
  Search,
  Palette,
  RotateCcw,
  AlertCircle,
  X,
  Layout,
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
  onClose?: () => void; // Add this prop
}

const DEFAULT_COLORS = {
  primary: "#2563eb",
  secondary: "#1e40af",
  accent: "#3b82f6",
  textPrimary: "#ffffff",
  textSecondary: "#1f2937",
};

export default function ProfileExport({
  userType,
  onClose,
}: ProfileExportProps) {
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
  const [selectedTemplate, setSelectedTemplate] = useState<
    "modern" | "classic" | "minimal"
  >("modern");

  const templates = [
    {
      id: "modern" as const,
      name: "Modern Professional",
      description: "Two-column layout with sidebar and colored header",
    },
    {
      id: "classic" as const,
      name: "Classic Academic",
      description: "Traditional single-column layout with elegant typography",
    },
    {
      id: "minimal" as const,
      name: "Minimal Clean",
      description: "Simple and clean design with focus on content",
    },
  ];

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

  // ✅ Modern Template (Original Design)
  const generateModernTemplate = useCallback(
    (data: ExportData, colors: typeof DEFAULT_COLORS) => {
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
    },
    [userType]
  );

  // ✅ Classic Template (Traditional Academic Layout)
  const generateClassicTemplate = useCallback(
    (data: ExportData, colors: typeof DEFAULT_COLORS) => {
      const styles = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: 'Georgia', 'Times New Roman', serif !important; 
        line-height: 1.8; 
        color: ${colors.textSecondary} !important;
        background: #f8fafc !important;
        padding: 20px;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background: white !important;
        padding: 50px 60px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }
      .cv-header {
        text-align: center;
        padding-bottom: 30px;
        border-bottom: 3px solid ${colors.primary} !important;
        margin-bottom: 40px;
      }
      .profile-photo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid ${colors.primary} !important;
        margin: 0 auto 20px;
        display: block;
      }
      .profile-photo-placeholder {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: ${colors.primary}20 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid ${colors.primary} !important;
        color: ${colors.primary} !important;
        margin: 0 auto 20px;
        font-weight: bold;
      }
      .name-section h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 10px 0;
        color: ${colors.primary} !important;
        letter-spacing: 2px;
      }
      .name-section p {
        font-size: 1.3rem;
        margin: 0;
        color: ${colors.textSecondary} !important;
        font-style: italic;
      }
      .contact-info {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 20px;
        font-size: 0.9rem;
        color: ${colors.textSecondary} !important;
        margin-top: 20px;
      }
      .contact-item {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .section {
        margin-bottom: 35px;
      }
      .section h3 {
        font-size: 1.4rem;
        font-weight: 700;
        color: ${colors.primary} !important;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid ${colors.secondary} !important;
      }
      .section p, .section li {
        font-size: 1rem;
        line-height: 1.8;
        color: ${colors.textSecondary} !important;
        margin-bottom: 12px;
      }
      .info-grid {
        display: grid;
        grid-template-columns: 150px 1fr;
        gap: 10px 20px;
        margin-bottom: 20px;
      }
      .info-label {
        font-weight: 600;
        color: ${colors.primary} !important;
      }
      .info-value {
        color: ${colors.textSecondary} !important;
      }
      .publication-item {
        margin-bottom: 25px;
        padding-left: 20px;
        border-left: 3px solid ${colors.accent} !important;
      }
      .item-title {
        font-weight: 700;
        color: ${colors.textSecondary} !important;
        font-size: 1.1rem;
        margin-bottom: 8px;
      }
      .item-meta {
        color: #6b7280 !important;
        font-size: 0.9rem;
        font-style: italic;
      }
      @media print {
        body { background: white !important; padding: 0; }
        .container { box-shadow: none; }
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
                  ? `<img class="profile-photo" src="${data.studentInfo.imageUrl}" alt="Profile" />`
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
                <div class="contact-item">${
                  data.studentInfo?.email || "email@example.com"
                }</div>
                <div class="contact-item">${
                  data.studentInfo?.contactNumber || "+123-456-7890"
                }</div>
                <div class="contact-item">${
                  data.studentInfo?.address || "University Address"
                }</div>
              </div>
            </div>
            
            ${
              data.studentInfo
                ? `
            <div class="section">
              <h3>PERSONAL INFORMATION</h3>
              <div class="info-grid">
                <div class="info-label">Full Name:</div>
                <div class="info-value">${
                  data.studentInfo.fullName || "N/A"
                }</div>
                <div class="info-label">Email:</div>
                <div class="info-value">${data.studentInfo.email || "N/A"}</div>
                <div class="info-label">Contact:</div>
                <div class="info-value">${
                  data.studentInfo.contactNumber || "N/A"
                }</div>
                <div class="info-label">Telegram:</div>
                <div class="info-value">${
                  data.studentInfo.telegramId || "N/A"
                }</div>
              </div>
              <p><strong>About:</strong> ${data.studentInfo.bio || "N/A"}</p>
            </div>
            `
                : ""
            }
            
            ${
              data.studentInfo?.university
                ? `
            <div class="section">
              <h3>EDUCATION</h3>
              <div class="info-grid">
                <div class="info-label">University:</div>
                <div class="info-value">${data.studentInfo.university}</div>
                <div class="info-label">Major:</div>
                <div class="info-value">${data.studentInfo.major || "N/A"}</div>
                <div class="info-label">Year:</div>
                <div class="info-value">${
                  data.studentInfo.yearsOfStudy || "N/A"
                }</div>
              </div>
            </div>
            `
                : ""
            }
            
            ${
              data.papers && data.papers.length > 0
                ? `
            <div class="section">
              <h3>PUBLICATIONS & RESEARCH</h3>
              ${data.papers
                .map(
                  (paper) => `
                <div class="publication-item">
                  <div class="item-title">${paper.title}</div>
                  <div class="item-meta">${paper.categories} • ${paper.status} • ${paper.downloads} downloads</div>
                  <p style="margin-top: 8px; font-size: 0.95rem;">${paper.abstract}</p>
                </div>
              `
                )
                .join("")}
            </div>
            `
                : ""
            }
            
            ${
              data.studentAdviser && data.studentAdviser.length > 0
                ? `
            <div class="section">
              <h3>ACADEMIC ADVISORS</h3>
              ${data.studentAdviser
                .map(
                  (adviser) => `
                <div class="publication-item">
                  <div class="item-title">${adviser.adviserName}</div>
                  <p>${adviser.adviserBio}</p>
                </div>
              `
                )
                .join("")}
            </div>
            `
                : ""
            }
          </div>
        </body>
      </html>
    `;

      return htmlContent;
    },
    [userType]
  );

  // ✅ Minimal Template (Clean and Simple Design)
  const generateMinimalTemplate = useCallback(
    (data: ExportData, colors: typeof DEFAULT_COLORS) => {
      const styles = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif !important; 
        line-height: 1.6; 
        color: #333 !important;
        background: #ffffff !important;
        padding: 20px;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background: white !important;
        padding: 40px;
      }
      .cv-header {
        margin-bottom: 40px;
        display: flex;
        gap: 30px;
        align-items: flex-start;
        padding-bottom: 30px;
        border-bottom: 1px solid #e5e7eb !important;
      }
      .profile-photo {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        object-fit: cover;
        flex-shrink: 0;
      }
      .profile-photo-placeholder {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        background: #f3f4f6 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9ca3af !important;
        flex-shrink: 0;
      }
      .header-content {
        flex: 1;
      }
      .name-section h1 {
        font-size: 2rem;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #111827 !important;
      }
      .name-section p {
        font-size: 1rem;
        margin: 0 0 15px 0;
        color: #6b7280 !important;
      }
      .contact-info {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        font-size: 0.85rem;
        color: #6b7280 !important;
      }
      .contact-item {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .section {
        margin-bottom: 30px;
      }
      .section h3 {
        font-size: 0.85rem;
        font-weight: 600;
        color: #6b7280 !important;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .section p {
        font-size: 0.95rem;
        line-height: 1.6;
        color: #4b5563 !important;
        margin-bottom: 10px;
      }
      .info-row {
        display: flex;
        gap: 30px;
        margin-bottom: 8px;
        font-size: 0.9rem;
      }
      .info-label {
        min-width: 120px;
        color: #6b7280 !important;
        font-weight: 500;
      }
      .info-value {
        color: #111827 !important;
      }
      .publication-item {
        margin-bottom: 20px;
      }
      .item-title {
        font-weight: 600;
        color: #111827 !important;
        font-size: 1rem;
        margin-bottom: 5px;
      }
      .item-meta {
        color: #6b7280 !important;
        font-size: 0.85rem;
        margin-bottom: 8px;
      }
      .item-description {
        color: #4b5563 !important;
        font-size: 0.9rem;
        line-height: 1.5;
      }
      @media print {
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
                  ? `<img class="profile-photo" src="${data.studentInfo.imageUrl}" alt="Profile" />`
                  : `<div class="profile-photo-placeholder">Photo</div>`
              }
              <div class="header-content">
                <div class="name-section">
                  <h1>${data.studentInfo?.fullName || "Professional Name"}</h1>
                  <p>${
                    userType === "student"
                      ? data.studentInfo?.major || "Student"
                      : "Academic Researcher"
                  }</p>
                </div>
                <div class="contact-info">
                  <div class="contact-item">${
                    data.studentInfo?.email || "email@example.com"
                  }</div>
                  <div class="contact-item">${
                    data.studentInfo?.contactNumber || "+123-456-7890"
                  }</div>
                  <div class="contact-item">${
                    data.studentInfo?.telegramId || "@username"
                  }</div>
                </div>
              </div>
            </div>
            
            ${
              data.studentInfo?.bio
                ? `
            <div class="section">
              <h3>About</h3>
              <p>${data.studentInfo.bio}</p>
            </div>
            `
                : ""
            }
            
            ${
              data.studentInfo?.university
                ? `
            <div class="section">
              <h3>Education</h3>
              <div class="info-row">
                <div class="info-label">University</div>
                <div class="info-value">${data.studentInfo.university}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Major</div>
                <div class="info-value">${data.studentInfo.major || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Year of Study</div>
                <div class="info-value">${
                  data.studentInfo.yearsOfStudy || "N/A"
                }</div>
              </div>
            </div>
            `
                : ""
            }
            
            ${
              data.papers && data.papers.length > 0
                ? `
            <div class="section">
              <h3>Publications</h3>
              ${data.papers
                .map(
                  (paper) => `
                <div class="publication-item">
                  <div class="item-title">${paper.title}</div>
                  <div class="item-meta">${paper.categories} • ${paper.status} • ${paper.downloads} downloads</div>
                  <div class="item-description">${paper.abstract}</div>
                </div>
              `
                )
                .join("")}
            </div>
            `
                : ""
            }
            
            ${
              data.studentAdviser && data.studentAdviser.length > 0
                ? `
            <div class="section">
              <h3>Advisors</h3>
              ${data.studentAdviser
                .map(
                  (adviser) => `
                <div class="publication-item">
                  <div class="item-title">${adviser.adviserName}</div>
                  <div class="item-description">${adviser.adviserBio}</div>
                </div>
              `
                )
                .join("")}
            </div>
            `
                : ""
            }
          </div>
        </body>
      </html>
    `;

      return htmlContent;
    },
    [userType]
  );

  // ✅ Template selector function
  const generatePDFPreview = useCallback(
    (
      data: ExportData,
      colors: typeof DEFAULT_COLORS,
      template: "modern" | "classic" | "minimal"
    ) => {
      switch (template) {
        case "classic":
          return generateClassicTemplate(data, colors);
        case "minimal":
          return generateMinimalTemplate(data, colors);
        case "modern":
        default:
          return generateModernTemplate(data, colors);
      }
    },
    [generateModernTemplate, generateClassicTemplate, generateMinimalTemplate]
  );

  // ✅ Auto-generate preview when colors, data, or template changes
  useEffect(() => {
    if (exportData) {
      const preview = generatePDFPreview(
        exportData,
        customColors,
        selectedTemplate
      );
      setPreviewContent(preview);
    }
  }, [exportData, customColors, selectedTemplate, generatePDFPreview]);

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
      const completeHTML = generatePDFPreview(
        data,
        customColors,
        selectedTemplate
      );
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

      // Generate filename with template name
      const templateName =
        selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1);
      const fileName = `${
        data.studentInfo?.fullName?.replace(/\s+/g, "_") || "profile"
      }_CV_${templateName}_${new Date().toISOString().split("T")[0]}.pdf`;

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-card rounded-xl shadow-2xl p-8 max-w-md mx-auto border">
          <div
            className="h-1 w-full rounded-full mb-6"
            style={{ backgroundColor: "var(--color-secondary)" }}
          />
          <div className="flex flex-col items-center gap-4">
            <DocuhubLoader />
            <p className="text-card-foreground font-semibold">
              Loading profile data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-card rounded-xl shadow-2xl p-8 max-w-md mx-auto border">
          <div
            className="h-1 w-full rounded-full mb-6"
            style={{ backgroundColor: "var(--color-secondary)" }}
          />
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-card-foreground mb-2">
                Failed to Load Data
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                There was an error loading your profile data. Please try again.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all font-semibold"
                style={{ backgroundColor: "var(--color-secondary)" }}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main container */}
      <div className="relative w-full max-w-7xl h-[90vh] bg-card rounded-xl shadow-2xl overflow-hidden border">
        {/* Modern Header */}
        <div className="relative overflow-hidden">
          {/* Top accent bar */}
          <div
            className="h-1"
            style={{ backgroundColor: "var(--color-secondary)" }}
          />

          {/* Header content */}
          <div className="p-6 bg-card border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: "var(--color-secondary)" }}
                >
                  <Download className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground">
                    Export Profile
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Customize and download your professional CV
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ backgroundColor: "var(--color-secondary)" }}
                >
                  PDF Export
                </span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area with scroll */}
        <div className="flex-1 overflow-hidden">
          <div className="h-[calc(90vh-145px)] overflow-y-auto">
            {/* Main grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
              {/* Controls Column */}
              <div className="lg:col-span-2 space-y-5">
                {/* Template Selection */}
                <div className="bg-card border rounded-xl overflow-hidden">
                  <div
                    className="h-1"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "var(--color-secondary)" }}
                      >
                        <Layout className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-card-foreground">
                        Choose Template
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedTemplate === template.id
                              ? "border-2 bg-accent/30"
                              : "border hover:bg-accent/20"
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                          style={{
                            borderColor:
                              selectedTemplate === template.id
                                ? "var(--color-secondary)"
                                : undefined,
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              checked={selectedTemplate === template.id}
                              onChange={() => setSelectedTemplate(template.id)}
                              className="mt-1 w-4 h-4 cursor-pointer"
                              style={{ accentColor: "var(--color-secondary)" }}
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-card-foreground mb-1">
                                {template.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {template.description}
                              </p>
                            </div>
                          </div>
                          {selectedTemplate === template.id && (
                            <div
                              className="absolute top-2 right-2 w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: "var(--color-secondary)",
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color Customization */}
                <div className="bg-card border rounded-xl overflow-hidden">
                  <div
                    className="h-1"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: "var(--color-secondary)" }}
                        >
                          <Palette className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-card-foreground">
                          Customize Colors
                        </h3>
                      </div>
                      <button
                        onClick={resetToDefaultColors}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-accent"
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
                          className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg border"
                        >
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-card-foreground mb-0.5">
                              {label}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={customColors[key]}
                              onChange={(e) =>
                                handleColorChange(key, e.target.value)
                              }
                              className="w-9 h-9 rounded-lg border-2 cursor-pointer hover:scale-110 transition-transform"
                              title={`Choose ${label.toLowerCase()}`}
                            />
                            <input
                              type="text"
                              value={customColors[key]}
                              onChange={(e) =>
                                handleColorChange(key, e.target.value)
                              }
                              className="w-20 px-2 py-1.5 text-xs border rounded-lg bg-card focus:ring-2 focus:ring-offset-0"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Research Category Filter */}
                <div className="bg-card border rounded-xl overflow-hidden">
                  <div
                    className="h-1"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "var(--color-secondary)" }}
                      >
                        <Search className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-card-foreground">
                        Filter Research Category
                      </h3>
                    </div>
                    <select
                      value={researchCategory}
                      onChange={(e) => setResearchCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all appearance-none cursor-pointer"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 0.75rem center",
                        backgroundSize: "1.2em",
                      }}
                    >
                      {categoryNames.map((categoryName) => (
                        <option key={categoryName} value={categoryName}>
                          {categoryName === "all"
                            ? "All Categories"
                            : categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category Selection */}
                <div className="bg-card border rounded-xl overflow-hidden">
                  <div
                    className="h-1"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-card-foreground mb-3">
                      Select Data to Export
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {categories.map(({ key, label, icon: Icon }) => (
                        <div
                          key={key}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedCategories[
                              key as keyof typeof selectedCategories
                            ]
                              ? "bg-accent border-2"
                              : "bg-card border hover:bg-accent/50"
                          }`}
                          onClick={() => handleCategoryToggle(key)}
                          style={{
                            borderColor: selectedCategories[
                              key as keyof typeof selectedCategories
                            ]
                              ? "var(--color-secondary)"
                              : undefined,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={
                              selectedCategories[
                                key as keyof typeof selectedCategories
                              ]
                            }
                            onChange={() => handleCategoryToggle(key)}
                            className="w-4 h-4 rounded focus:ring-2 focus:ring-offset-0"
                            style={{ accentColor: "var(--color-secondary)" }}
                          />
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium text-card-foreground">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Export Button */}
                <div className="space-y-3">
                  <button
                    onClick={handleExport}
                    disabled={
                      isExporting || !hasAnySelectedCategories || !exportData
                    }
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-white rounded-xl hover:opacity-90 focus:ring-4 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold"
                    style={{
                      backgroundColor: "var(--color-secondary)",
                    }}
                  >
                    <Download className="w-5 h-5" />
                    {isExporting ? "Generating PDF..." : "Download as PDF"}
                  </button>
                  <p className="text-xs text-muted-foreground text-center px-2">
                    Downloads directly as a PDF file with all colors and
                    formatting preserved.
                  </p>
                </div>
              </div>

              {/* Preview Column */}
              <div className="lg:col-span-3">
                <div className="bg-card border rounded-xl overflow-hidden h-[calc(90vh-200px)]">
                  {/* Preview Header */}
                  <div
                    className="h-1"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  />
                  <div className="p-3 border-b bg-card">
                    <h3 className="text-sm font-semibold text-card-foreground">
                      Live Preview
                    </h3>
                  </div>

                  {/* Preview Content */}
                  <div className="h-[calc(100%-49px)] w-full bg-muted overflow-hidden">
                    {!previewContent ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <DocuhubLoader />
                          <p className="text-muted-foreground mt-4 text-sm">
                            Generating preview...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        srcDoc={previewContent}
                        className="w-full h-full"
                        style={{
                          transform: "scale(0.75)",
                          transformOrigin: "top left",
                          width: "133.33%",
                          height: "133.33%",
                        }}
                        title="Live Preview"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center">
          <div className="bg-card rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl border max-w-md mx-4">
            <div
              className="h-1 w-full rounded-full"
              style={{ backgroundColor: "var(--color-secondary)" }}
            />
            <DocuhubLoader />
            <div className="text-center">
              <p className="text-card-foreground font-semibold text-lg mb-1">
                Generating your PDF...
              </p>
              <p className="text-muted-foreground text-sm">
                Please wait while we prepare your professional CV
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
