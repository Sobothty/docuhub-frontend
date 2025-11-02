import { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://docuhub.vercel.app";
const SITE_NAME = "Docuhub";
const SITE_TWITTER = "@DocuhubTeam";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  locale?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image = `${SITE_URL}/og-image.png`,
  url = SITE_URL,
  type = "website",
  publishedTime,
  modifiedTime,
  authors = [],
  locale = "en_US",
  noindex = false,
  nofollow = false,
}: SEOProps): Metadata {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - Academic Paper Management & Research Platform`;
  const fullDescription =
    description ||
    "Docuhub - Academic Paper Management System. Discover, share, and collaborate on research papers. Connect students with advisers for mentorship and academic excellence.";

  // Base keywords that should be included on every page
  const baseKeywords = [
    "academic papers",
    "research platform",
    "paper management",
    "scholarly articles",
    "academic repository",
    "research collaboration",
    "student research",
    "adviser mentorship",
    "peer review",
    "academic network",
    "Cambodia education",
    "ISTAD",
    "Khmer research",
  ];

  const allKeywords =
    keywords.length > 0 ? [...baseKeywords, ...keywords] : baseKeywords;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    authors:
      authors.length > 0
        ? authors.map((author) => ({ name: author }))
        : [{ name: "Docuhub Team - ISTAD" }],
    creator: "Docuhub Team",
    publisher: "Institute of Science and Technology Advanced Development",
    applicationName: SITE_NAME,
    category: "Education",
    classification: "Academic Research Platform",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: fullTitle,
      description: fullDescription,
      url,
      locale,
      alternateLocale: ["km_KH"],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || `${SITE_NAME} - Academic Research Platform`,
          type: "image/png",
        },
        {
          url: "https://res.cloudinary.com/diakcg1yq/image/upload/v1761063273/Screenshot_2025-10-20_234401_qbjpqq.png",
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} Platform Screenshot`,
          type: "image/png",
        },
      ],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: SITE_TWITTER,
      creator: SITE_TWITTER,
      title: fullTitle,
      description: fullDescription,
      images: [image],
    },
    alternates: {
      canonical: url,
      languages: {
        "en-US": `${SITE_URL}/en`,
        "km-KH": `${SITE_URL}/kh`,
      },
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      nocache: false,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Pre-configured metadata for common pages
export const pageSEO = {
  home: generateSEO({
    title: "Home - Academic Paper Management & Research Platform",
    description:
      "Discover and share academic research papers on Docuhub. Connect with advisers, collaborate on cutting-edge research, and access thousands of scholarly articles. Join Cambodia's leading academic research community powered by ISTAD.",
    keywords: [
      "research papers",
      "academic collaboration",
      "scholarly articles",
      "research community",
      "ISTAD Cambodia",
      "research repository",
      "paper discovery",
    ],
    url: `${SITE_URL}`,
  }),

  browse: generateSEO({
    title: "Browse Research Papers - Search Academic Database",
    description:
      "Explore thousands of academic papers across various fields including AI, Blockchain, Cloud Engineering, and more. Advanced search and filter options to discover research that matters. Find papers by category, topic, or author.",
    keywords: [
      "search research papers",
      "academic database",
      "research catalog",
      "paper discovery",
      "find research",
      "academic search",
      "research filter",
    ],
    url: `${SITE_URL}/browse`,
  }),

  about: generateSEO({
    title: "About Docuhub - Our Mission & Team",
    description:
      "Learn about Docuhub - a revolutionary academic paper management platform by ISTAD. Discover our mission to foster research collaboration, meet our team of developers and mentors, and understand how we're transforming academic research in Cambodia.",
    keywords: [
      "about docuhub",
      "ISTAD project",
      "research platform team",
      "academic innovation",
      "Cambodia education technology",
      "research technology",
    ],
    url: `${SITE_URL}/about`,
  }),

  contact: generateSEO({
    title: "Contact Docuhub - Get Help & Support",
    description:
      "Get in touch with the Docuhub team at ISTAD. We're here to help with your research management needs, answer questions, and provide support. Contact us via email or visit our office.",
    keywords: [
      "contact docuhub",
      "ISTAD contact",
      "research support",
      "academic help",
      "customer service",
    ],
    url: `${SITE_URL}/contact`,
  }),

  roadmap: generateSEO({
    title: "Project Roadmap - Paper Submission Workflow",
    description:
      "Explore the Docuhub 10-step workflow from paper submission to publication. Understand our 2-level review process, how advisers provide feedback, and how we ensure quality before publishing papers to the public repository.",
    keywords: [
      "paper workflow",
      "submission process",
      "review process",
      "adviser review",
      "publication workflow",
      "research pipeline",
    ],
    url: `${SITE_URL}/roadmap`,
  }),

  login: generateSEO({
    title: "Login to Docuhub Account",
    description:
      "Sign in to your Docuhub account to access your papers, reviews, and collaborate with the research community. Secure JWT-based authentication for students, advisers, and administrators.",
    keywords: [
      "login docuhub",
      "sign in",
      "academic account",
      "research platform login",
    ],
    url: `${SITE_URL}/login`,
    noindex: true,
  }),

  register: generateSEO({
    title: "Register for Docuhub - Join Research Community",
    description:
      "Join Docuhub today and become part of Cambodia's academic research community. Create a free account as a student, adviser, or admin to submit papers, get mentorship, and advance your research.",
    keywords: [
      "register docuhub",
      "sign up",
      "join research platform",
      "create academic account",
      "ISTAD registration",
    ],
    url: `${SITE_URL}/register`,
  }),

  studentDashboard: generateSEO({
    title: "Student Dashboard - Manage Your Research",
    description:
      "Manage your research papers, track submissions, receive feedback from advisers, and collaborate on your academic journey. Access your proposals, favorites, and mentorship resources.",
    keywords: [
      "student dashboard",
      "my research papers",
      "paper submissions",
      "student portal",
      "research management",
    ],
    url: `${SITE_URL}/student`,
    noindex: true,
  }),

  adviserDashboard: generateSEO({
    title: "Adviser Dashboard - Review & Mentor",
    description:
      "Review student papers, provide detailed feedback, mentor researchers, and manage your assigned students. Access resources, track progress, and help advance academic research.",
    keywords: [
      "adviser dashboard",
      "paper review",
      "mentorship platform",
      "feedback tools",
      "student management",
    ],
    url: `${SITE_URL}/adviser`,
    noindex: true,
  }),

  profile: generateSEO({
    title: "User Profile - Docuhub",
    description:
      "View and manage your Docuhub profile. Showcase your research papers, track your academic achievements, and connect with the research community.",
    keywords: [
      "user profile",
      "researcher profile",
      "academic profile",
      "research portfolio",
    ],
    url: `${SITE_URL}/profile`,
    noindex: true,
  }),

  directory: generateSEO({
    title: "Researcher Directory - Find Academics",
    description:
      "Browse our directory of researchers, academics, and scholars. Find experts in various fields, view their publications, and connect for collaboration.",
    keywords: [
      "researcher directory",
      "find academics",
      "scholar directory",
      "research experts",
    ],
    url: `${SITE_URL}/directory`,
  }),
};

// Helper for generating paper-specific metadata
export function generatePaperSEO({
  title,
  abstract,
  authors,
  publishedDate,
  uuid,
  categories,
  image,
  description,
}: {
  title: string;
  abstract?: string;
  authors?: string[];
  publishedDate?: string;
  uuid: string;
  categories?: string[];
  image?: string;
  description?: string;
}): Metadata {
  // Generate better description from provided description, abstract, or title
  const finalDescription = description
    ? description
    : abstract
    ? abstract.substring(0, 155) + (abstract.length > 155 ? "..." : "")
    : `Read ${title} on Docuhub. Access this research paper, download PDF, and explore related papers in our academic repository.`;

  // Combine authors and categories for better keywords
  const keywords = [
    "research paper",
    "academic article",
    "scholarly publication",
    "research publication",
    ...(categories || []),
    ...(authors || []),
  ];

  // Use custom image or default
  const ogImage = image || `${SITE_URL}/og-image.png`;

  return generateSEO({
    title: `${title} - Research Paper | Docuhub`,
    description: finalDescription,
    keywords,
    image: ogImage,
    url: `${SITE_URL}/papers/${uuid}`,
    type: "article",
    publishedTime: publishedDate,
    authors,
  });
}

// Helper for generating user profile metadata
export function generateUserSEO({
  name,
  bio,
  uuid,
  papers,
  image,
  field,
}: {
  name: string;
  bio?: string;
  uuid: string;
  papers?: number;
  image?: string;
  field?: string;
}): Metadata {
  const description = bio
    ? `${bio.substring(0, 140)}...`
    : `${name}${field ? ` - ${field}` : ""} on Docuhub${
        papers ? `. ${papers} research papers published.` : ""
      }`;

  const keywords = [
    "researcher",
    "academic profile",
    "scholar",
    name,
    ...(field ? [field] : []),
  ];

  const ogImage = image || `${SITE_URL}/og-image.png`;

  return generateSEO({
    title: `${name} - Researcher Profile | Docuhub`,
    description,
    keywords,
    image: ogImage,
    url: `${SITE_URL}/users/${uuid}`,
    type: "profile",
    authors: [name],
    noindex: false, // Allow indexing of public profiles
  });
}
