"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  User,
  BookOpen,
  Users,
  Search,
  Loader2,
  Palette,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetPapersByAuthorQuery } from "@/feature/paperSlice/papers";
import { useGetAllAdvisersQuery } from "@/feature/users/studentSlice";
import { useGetAllUsersQuery } from "@/feature/users/usersSlice";

interface ProfileExportProps {
  userType: "student" | "adviser" | "admin";
}

interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  previewImage: string; // Base64 or URL to preview image
  defaultColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  style:
    | "modern"
    | "classic"
    | "minimal"
    | "creative"
    | "corporate"
    | "academic";
  layout:
    | "single-column"
    | "two-column"
    | "sidebar"
    | "header-focus"
    | "timeline";
}

const pdfTemplates: PDFTemplate[] = [
  {
    id: "modern-blue",
    name: "Modern Professional",
    description: "Clean single-column layout perfect for academic profiles",
    thumbnail: "📄",
    previewImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="80" fill="#2563eb"/>
        <text x="100" y="35" fill="white" text-anchor="middle" font-size="16" font-weight="bold">John Doe</text>
        <text x="100" y="55" fill="white" text-anchor="middle" font-size="12">Student Profile</text>
        <rect x="20" y="100" width="160" height="30" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="30" y="120" fill="#1e40af" font-size="10" font-weight="bold">Personal Information</text>
        <rect x="20" y="140" width="160" height="40" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="30" y="155" fill="#374151" font-size="8">University: CADT</text>
        <text x="30" y="170" fill="#374151" font-size="8">Major: Computer Science</text>
        <rect x="20" y="190" width="160" height="40" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="30" y="205" fill="#1e40af" font-size="10" font-weight="bold">Publications</text>
        <text x="30" y="220" fill="#374151" font-size="8">Research Paper 1</text>
      </svg>
    `)}`,
    defaultColors: {
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#3b82f6",
    },
    style: "modern",
    layout: "single-column",
  },
  {
    id: "elegant-purple",
    name: "Executive Two-Column",
    description:
      "Sophisticated two-column design for professional presentation",
    thumbnail: "📰",
    previewImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="60" fill="#7c3aed"/>
        <text x="20" y="30" fill="white" font-size="14" font-weight="bold">John Doe</text>
        <text x="20" y="45" fill="white" font-size="10">Academic Profile</text>
        <rect x="10" y="70" width="85" height="170" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="15" y="85" fill="#5b21b6" font-size="9" font-weight="bold">Personal Info</text>
        <text x="15" y="100" fill="#374151" font-size="7">Email: john@email.com</text>
        <text x="15" y="115" fill="#374151" font-size="7">University: CADT</text>
        <text x="15" y="130" fill="#374151" font-size="7">Major: CS</text>
        <rect x="105" y="70" width="85" height="170" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="110" y="85" fill="#5b21b6" font-size="9" font-weight="bold">Publications</text>
        <text x="110" y="100" fill="#374151" font-size="7">Paper 1</text>
        <text x="110" y="115" fill="#374151" font-size="7">Paper 2</text>
      </svg>
    `)}`,
    defaultColors: {
      primary: "#7c3aed",
      secondary: "#5b21b6",
      accent: "#8b5cf6",
    },
    style: "modern",
    layout: "two-column",
  },
  {
    id: "classic-sidebar",
    name: "Academic Sidebar",
    description: "Traditional academic style with informative sidebar",
    thumbnail: "📋",
    previewImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="60" height="250" fill="#374151"/>
        <text x="30" y="30" fill="white" text-anchor="middle" font-size="10" font-weight="bold">John</text>
        <text x="30" y="45" fill="white" text-anchor="middle" font-size="10" font-weight="bold">Doe</text>
        <text x="5" y="70" fill="white" font-size="7">Email:</text>
        <text x="5" y="85" fill="white" font-size="6">john@email.com</text>
        <text x="5" y="105" fill="white" font-size="7">University:</text>
        <text x="5" y="120" fill="white" font-size="6">CADT</text>
        <rect x="70" y="10" width="120" height="230" fill="white" stroke="#e2e8f0"/>
        <rect x="75" y="20" width="110" height="2" fill="#374151"/>
        <text x="80" y="40" fill="#374151" font-size="10" font-weight="bold">Publications</text>
        <text x="80" y="60" fill="#1f2937" font-size="8">Research Paper 1</text>
        <text x="80" y="75" fill="#6b7280" font-size="7">Computer Science</text>
        <text x="80" y="95" fill="#1f2937" font-size="8">Research Paper 2</text>
      </svg>
    `)}`,
    defaultColors: {
      primary: "#374151",
      secondary: "#1f2937",
      accent: "#6b7280",
    },
    style: "academic",
    layout: "sidebar",
  },
  {
    id: "minimal-focus",
    name: "Minimal Header Focus",
    description: "Clean minimal design with prominent header section",
    thumbnail: "🗒️",
    previewImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="100" fill="#059669"/>
        <polygon points="90,100 110,100 100,110" fill="#059669"/>
        <text x="100" y="40" fill="white" text-anchor="middle" font-size="18" font-weight="300">John Doe</text>
        <text x="100" y="65" fill="white" text-anchor="middle" font-size="12">Academic Profile</text>
        <text x="100" y="140" fill="#047857" text-anchor="middle" font-size="12" font-weight="bold">Personal Information</text>
        <rect x="75" y="150" width="50" height="2" fill="#10b981"/>
        <rect x="50" y="170" width="100" height="25" fill="#f0fdf4" stroke="#bbf7d0"/>
        <text x="100" y="185" fill="#065f46" text-anchor="middle" font-size="8">University: CADT</text>
        <text x="100" y="210" fill="#047857" text-anchor="middle" font-size="12" font-weight="bold">Publications</text>
        <rect x="75" y="220" width="50" height="2" fill="#10b981"/>
      </svg>
    `)}`,
    defaultColors: {
      primary: "#059669",
      secondary: "#047857",
      accent: "#10b981",
    },
    style: "minimal",
    layout: "header-focus",
  },
  {
    id: "creative-timeline",
    name: "Creative Timeline",
    description: "Dynamic timeline layout showcasing academic journey",
    thumbnail: "📊",
    previewImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="60" fill="#ea580c"/>
        <text x="20" y="30" fill="white" font-size="16" font-weight="600">John Doe</text>
        <text x="20" y="45" fill="white" font-size="10">Academic Journey</text>
        <line x1="40" y1="70" x2="40" y2="240" stroke="#ea580c" stroke-width="2"/>
        <rect x="50" y="80" width="140" height="40" fill="white" stroke="#e2e8f0" rx="5"/>
        <circle cx="40" cy="100" r="6" fill="#f97316" stroke="white" stroke-width="2"/>
        <text x="55" y="95" fill="#c2410c" font-size="9" font-weight="bold">Personal Info</text>
        <text x="55" y="110" fill="#374151" font-size="7">University: CADT</text>
        <rect x="50" y="140" width="140" height="40" fill="white" stroke="#e2e8f0" rx="5"/>
        <circle cx="40" cy="160" r="6" fill="#f97316" stroke="white" stroke-width="2"/>
        <text x="55" y="155" fill="#c2410c" font-size="9" font-weight="bold">Publications</text>
        <text x="55" y="170" fill="#374151" font-size="7">Research Papers</text>
      </svg>
    `)}`,
    defaultColors: {
      primary: "#ea580c",
      secondary: "#c2410c",
      accent: "#f97316",
    },
    style: "creative",
    layout: "timeline",
  },
  {
    id: "corporate-navy",
    name: "Corporate Professional",
    description: "Professional corporate design for formal presentations",
    thumbnail: "💼",
    previewImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="50" fill="#1e3a8a"/>
        <text x="20" y="25" fill="white" font-size="14" font-weight="700">John Doe</text>
        <text x="20" y="40" fill="white" font-size="9">Professional Profile</text>
        <rect x="10" y="60" width="85" height="180" fill="white" stroke="#e5e7eb"/>
        <rect x="15" y="70" width="75" height="20" fill="#1e40af" rx="3"/>
        <text x="52" y="82" fill="white" text-anchor="middle" font-size="8" font-weight="600">Personal</text>
        <text x="20" y="105" fill="#374151" font-size="7">Email: john@email.com</text>
        <text x="20" y="120" fill="#374151" font-size="7">Phone: +123456789</text>
        <rect x="105" y="60" width="85" height="180" fill="white" stroke="#e5e7eb"/>
        <rect x="110" y="70" width="75" height="20" fill="#1e40af" rx="3"/>
        <text x="147" y="82" fill="white" text-anchor="middle" font-size="8" font-weight="600">Academic</text>
        <text x="115" y="105" fill="#374151" font-size="7">University: CADT</text>
        <text x="115" y="120" fill="#374151" font-size="7">Major: Computer Science</text>
      </svg>
    `)}`,
    defaultColors: {
      primary: "#1e3a8a",
      secondary: "#1e40af",
      accent: "#3b82f6",
    },
    style: "corporate",
    layout: "two-column",
  },
  {
    id: "tech-modern",
    name: "Tech Modern",
    description: "Modern tech-inspired design with clean aesthetics",
    thumbnail: "💻",
    previewImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="70" height="250" fill="#0891b2"/>
        <text x="35" y="40" fill="white" text-anchor="middle" font-size="12" font-weight="700">John Doe</text>
        <rect x="10" y="60" width="50" height="1" fill="#06b6d4"/>
        <text x="15" y="85" fill="white" font-size="8" font-weight="600">CONTACT</text>
        <text x="15" y="100" fill="white" font-size="6">john@email.com</text>
        <text x="15" y="115" fill="white" font-size="6">+123456789</text>
        <text x="15" y="140" fill="white" font-size="8" font-weight="600">EDUCATION</text>
        <text x="15" y="155" fill="white" font-size="6">CADT University</text>
        <rect x="80" y="10" width="110" height="230" fill="white"/>
        <rect x="85" y="20" width="100" height="30" fill="#f0f9ff" stroke="#0e7490"/>
        <text x="135" y="32" fill="#0e7490" text-anchor="middle" font-size="10" font-weight="600">PROFILE</text>
        <text x="90" y="45" fill="#374151" font-size="7">Computer Science Student</text>
        <rect x="85" y="65" width="100" height="2" fill="#0891b2"/>
        <text x="90" y="80" fill="#0e7490" font-size="9" font-weight="600">PUBLICATIONS</text>
        <text x="90" y="95" fill="#374151" font-size="7">Research Paper 1</text>
        <text x="90" y="110" fill="#374151" font-size="7">Research Paper 2</text>
      </svg>
    `)}`,
    defaultColors: {
      primary: "#0891b2",
      secondary: "#0e7490",
      accent: "#06b6d4",
    },
    style: "modern",
    layout: "sidebar",
  },
  {
    id: "academic-red",
    name: "Academic Excellence",
    description: "Academic-focused design emphasizing achievements",
    thumbnail: "🎓",
    previewImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="60" fill="#dc2626"/>
        <text x="20" y="30" fill="white" font-size="16" font-weight="600">John Doe</text>
        <text x="20" y="45" fill="white" font-size="10">Academic Excellence Profile</text>
        <line x1="30" y1="70" x2="30" y2="240" stroke="#dc2626" stroke-width="3"/>
        <rect x="45" y="80" width="145" height="35" fill="white" stroke="#fecaca" rx="8" stroke-width="2"/>
        <circle cx="30" cy="97" r="8" fill="#ef4444" stroke="white" stroke-width="3"/>
        <text x="50" y="92" fill="#b91c1c" font-size="10" font-weight="bold">Education</text>
        <text x="50" y="105" fill="#374151" font-size="8">CADT - Computer Science</text>
        <rect x="45" y="130" width="145" height="35" fill="white" stroke="#fecaca" rx="8" stroke-width="2"/>
        <circle cx="30" cy="147" r="8" fill="#ef4444" stroke="white" stroke-width="3"/>
        <text x="50" y="142" fill="#b91c1c" font-size="10" font-weight="bold">Research</text>
        <text x="50" y="155" fill="#374151" font-size="8">Published Papers</text>
        <rect x="45" y="180" width="145" height="35" fill="white" stroke="#fecaca" rx="8" stroke-width="2"/>
        <circle cx="30" cy="197" r="8" fill="#ef4444" stroke="white" stroke-width="3"/>
        <text x="50" y="192" fill="#b91c1c" font-size="10" font-weight="bold">Achievements</text>
        <text x="50" y="205" fill="#374151" font-size="8">Academic Awards</text>
      </svg>
    `)}`,
    defaultColors: {
      primary: "#dc2626",
      secondary: "#b91c1c",
      accent: "#ef4444",
    },
    style: "academic",
    layout: "timeline",
  },
  {
    id: "professional-cv",
    name: "Professional CV Layout",
    description: "Modern professional CV with photo and contact section",
    thumbnail: "👔",
    previewImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
        <!-- Header Section -->
        <rect width="200" height="50" fill="#1f2937"/>
        <rect width="200" height="30" y="50" fill="#3b82f6"/>
        
        <!-- Profile Photo -->
        <circle cx="40" cy="65" r="15" fill="#e5e7eb" stroke="white" stroke-width="2"/>
        <text x="40" y="70" fill="#6b7280" text-anchor="middle" font-size="8">Photo</text>
        
        <!-- Name and Title -->
        <text x="70" y="45" fill="white" font-size="14" font-weight="bold">JOHN DOE</text>
        <text x="70" y="75" fill="white" font-size="10">Marketing Manager</text>
        
        <!-- Contact Info Icons -->
        <text x="120" y="35" fill="white" font-size="7">📞 +123-456-7890</text>
        <text x="120" y="50" fill="white" font-size="7">✉️ john@email.com</text>
        <text x="120" y="65" fill="white" font-size="7">📍 123 Street, City</text>
        <text x="120" y="80" fill="white" font-size="7">🌐 portfolio.com</text>
        
        <!-- Main Content Area -->
        <rect x="10" y="90" width="80" height="150" fill="#374151"/>
        <rect x="100" y="90" width="90" height="150" fill="white" stroke="#e5e7eb"/>
        
        <!-- Left Sidebar -->
        <text x="15" y="110" fill="white" font-size="10" font-weight="bold">ABOUT ME</text>
        <text x="15" y="125" fill="#d1d5db" font-size="6">Student at CADT University</text>
        <text x="15" y="135" fill="#d1d5db" font-size="6">pursuing Computer Science</text>
        <text x="15" y="145" fill="#d1d5db" font-size="6">with passion for research</text>
        
        <text x="15" y="165" fill="white" font-size="10" font-weight="bold">SKILLS</text>
        <text x="15" y="180" fill="#d1d5db" font-size="6">• Research</text>
        <text x="15" y="190" fill="#d1d5db" font-size="6">• Academic Writing</text>
        <text x="15" y="200" fill="#d1d5db" font-size="6">• Data Analysis</text>
        
        <text x="15" y="220" fill="white" font-size="10" font-weight="bold">EDUCATION</text>
        <text x="15" y="235" fill="#d1d5db" font-size="6">CADT University</text>
        
        <!-- Right Content -->
        <text x="105" y="110" fill="#1f2937" font-size="10" font-weight="bold">PUBLICATIONS</text>
        <rect x="105" y="115" width="80" height="1" fill="#3b82f6"/>
        <text x="105" y="130" fill="#374151" font-size="7">Research Paper on AI</text>
        <text x="105" y="140" fill="#6b7280" font-size="6">Computer Science • 2024</text>
        
        <text x="105" y="160" fill="#374151" font-size="7">Machine Learning Study</text>
        <text x="105" y="170" fill="#6b7280" font-size="6">Data Science • 2023</text>
        
        <text x="105" y="190" fill="#1f2937" font-size="10" font-weight="bold">ACHIEVEMENTS</text>
        <rect x="105" y="195" width="80" height="1" fill="#3b82f6"/>
        <text x="105" y="210" fill="#374151" font-size="7">Dean's List 2023</text>
        <text x="105" y="220" fill="#374151" font-size="7">Best Research Award</text>
        <text x="105" y="230" fill="#374151" font-size="7">Academic Excellence</text>
      </svg>
    `)}`,
    defaultColors: {
      primary: "#1f2937",
      secondary: "#3b82f6",
      accent: "#60a5fa",
    },
    style: "corporate",
    layout: "sidebar",
  },
];

