import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavbarWrapper from "@/components/header/NavbarWrapper";
import StickyBanner from "@/components/header/StickyBanner";
import ContactFooter from "@/components/footer/ContactFooter";
import { Providers } from "./providers";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { LoadingBar } from "@/components/ui/LoadingBar";
import { OfflineIndicator } from "@/components/page/offline-indicatior";
import { ToastContainer } from "react-toastify";

// English: Poppins
const poppins = Poppins({
  variable: "--font-english",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const kantumroyPro = localFont({
  src: [
    {
      path: "../fonts/KantumroyPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/KantumroyPro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-khmer",
  display: "swap",
});

// SEO Configuration
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://docuhub.vercel.app";
const SITE_NAME = "Docuhub";
const SITE_DESCRIPTION =
  "Docuhub - Academic Paper Management System. Discover, share, and collaborate on research papers. Connect students with advisers for mentorship and academic excellence.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Academic Paper Management & Research Platform`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Docuhub",
    "academic papers",
    "research platform",
    "paper management",
    "scholarly articles",
    "research repository",
    "academic collaboration",
    "student research",
    "adviser mentorship",
    "peer review",
    "research sharing",
    "academic documents",
    "thesis repository",
    "research papers",
    "academic network",
    "education platform",
    "research discovery",
    "paper submission",
    "academic community",
    "research tools",
    "Cambodia education",
    "ISTAD",
    "Khmer research",
    "Southeast Asian research",
  ],
  authors: [
    {
      name: "Docuhub Team - ISTAD",
      url: SITE_URL,
    },
  ],
  creator: "Docuhub Team",
  publisher: "Institute of Science and Technology Advanced Development (ISTAD)",
  applicationName: SITE_NAME,
  category: "Education",
  classification: "Academic Research Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Academic Paper Management & Research Platform`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    alternateLocale: ["km_KH"],
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Academic Research Platform`,
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
  },
  twitter: {
    card: "summary_large_image",
    site: "@DocuhubTeam",
    creator: "@DocuhubTeam",
    title: `${SITE_NAME} - Academic Paper Management Platform`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/twitter-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-16x16.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": `${SITE_URL}/en`,
      "km-KH": `${SITE_URL}/kh`,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/browse?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: "Institute of Science and Technology Advanced Development",
      alternateName: "ISTAD",
      url: "https://www.istad.edu.kh",
      address: {
        "@type": "PostalAddress",
        addressCountry: "KH",
        addressRegion: "Phnom Penh",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "info@istad.edu.kh",
      },
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo/Docohub.png`,
        width: 512,
        height: 512,
      },
    },
    inLanguage: ["en", "km"],
    keywords: [
      "academic papers",
      "research platform",
      "paper management",
      "scholarly articles",
      "academic repository",
      "research collaboration",
      "student research",
      "ISTAD Cambodia",
    ],
    audience: {
      "@type": "EducationalAudience",
      educationalRole: ["student", "researcher", "professor"],
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    sameAs: [
      "https://www.istad.edu.kh",
      // Add social media links when available
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hreflang for multilingual SEO */}
        <link rel="alternate" hrefLang="en" href={`${SITE_URL}/en`} />
        <link rel="alternate" hrefLang="km" href={`${SITE_URL}/kh`} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />

        {/* Additional meta tags */}
        <meta name="theme-color" content="#2563EB" />
        <meta name="application-name" content={SITE_NAME} />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Preconnect for performance */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} ${kantumroyPro.variable} antialiased`}
      >
        <Providers>
          <StickyBanner />
          <NavbarWrapper />
          <main className="mt-[calc(2.5rem+4rem)] sm:mt-[calc(2.5rem+4.5rem)] md:mt-20 overflow-x-hidden">
            <OfflineIndicator />
            <LoadingBar />
            {children}
            <SpeedInsights />
            <Analytics />
            <ToastContainer position="bottom-right" autoClose={3000} />
          </main>
          <ContactFooter />
        </Providers>
      </body>
    </html>
  );
}
