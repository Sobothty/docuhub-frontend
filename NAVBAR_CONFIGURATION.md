# 🧭 Navbar Configuration Guide

## Routes WITHOUT Navbar, Sticky Banner, and Footer

The `ConditionalLayout` component automatically hides the navbar, sticky banner, and footer for the following routes:

### ✅ Exact Route Matches
These routes will **never** show the navbar:
- `/login` - Login page
- `/register` - Registration page  
- `/profile` - User profile page
- `/student-verification` - Student verification form

### ✅ Route Prefixes  
Any route starting with these prefixes will **not** show the navbar:
- `/student/` - All student dashboard pages
  - `/student/mentorship/`
  - `/student/proposals/` 
  - `/student/settings/`
  - etc.
- `/mentor/` - All mentor dashboard pages
  - `/mentor/students/`
  - `/mentor/proposals/`
  - `/mentor/settings/`
  - etc.
- `/admin/` - All admin dashboard pages
  - `/admin/students/`
  - `/admin/papers/`
  - `/admin/users/`
  - etc.
- `/profile/` - All profile sub-pages
  - `/profile/edit/`
  - `/profile/settings/`
  - etc.

### ✅ Base Routes
These base routes will also hide the navbar:
- `/student` - Main student dashboard
- `/mentor` - Main mentor dashboard  
- `/admin` - Main admin dashboard

## Routes WITH Navbar
All other routes will show the full layout with navbar, including:
- `/` - Home page
- `/papers/` - Papers listing and details
- `/about/` - About page
- `/contact/` - Contact page
- `/mentors/` - Public mentors directory
- Any other public pages

## 🔧 How It Works

The `ConditionalLayout` component in `src/components/layout/ConditionalLayout.tsx` uses Next.js `usePathname()` to check the current route and conditionally renders:

**For excluded routes:**
```jsx
return <>{children}</>; // Just the page content
```

**For normal routes:**
```jsx
return (
  <>
    <StickyBanner />
    <NavbarWrapper />
    <main className="mt-20">{children}</main>
    <ContactFooter />
  </>
);
```

## 🐛 Debugging

In development mode, you can see debug logs in the browser console:
```
[ConditionalLayout] Path: /profile, Hide navbar: true
[ConditionalLayout] Path: /papers/123, Hide navbar: false
```

## 📝 Adding New Routes

To add new routes that should hide the navbar, update the `ROUTES_WITHOUT_NAVBAR` object in `ConditionalLayout.tsx`:

```typescript
const ROUTES_WITHOUT_NAVBAR = {
  exact: [
    // Add exact routes here
    '/new-route'
  ],
  prefixes: [
    // Add prefix routes here  
    '/new-section/'
  ],
  base: [
    // Add base routes here
    '/new-base'
  ]
};
```

## ✨ Current Status

✅ **Working correctly** - All specified routes now properly hide the navbar:
- Login/Register pages
- Profile pages  
- Student dashboard and sub-pages
- Mentor dashboard and sub-pages
- Admin dashboard and sub-pages
- Student verification page