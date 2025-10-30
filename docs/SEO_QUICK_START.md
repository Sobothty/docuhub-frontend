# SEO Quick Start Guide - Docuhub

## 🚀 Quick Setup (5 Minutes)

### Step 1: Environment Variable

Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_SITE_URL=https://docuhub.vercel.app
```

Replace with your actual production URL.

### Step 2: Verify Files Exist

Check that these files are in place:

- ✅ `src/app/layout.tsx` - Main SEO configuration
- ✅ `src/lib/seo.ts` - SEO utility functions
- ✅ `src/app/sitemap.ts` - Dynamic sitemap
- ✅ `public/robots.txt` - Robots configuration
- ✅ `public/site.webmanifest` - PWA manifest

### Step 3: Create Image Assets

Create these images in the `/public/` directory:

1. **og-image.png** (1200×630px)

   - Main Open Graph image
   - Used for social media sharing

2. **twitter-image.png** (1200×630px)

   - Twitter card image

3. **Icons** (if not already present):
   - icon-16x16.png
   - icon-32x32.png
   - icon-192x192.png
   - icon-512x512.png
   - apple-touch-icon.png (180×180px)

### Step 4: Deploy & Test

```bash
npm run build
npm run start
```

Test locally:

- Sitemap: http://localhost:3000/sitemap.xml
- Robots: http://localhost:3000/robots.txt
- Manifest: http://localhost:3000/site.webmanifest

### Step 5: Search Console Setup

After deployment:

1. **Google Search Console**

   - Go to https://search.google.com/search-console
   - Add property: `https://docuhub.vercel.app`
   - Verify ownership (HTML tag method)
   - Update verification code in `src/app/layout.tsx`:
     ```typescript
     verification: {
       google: "your-verification-code",
     }
     ```
   - Submit sitemap: `https://docuhub.vercel.app/sitemap.xml`

2. **Bing Webmaster Tools**
   - Go to https://www.bing.com/webmasters
   - Add site and verify
   - Submit sitemap

---

## 📊 What's Already Configured

### ✅ Meta Tags

- Dynamic titles for all pages
- Descriptions optimized for search
- 20+ relevant keywords
- Proper canonical URLs
- Multilingual support (English & Khmer)

### ✅ Social Media

- Open Graph tags for Facebook, LinkedIn
- Twitter Cards for Twitter/X
- Social images configured

### ✅ Structured Data

- Schema.org JSON-LD markup
- WebSite schema with search action
- Educational organization markup

### ✅ Technical SEO

- robots.txt with proper rules
- Auto-generated sitemap.xml
- Mobile-optimized viewport
- DNS prefetch for performance
- PWA manifest

### ✅ Page-Specific SEO

- Home, Browse, About, Contact, Roadmap
- Login, Register pages
- Dashboard pages (Student, Adviser)

---

## 🎯 Key Features

### 1. Dynamic Metadata

Every page has optimized metadata automatically:

```typescript
// Example: Using SEO helper
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Your Page Title",
  description: "Your page description",
  keywords: ["keyword1", "keyword2"],
});
```

### 2. Auto-Generated Sitemap

Sitemap updates automatically when you deploy. No manual updates needed!

### 3. Smart Robots.txt

- Allows search engines on public pages
- Blocks private routes (API, admin, settings)
- Prevents aggressive crawlers

### 4. Multilingual Ready

- English (en) and Khmer (km) support
- Proper hreflang tags
- Language-specific URLs

---

## 🧪 Testing Your SEO

### Local Testing

```bash
# Check sitemap
curl http://localhost:3000/sitemap.xml

# Check robots
curl http://localhost:3000/robots.txt

# Run Lighthouse
npx lighthouse http://localhost:3000 --view
```

### Online Tools

1. **Google PageSpeed Insights**

   - https://pagespeed.web.dev
   - Enter your URL and run test
   - Target: 90+ score

2. **Schema Validator**

   - https://validator.schema.org
   - Paste your URL
   - Check for errors

3. **Facebook Debugger**

   - https://developers.facebook.com/tools/debug
   - Test Open Graph tags

4. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - Test Twitter cards

---

## 📈 Monitoring Performance

### Weekly

- Check Google Search Console for errors
- Review search performance metrics
- Monitor Core Web Vitals

### Monthly

- Update content and metadata if needed
- Check for broken links
- Review keyword rankings

### Tools to Monitor

- Google Search Console
- Google Analytics (set up separately)
- Vercel Analytics (already integrated)

---

## 🛠️ Common Issues & Solutions

### Issue: Sitemap not showing

**Solution**:

- Check `NEXT_PUBLIC_SITE_URL` is set
- Redeploy application
- Wait 24 hours for search engines to index

### Issue: Images not showing in social shares

**Solution**:

- Create og-image.png and twitter-image.png
- Ensure images are 1200×630px
- Clear Facebook/Twitter cache with their debuggers

### Issue: Search Console verification failed

**Solution**:

- Copy verification code exactly
- Update in `src/app/layout.tsx`
- Redeploy and wait a few minutes
- Try verification again

---

## 📚 Additional Resources

- **Full Documentation**: `/docs/SEO_IMPLEMENTATION.md`
- **Checklist**: `/docs/SEO_CHECKLIST.md`
- **Next.js SEO**: https://nextjs.org/docs/app/building-your-application/optimizing/metadata

---

## 🎉 You're All Set!

Your Docuhub platform now has enterprise-grade SEO configured. Here's what happens next:

1. **Immediate**: Meta tags and social sharing work
2. **24-48 hours**: Search engines start crawling
3. **1-2 weeks**: Pages appear in search results
4. **1-3 months**: Rankings improve with content

Keep creating quality content and monitoring your SEO metrics!

---

**Questions?** Check the full documentation or open an issue on GitHub.

**Last Updated**: October 30, 2025
