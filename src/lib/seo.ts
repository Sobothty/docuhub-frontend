import { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://docuhub.vercel.app";
const SITE_NAME = "Docuhub";

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
}: SEOProps): Metadata {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - Academic Paper Management & Research Platform`;
  const fullDescription =
    description ||
    "Docuhub - Academic Paper Management System. Discover, share, and collaborate on research papers.";

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors:
      authors.length > 0
        ? authors.map((author) => ({ name: author }))
        : undefined,
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: fullTitle,
      description: fullDescription,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [image],
      creator: "@DocuhubTeam",
    },
    alternates: {
      canonical: url,
    },
  };
}

// Pre-configured metadata for common pages
export const pageSEO = {
  home: generateSEO({
    title: "Home",
    description:
      "Discover and share academic research papers. Connect with advisers and collaborate on cutting-edge research.",
    keywords: [
      "academic papers",
      "research platform",
      "paper repository",
      "research collaboration",
    ],
  }),

  browse: generateSEO({
    title: "Browse Papers",
    description:
      "Explore thousands of academic papers across various fields. Search, filter, and discover research that matters.",
    keywords: [
      "browse papers",
      "search research",
      "academic database",
      "research papers",
    ],
    url: `${SITE_URL}/browse`,
  }),

  about: generateSEO({
    title: "About Us",
    description:
      "Learn about Docuhub - our mission to revolutionize academic paper management and foster research collaboration.",
    keywords: [
      "about docuhub",
      "academic platform",
      "research management",
      "team",
    ],
    url: `${SITE_URL}/about`,
  }),

  contact: generateSEO({
    title: "Contact Us",
    description:
      "Get in touch with the Docuhub team. We're here to help with your research management needs.",
    keywords: ["contact", "support", "help", "feedback"],
    url: `${SITE_URL}/contact`,
  }),

  roadmap: generateSEO({
    title: "Project Roadmap",
    description:
      "Explore the Docuhub workflow - from paper submission to publication. See how our platform streamlines academic research.",
    keywords: [
      "roadmap",
      "workflow",
      "process",
      "paper submission",
      "review process",
    ],
    url: `${SITE_URL}/roadmap`,
  }),

  login: generateSEO({
    title: "Login",
    description:
      "Sign in to your Docuhub account to access your papers, reviews, and collaborate with the research community.",
    keywords: ["login", "sign in", "account"],
    url: `${SITE_URL}/login`,
  }),

  register: generateSEO({
    title: "Register",
    description:
      "Join Docuhub today. Create an account to submit papers, connect with advisers, and advance your research.",
    keywords: ["register", "sign up", "create account", "join"],
    url: `${SITE_URL}/register`,
  }),

  studentDashboard: generateSEO({
    title: "Student Dashboard",
    description:
      "Manage your research papers, track submissions, and collaborate with advisers on your academic journey.",
    keywords: [
      "student dashboard",
      "my papers",
      "submissions",
      "research management",
    ],
    url: `${SITE_URL}/student`,
  }),

  adviserDashboard: generateSEO({
    title: "Adviser Dashboard",
    description:
      "Review student papers, provide feedback, and mentor the next generation of researchers.",
    keywords: ["adviser dashboard", "review papers", "mentorship", "feedback"],
    url: `${SITE_URL}/adviser`,
  }),
};

// Helper for generating paper-specific metadata
export function generatePaperSEO({
  title,
  abstract,
  authors,
  publishedDate,
  uuid,
}: {
  title: string;
  abstract?: string;
  authors?: string[];
  publishedDate?: string;
  uuid: string;
}): Metadata {
  return generateSEO({
    title,
    description: abstract?.substring(0, 160) || `Read ${title} on Docuhub`,
    keywords: ["research paper", "academic article", ...(authors || [])],
    url: `${SITE_URL}/papers/${uuid}`,
    type: "article",
    publishedTime: publishedDate,
    authors,
  });
}