export default function ProfileExport({ userType }: ProfileExportProps) {
  // Use existing queries
  const { data: userProfile, isLoading: loadingProfile } =
    useGetUserProfileQuery();
  const { data: papersData, isLoading: loadingPapers } =
    useGetPapersByAuthorQuery({
      page: 0,
      size: 100, // Get more papers for export
    });
  const { data: advisers = [], isLoading: loadingAdvisers } =
    useGetAllAdvisersQuery();
  const { data: allUsers = [], isLoading: loadingUsers } =
    useGetAllUsersQuery();

  const [selectedCategories, setSelectedCategories] = useState({
    papers: true,
    studentAdviser: true,
    studentInfo: true,
    researchTitles: true,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [researchCategory, setResearchCategory] = useState("all");

  // New state for popup and template selection
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PDFTemplate>(
    pdfTemplates[0]
  );
  const [previewContent, setPreviewContent] = useState<string>("");
  const [customColors, setCustomColors] = useState({
    primary: pdfTemplates[0].defaultColors.primary,
    secondary: pdfTemplates[0].defaultColors.secondary,
    accent: pdfTemplates[0].defaultColors.accent,
  });

  const categories = [
    { key: "papers", label: "Papers & Publications", icon: BookOpen },
    { key: "studentAdviser", label: "Adviser Relations", icon: Users },
    { key: "studentInfo", label: "Student Information", icon: User },
    { key: "researchTitles", label: "Research Titles", icon: BookOpen },
  ];

  const researchCategories = [
    "all",
    "Computer Science",
    "Engineering",
    "Mathematics",
    "Physics",
    "Biology",
    "Chemistry",
    "Literature",
    "Other",
  ];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev],
    }));
  };

  const prepareExportData = () => {
    const data: any = {};

    // Student Info
    if (selectedCategories.studentInfo && userProfile) {
      data.studentInfo = {
        uuid: userProfile.user.uuid,
        fullName: userProfile.user.fullName || "N/A",
        email: userProfile.user.email || "N/A",
        username: userProfile.user.userName || "N/A",
        gender: userProfile.user.gender || "N/A",
        bio: userProfile.user.bio || "N/A",
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

    // Adviser Relations (mock data based on advisers)
    if (selectedCategories.studentAdviser && advisers.length > 0) {
      data.studentAdviser = advisers.slice(0, 3).map((adviser, index) => ({
        adviserId: adviser.uuid,
        adviserName: adviser.fullName,
        adviserBio: adviser.bio || "No bio available",
        relationship: "Student-Adviser",
        status: adviser.status || "Active",
        startDate: new Date(adviser.createDate).toLocaleDateString(),
        researchArea: "Research collaboration",
      }));
    }

    // Research Titles (extracted from papers)
    if (selectedCategories.researchTitles && papersData?.papers?.content) {
      const uniqueCategories = Array.from(
        new Set(
          papersData.papers.content.flatMap((paper) => paper.categoryNames)
        )
      );

      data.researchTitles = papersData.papers.content.map((paper) => ({
        title: paper.title,
        category: paper.categoryNames.join(", "),
        status: paper.status,
        submittedDate: paper.submittedAt,
      }));
    }

    return data;
  };

  const generatePDFPreview = (
    data: any,
    template: PDFTemplate,
    colors: any
  ) => {
    const { layout } = template;

    // Base styles without hardcoded colors
    const baseStyles = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        line-height: 1.6; 
        color: #333;
        background: #f8fafc;
        padding: 20px;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }
      .badge {
        display: inline-block;
        padding: 4px 12px;
        background: ${colors.accent}20;
        color: ${colors.primary};
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
      }
      .section-title {
        color: ${colors.primary};
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .info-label {
        font-weight: 600;
        color: ${colors.secondary};
        font-size: 0.9rem;
        margin-bottom: 5px;
      }
      .info-value {
        color: #1e293b;
        font-size: 1rem;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      }
      .table th {
        background: ${colors.primary};
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: 600;
      }
      .table td {
        padding: 10px 12px;
        border-bottom: 1px solid #e2e8f0;
        background: white;
      }
      .table tr:nth-child(even) td {
        background: #f8fafc;
      }
      @media print {
        body { background: white; padding: 0; }
        .container { box-shadow: none; }
      }
    `;

    let layoutStyles = "";

    switch (layout) {
      case "single-column":
        layoutStyles = `
          .header {
            background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
          .header p { font-size: 1.1rem; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .section { margin-bottom: 40px; }
          .section-header {
            background: ${colors.accent}15;
            padding: 20px;
            border-left: 4px solid ${colors.primary};
            margin-bottom: 20px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }
          .info-item {
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
        `;
        break;

      case "two-column":
        layoutStyles = `
          .header {
            background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
            color: white;
            padding: 30px;
            text-align: left;
          }
          .header h1 { font-size: 2.2rem; font-weight: 700; margin-bottom: 5px; }
          .header p { font-size: 1rem; opacity: 0.9; }
          .content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            padding: 30px;
          }
          .section { margin-bottom: 30px; }
          .section-header {
            background: ${colors.primary};
            color: white;
            padding: 10px 15px;
            margin-bottom: 15px;
            border-radius: 5px;
          }
          .info-item {
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .info-item:last-child { border-bottom: none; }
        `;
        break;

      case "sidebar":
        layoutStyles = `
          .container { display: grid; grid-template-columns: 250px 1fr; }
          .sidebar {
            background: ${colors.primary};
            color: white;
            padding: 30px 20px;
          }
          .sidebar h1 { font-size: 1.8rem; font-weight: 700; margin-bottom: 20px; }
          .sidebar .info-item {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid ${colors.accent}50;
          }
          .sidebar .info-item:last-child { border-bottom: none; }
          .main-content { padding: 30px; }
          .section { margin-bottom: 30px; }
          .section-header {
            border-bottom: 2px solid ${colors.primary};
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
        `;
        break;

      case "header-focus":
        layoutStyles = `
          .header {
            background: ${colors.primary};
            color: white;
            padding: 60px 30px;
            text-align: center;
            position: relative;
          }
          .header::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-top: 20px solid ${colors.primary};
          }
          .header h1 { font-size: 3rem; font-weight: 300; margin-bottom: 10px; }
          .header p { font-size: 1.2rem; opacity: 0.9; }
          .content { padding: 50px 30px 30px; }
          .section { margin-bottom: 40px; }
          .section-header {
            text-align: center;
            margin-bottom: 30px;
            position: relative;
          }
          .section-header::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 2px;
            background: ${colors.accent};
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
        `;
        break;

      case "timeline":
        layoutStyles = `
          .header {
            background: linear-gradient(45deg, ${colors.primary}, ${colors.accent});
            color: white;
            padding: 40px 30px;
            text-align: left;
          }
          .header h1 { font-size: 2.5rem; font-weight: 600; margin-bottom: 10px; }
          .content { padding: 40px 30px; }
          .timeline {
            position: relative;
            padding-left: 30px;
          }
          .timeline::before {
            content: '';
            position: absolute;
            left: 15px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: ${colors.primary};
          }
          .timeline-item {
            position: relative;
            margin-bottom: 30px;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .timeline-item::before {
            content: '';
            position: absolute;
            left: -37px;
            top: 25px;
            width: 12px;
            height: 12px;
            background: ${colors.accent};
            border-radius: 50%;
            border: 3px solid white;
          }
          .section { margin-bottom: 20px; }
        `;
        break;
    }

    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Profile Export - ${template.name}</title>
          <style>
            ${baseStyles}
            ${layoutStyles}
          </style>
        </head>
        <body>
          <div class="container">
    `;

    // Generate content based on layout
    if (layout === "sidebar") {
      if (template.id === "professional-cv") {
        htmlContent += `
        <div class="cv-header">
          <div class="profile-photo">Photo</div>
          <div class="name-section">
            <h1>${
              data.studentInfo?.fullName?.toUpperCase() || "STUDENT NAME"
            }</h1>
            <p>Computer Science Student</p>
          </div>
          <div class="contact-info">
            <div class="contact-item">📞 ${
              data.studentInfo?.contactNumber || "+123-456-7890"
            }</div>
            <div class="contact-item">📍 ${
              data.studentInfo?.address || "University Address"
            }</div>
            <div class="contact-item">✉️ ${
              data.studentInfo?.email || "student@email.com"
            }</div>
            <div class="contact-item">🌐 ${
              data.studentInfo?.telegramId || "portfolio.com"
            }</div>
          </div>
        </div>
        <div class="main-content">
          <div class="sidebar">
            <div class="sidebar-section">
              <h3>ABOUT ME</h3>
              <p>${
                data.studentInfo?.bio ||
                "Dedicated student pursuing excellence in computer science with a passion for research and innovation."
              }</p>
            </div>
            <div class="sidebar-section">
              <h3>EDUCATION</h3>
              <p><strong>${
                data.studentInfo?.university || "University Name"
              }</strong></p>
              <p>${data.studentInfo?.major || "Computer Science"}</p>
              <p>Year ${data.studentInfo?.yearsOfStudy || "4"}</p>
            </div>
            <div class="sidebar-section">
              <h3>SKILLS</h3>
              <ul>
                <li>Academic Research</li>
                <li>Scientific Writing</li>
                <li>Data Analysis</li>
                <li>Critical Thinking</li>
                <li>Project Management</li>
              </ul>
            </div>
            ${
              data.studentAdviser && data.studentAdviser.length > 0
                ? `
              <div class="sidebar-section">
                <h3>ADVISORS</h3>
                ${data.studentAdviser
                  .slice(0, 2)
                  .map(
                    (adviser: any) => `
                  <p><strong>${adviser.adviserName}</strong></p>
                `
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
                  .slice(0, 4)
                  .map(
                    (paper: any) => `
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
              <div class="achievement-item">Dean's List Recognition</div>
              <div class="achievement-item">Outstanding Research Performance</div>
              <div class="achievement-item">Academic Excellence Award</div>
              ${
                data.papers && data.papers.length > 0
                  ? `
                <div class="achievement-item">${data.papers.length} Published Research Papers</div>
              `
                  : ""
              }
            </div>
            ${
              data.researchTitles && data.researchTitles.length > 0
                ? `
              <div class="content-section">
                <h3>RESEARCH AREAS</h3>
                ${data.researchTitles
                  .slice(0, 3)
                  .map(
                    (research: any) => `
                  <div class="publication-item">
                    <div class="item-title">${research.title}</div>
                    <div class="item-meta">${research.category} • ${research.status}</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </div>
        </div>
      `;
      } else {
        htmlContent += `
        <div class="sidebar">
          <h1>${data.studentInfo?.fullName || "Student Profile"}</h1>
          ${
            data.studentInfo
              ? `
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">${data.studentInfo.email}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Contact</div>
              <div class="info-value">${data.studentInfo.contactNumber}</div>
            </div>
            <div class="info-item">
              <div class="info-label">University</div>
              <div class="info-value">${data.studentInfo.university}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Major</div>
              <div class="info-value">${data.studentInfo.major}</div>
            </div>
          `
              : ""
          }
        </div>
        <div class="main-content">
      `;
      }
    } else if (layout === "two-column") {
      htmlContent += `
        <div class="header">
          <h1>${data.studentInfo?.fullName || "Student Profile"}</h1>
          <p>Academic & Professional Summary</p>
        </div>
        <div class="content">
          <div class="left-column">
      `;
    } else {
      htmlContent += `
        <div class="header">
          <h1>${data.studentInfo?.fullName || "Student Profile"}</h1>
          <p>Academic & Professional Summary</p>
        </div>
        <div class="content">
      `;
    }

    // Add sections based on layout
    if (layout === "timeline") {
      htmlContent += `<div class="timeline">`;

      if (data.studentInfo) {
        htmlContent += `
          <div class="timeline-item">
            <h3 class="section-title">👤 Personal Information</h3>
            <div class="info-grid">
              <div><strong>University:</strong> ${data.studentInfo.university}</div>
              <div><strong>Major:</strong> ${data.studentInfo.major}</div>
              <div><strong>Years of Study:</strong> ${data.studentInfo.yearsOfStudy}</div>
            </div>
          </div>
        `;
      }

      if (data.papers && data.papers.length > 0) {
        htmlContent += `
          <div class="timeline-item">
            <h3 class="section-title">📚 Publications</h3>
            ${data.papers
              .slice(0, 3)
              .map(
                (paper: any) => `
              <div style="margin-bottom: 10px;">
                <strong>${paper.title}</strong><br>
                <span class="badge">${paper.categories}</span>
                <small style="color: #666;"> - ${paper.status}</small>
              </div>
            `
              )
              .join("")}
          </div>
        `;
      }

      htmlContent += `</div>`;
    } else if (layout === "two-column") {
      // Left column
      if (data.studentInfo) {
        htmlContent += `
          <div class="section">
            <div class="section-header">
              <h3 class="section-title">Personal Info</h3>
            </div>
            <div class="info-item">
              <div class="info-label">University</div>
              <div class="info-value">${data.studentInfo.university}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Major</div>
              <div class="info-value">${data.studentInfo.major}</div>
            </div>
          </div>
        `;
      }

      htmlContent += `
        </div>
        <div class="right-column">
      `;

      // Right column
      if (data.papers && data.papers.length > 0) {
        htmlContent += `
          <div class="section">
            <div class="section-header">
              <h3 class="section-title">Publications</h3>
            </div>
            ${data.papers
              .slice(0, 2)
              .map(
                (paper: any) => `
              <div class="info-item">
                <strong>${paper.title}</strong><br>
                <span class="badge">${paper.categories}</span>
              </div>
            `
              )
              .join("")}
          </div>
        `;
      }

      htmlContent += `</div>`;
    } else {
      // Standard sections for other layouts
      if (data.studentInfo) {
        htmlContent += `
          <div class="section">
            <div class="section-header">
              <h2 class="section-title">👤 Personal Information</h2>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Full Name</div>
                <div class="info-value">${data.studentInfo.fullName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">University</div>
                <div class="info-value">${data.studentInfo.university}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Major</div>
                <div class="info-value">${data.studentInfo.major}</div>
              </div>
            </div>
          </div>
        `;
      }

      if (data.papers && data.papers.length > 0) {
        htmlContent += `
          <div class="section">
            <div class="section-header">
              <h2 class="section-title">📚 Publications</h2>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${data.papers
                  .slice(0, 3)
                  .map(
                    (paper: any) => `
                  <tr>
                    <td><strong>${paper.title}</strong></td>
                    <td><span class="badge">${paper.categories}</span></td>
                    <td>${paper.status}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `;
      }
    }

    htmlContent += `
        </div>
      </div>
    </body>
    </html>
    `;

    return htmlContent;
  };

  // Auto-generate preview when template, colors, or data changes
  useEffect(() => {
    if (userProfile?.user?.uuid) {
      const data = prepareExportData();
      const preview = generatePDFPreview(data, selectedTemplate, customColors);
      setPreviewContent(preview);
    }
  }, [
    selectedTemplate,
    customColors,
    selectedCategories,
    researchCategory,
    userProfile,
    papersData,
    advisers,
  ]);

  const handleTemplateChange = (template: PDFTemplate) => {
    setSelectedTemplate(template);
    // Update colors to template's default colors
    setCustomColors(template.defaultColors);
  };

  const handleColorChange = (
    colorType: "primary" | "secondary" | "accent",
    color: string
  ) => {
    setCustomColors((prev) => ({
      ...prev,
      [colorType]: color,
    }));
  };

  const resetToDefaultColors = () => {
    setCustomColors(selectedTemplate.defaultColors);
  };

  const exportToPDF = async (data: any) => {
    const htmlContent = generatePDFPreview(
      data,
      selectedTemplate,
      customColors
    );
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Unable to open print window");
      return;
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToJSON = (data: any) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      studentProfile: data,
      exportSettings: {
        categories: selectedCategories,
        researchCategory,
        format: "json",
        template: selectedTemplate.id,
      },
    };

    const jsonData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student-profile-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = (data: any) => {
    let csvContent = `Student Profile Export\nGenerated: ${new Date().toLocaleString()}\nTemplate: ${
      selectedTemplate.name
    }\n\n`;

    // Student Info
    if (data.studentInfo) {
      csvContent += `STUDENT INFORMATION\n`;
      Object.entries(data.studentInfo).forEach(([key, value]) => {
        csvContent += `${key.replace(/([A-Z])/g, " $1").trim()},${
          typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
        }\n`;
      });
      csvContent += "\n";
    }

    // Papers
    if (data.papers && data.papers.length > 0) {
      csvContent += `PAPERS & PUBLICATIONS\n`;
      csvContent += `Title,Categories,Status,Published Date,Downloads,Approved\n`;
      data.papers.forEach((paper: any) => {
        csvContent += `"${paper.title}","${paper.categories}","${paper.status}","${paper.publishedAt}",${paper.downloads},"${paper.isApproved}"\n`;
      });
      csvContent += "\n";
    }

    // Adviser Relations
    if (data.studentAdviser && data.studentAdviser.length > 0) {
      csvContent += `ADVISER RELATIONS\n`;
      csvContent += `Adviser Name,Relationship,Status,Start Date\n`;
      data.studentAdviser.forEach((relation: any) => {
        csvContent += `"${relation.adviserName}","${relation.relationship}","${relation.status}","${relation.startDate}"\n`;
      });
      csvContent += "\n";
    }

    // Research Titles
    if (data.researchTitles && data.researchTitles.length > 0) {
      csvContent += `RESEARCH TITLES\n`;
      csvContent += `Title,Category,Status,Submitted Date\n`;
      data.researchTitles.forEach((research: any) => {
        csvContent += `"${research.title}","${research.category}","${
          research.status
        }","${new Date(research.submittedDate).toLocaleDateString()}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student-profile-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (!userProfile?.user?.uuid) {
      toast.error("Student information not available");
      return;
    }

    setIsExporting(true);

    try {
      const data = prepareExportData();

      if (Object.keys(data).length === 0) {
        toast.info("No data selected for export");
        return;
      }

      await exportToPDF(data);
      setShowPreviewModal(false);
      toast.success("Profile exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export profile");
    } finally {
      setIsExporting(false);
    }
  };

  const isLoading =
    loadingProfile || loadingPapers || loadingAdvisers || loadingUsers;
  const hasAnySelectedCategories =
    Object.values(selectedCategories).some(Boolean);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Loading export data...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Export Student Profile
            </h2>
            <div className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              PDF Only
            </div>
          </div>

          {/* Template Selection with Preview Images */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              <Palette className="w-5 h-5 inline mr-2" />
              Choose Your Template Design
            </label>
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pr-2">
              {pdfTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateChange(template)}
                  className={`relative cursor-pointer p-4 border-2 rounded-xl transition-all hover:shadow-lg ${
                    selectedTemplate.id === template.id
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {selectedTemplate.id === template.id && (
                    <CheckCircle className="absolute top-3 right-3 w-6 h-6 text-blue-500 bg-white rounded-full" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Preview Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={template.previewImage}
                        alt={`${template.name} preview`}
                        className="w-20 h-25 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>

                    {/* Template Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{template.thumbnail}</span>
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {template.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {template.description}
                      </p>

                      {/* Style Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {template.style}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {template.layout.replace("-", " ")}
                        </span>
                      </div>

                      {/* Color Preview */}
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-gray-500">Colors:</span>
                        {Object.values(template.defaultColors).map(
                          (color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: color }}
                              title={Object.keys(template.defaultColors)[index]}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Picker */}
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
                    description: "Headers and main elements",
                  },
                  {
                    key: "secondary" as const,
                    label: "Secondary Color",
                    description: "Labels and secondary text",
                  },
                  {
                    key: "accent" as const,
                    label: "Accent Color",
                    description: "Highlights and badges",
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
                      value={customColors[key as keyof typeof customColors]}
                      onChange={(e) =>
                        handleColorChange(
                          key as keyof typeof customColors,
                          e.target.value
                        )
                      }
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                      title={`Choose ${label.toLowerCase()}`}
                    />
                    <input
                      type="text"
                      value={customColors[key as keyof typeof customColors]}
                      onChange={(e) =>
                        handleColorChange(
                          key as keyof typeof customColors,
                          e.target.value
                        )
                      }
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {researchCategories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
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
          <div className="flex justify-end">
            <button
              onClick={handleExport}
              disabled={isExporting || !hasAnySelectedCategories}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              {isExporting ? "Exporting PDF..." : "Export as PDF"}
            </button>
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">Live Preview</h3>
            <p className="text-sm text-gray-600">
              Template: {selectedTemplate.name}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500">Colors:</span>
              <div className="flex gap-1">
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: customColors.primary }}
                  title="Primary"
                />
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: customColors.secondary }}
                  title="Secondary"
                />
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: customColors.accent }}
                  title="Accent"
                />
              </div>
            </div>
          </div>

          <div className="h-[600px] overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading preview...</p>
                </div>
              </div>
            ) : (
              <iframe
                srcDoc={previewContent}
                className="w-full h-full border-none transform scale-75 origin-top-left"
                style={{ width: "133.33%", height: "133.33%" }}
                title="Live Preview"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
