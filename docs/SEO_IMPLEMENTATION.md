# SEO Implementation Guide for Docuhub

## Overview

This document outlines the comprehensive SEO implementation for the Docuhub Academic Paper Management Platform.

## Table of Contents

1. [Meta Tags & Structured Data](#meta-tags--structured-data)
2. [Sitemap & Robots](#sitemap--robots)
3. [Open Graph & Social Media](#open-graph--social-media)
4. [Performance Optimization](#performance-optimization)
5. [Configuration](#configuration)
6. [Best Practices](#best-practices)

---

## 1. Meta Tags & Structured Data

### Root Layout (`src/app/layout.tsx`)

The root layout contains:

- ✅ **Title Template**: Dynamic titles for all pages
- ✅ **Meta Description**: Comprehensive site description
- ✅ **Keywords**: 20+ relevant keywords
- ✅ **Open Graph Tags**: For social media sharing
- ✅ **Twitter Card**: Optimized for Twitter/X
- ✅ **Schema.org JSON-LD**: Structured data for search engines
- ✅ **Multilingual Support**: English & Khmer (km)
- ✅ **Icons & Manifest**: PWA support

### Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Docuhub",
  "description": "Academic Paper Management System...",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://docuhub.vercel.app/browse?q={search_term_string}"
  }
}
```

### Page-Specific Metadata

Each major page has its own metadata configuration in `src/lib/seo.ts`:

- Home Page
- Browse Papers
- About Us
- Contact
- Roadmap
- Login/Register
- Dashboards

---

## 2. Sitemap & Robots

### Sitemap (`src/app/sitemap.ts`)

- ✅ **Dynamic Generation**: Auto-generated sitemap.xml
- ✅ **Priority System**:
  - Homepage: 1.0
  - Browse: 0.9
  - About: 0.8
  - Other pages: 0.4-0.7
- ✅ **Change Frequency**:
  - Daily: Home, Browse
  - Weekly: Dashboards
  - Monthly: Static pages

**Access**: `https://docuhub.vercel.app/sitemap.xml`

### Robots.txt (`public/robots.txt`)

- ✅ **Allow Public Pages**: All public routes
- ✅ **Disallow Private Routes**:
  - `/api/` - API endpoints
  - `/admin/` - Admin panel
  - `/*/settings` - User settings
- ✅ **Bot-Specific Rules**: Google, Bing
- ✅ **Block Scrapers**: AhrefsBot, SemrushBot

**Access**: `https://docuhub.vercel.app/robots.txt`

---

## 3. Open Graph & Social Media

### Open Graph Tags

```html
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Docuhub" />
<meta property="og:title" content="Docuhub - Academic Paper Management" />
<meta property="og:description" content="..." />
<meta property="og:image" content="/og-image.png" />
<meta property="og:url" content="https://docuhub.vercel.app" />
```

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:creator" content="@DocuhubTeam" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="/twitter-image.png" />
```

### Recommended Image Sizes

- **Open Graph**: 1200×630px (PNG)
- **Twitter Card**: 1200×630px (PNG)
- **Favicon**: 32×32px (ICO)
- **Apple Touch Icon**: 180×180px (PNG)

---

## 4. Performance Optimization

### Implemented Features

- ✅ **DNS Prefetch**: fonts.googleapis.com, res.cloudinary.com
- ✅ **Preconnect**: Google Fonts
- ✅ **Image Optimization**: Next.js Image component
- ✅ **Font Optimization**: Next.js Font optimization
- ✅ **Analytics**: Vercel Analytics & Speed Insights
- ✅ **Lazy Loading**: Components & images

### Core Web Vitals

Monitor these metrics:

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

---

## 5. Configuration

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://docuhub.vercel.app
```

### Verification Codes

Update in `src/app/layout.tsx`:

```typescript
verification: {
  google: "your-google-verification-code",
  yandex: "your-yandex-verification-code",
  yahoo: "your-yahoo-verification-code",
}
```

### Web Manifest (`public/site.webmanifest`)

- ✅ PWA Support
- ✅ App Name & Description
- ✅ Icons (192×192, 512×512)
- ✅ Theme Color
- ✅ Shortcuts

---

## 6. Best Practices

### ✅ Implemented

1. **Semantic HTML**: Use proper heading hierarchy (h1, h2, h3)
2. **Alt Text**: All images have descriptive alt attributes
3. **Mobile-First**: Responsive design with viewport meta tag
4. **Canonical URLs**: Prevent duplicate content
5. **Hreflang Tags**: Multilingual support (en, km)
6. **HTTPS**: Secure connection (Vercel auto-provisions SSL)
7. **Schema Markup**: JSON-LD structured data
8. **XML Sitemap**: Auto-generated and submitted
9. **Robots.txt**: Proper crawl directives
10. **Social Meta Tags**: Open Graph & Twitter Cards

### 📋 TODO

1. **Google Search Console**:
   - Add and verify property
   - Submit sitemap
   - Monitor crawl errors
2. **Bing Webmaster Tools**:
   - Add and verify site
   - Submit sitemap
3. **Analytics Setup**:
   - Google Analytics 4
   - Set up conversion tracking
4. **Content Optimization**:
   - Regular blog posts
   - Research paper metadata
   - Internal linking strategy
5. **Technical**:
   - Generate actual og-image.png (1200×630)
   - Create twitter-image.png
   - Add breadcrumb schema
   - Implement FAQ schema

---

## Testing SEO

### Tools

1. **Google Search Console**: https://search.google.com/search-console
2. **Google PageSpeed Insights**: https://pagespeed.web.dev
3. **Lighthouse**: Built into Chrome DevTools
4. **Schema Validator**: https://validator.schema.org
5. **Open Graph Debugger**: https://developers.facebook.com/tools/debug
6. **Twitter Card Validator**: https://cards-dev.twitter.com/validator

### Commands

```bash
# Check sitemap
curl https://docuhub.vercel.app/sitemap.xml

# Check robots.txt
curl https://docuhub.vercel.app/robots.txt

# Check manifest
curl https://docuhub.vercel.app/site.webmanifest

# Run Lighthouse
npx lighthouse https://docuhub.vercel.app --view
```

---

## Monitoring & Maintenance

### Weekly

- Check Google Search Console for errors
- Monitor Core Web Vitals
- Review search performance

### Monthly

- Update sitemap if new pages added
- Review and update meta descriptions
- Check broken links
- Update content

### Quarterly

- SEO audit
- Competitor analysis
- Keyword research
- Content strategy review

---

## Support

For questions or issues:

- **Email**: support@docuhub.com
- **GitHub**: https://github.com/docuhub/issues
- **Documentation**: /docs/

---

**Last Updated**: October 30, 2025
**Version**: 1.0.0
