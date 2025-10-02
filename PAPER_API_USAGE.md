# Paper API Integration Guide

## Overview
This guide explains how to use the integrated paper API with your Next.js application using RTK Query.

## API Endpoints
- **Base URL**: `https://api.docuhub.me/`
- **Papers Endpoint**: `/api/v1/papers/published`
- **Paper Detail**: `/api/v1/papers/{uuid}`
- **User Info**: `/api/v1/users/{uuid}`

## Environment Setup
Make sure your `.env.local` file contains:
```env
NEXT_PUBLIC_BASE_URL=https://api.docuhub.me/
```

## Components Created

### 1. PaperCard Component
**Location**: `src/components/card/PaperCard.tsx`

**Usage**:
```tsx
import PaperCard from '@/components/card/PaperCard';

<PaperCard
  paper={paperData}
  authorName="Author Name"
  onDownloadPDF={() => window.open(paper.fileUrl, '_blank')}
  onToggleBookmark={() => console.log('Bookmark toggled')}
  isBookmarked={false}
/>
```

### 2. Updated Paper List Page
**Location**: `src/app/papers/page.tsx`
- Fetches published papers with pagination
- Displays papers in a responsive grid
- Includes loading and error states
- Supports pagination

### 3. Updated Paper Detail Page
**Location**: `src/app/papers/[id]/page.tsx`
- Shows individual paper details
- Fetches author information
- Displays related papers
- Includes PDF viewer, comments, and citation info
- Supports sharing and bookmarking

## API Hooks Available

### useGetPublishedPapersQuery
```tsx
const { data, isLoading, error } = useGetPublishedPapersQuery({
  page: 0,
  size: 10
});
```

### useGetPaperByIdQuery
```tsx
const { data: paper, isLoading, error } = useGetPaperByIdQuery(paperUuid);
```

### useGetUserByIdQuery
```tsx
const { data: author } = useGetUserByIdQuery(authorUuid);
```

### Mutation Hooks
```tsx
const [createPaper] = useCreatePaperMutation();
const [updatePaper] = useUpdatePaperMutation();
const [deletePaper] = useDeletePaperMutation();
```

## Data Structure

### Paper Type
```typescript
interface Paper {
  uuid: string;
  title: string;
  abstractText: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  authorUuid: string;
  categoryNames: string[];
  status: string;
  isApproved: boolean;
  submittedAt: string;
  createdAt: string;
  isPublished: boolean;
  publishedAt: string | null;
}
```

### API Response Structure
```typescript
interface GetPapersResponse {
  message: string;
  papers: {
    content: Paper[];
    pageable: {...};
    totalElements: number;
    totalPages: number;
    // ... other pagination fields
  };
}
```

## Navigation Routes
- `/papers` - List all published papers
- `/papers/[id]` - View individual paper details

## Features Implemented
✅ Paper listing with pagination
✅ Paper detail view
✅ Author information fetching
✅ PDF download functionality
✅ Related papers display
✅ Search and filtering (basic structure)
✅ Loading and error states
✅ Responsive design
✅ Share functionality
✅ Bookmark functionality (UI only)
✅ Citation generation
✅ PDF viewer integration

## How to Test

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to papers**:
   - Go to `http://localhost:3000/papers`
   - You should see a list of published papers from the API

3. **Test paper details**:
   - Click on any paper card
   - View individual paper details
   - Test PDF download
   - Check related papers

4. **Test error handling**:
   - Try navigating to a non-existent paper ID
   - Disconnect internet to test error states

## Troubleshooting

### Common Issues:

1. **CORS Issues**: If you encounter CORS issues, the API might need to be configured to allow your domain.

2. **PDF Loading Issues**: Some PDFs might not load in the browser viewer. The download functionality will still work.

3. **Author Data Not Loading**: Some papers might have author UUIDs that don't exist in the users endpoint.

### Debug Steps:
1. Check browser console for API errors
2. Verify environment variables are set correctly
3. Test API endpoints directly in browser or Postman
4. Check network tab for failed requests

## Future Enhancements

Consider implementing:
- Advanced search and filtering
- Bookmark persistence (backend integration)
- User authentication for paper management
- Real-time comments system
- Paper submission workflow
- Analytics and statistics
- Advanced PDF viewer features

## API Integration Status
- ✅ Paper listing
- ✅ Paper details
- ✅ User information
- ✅ Error handling
- ✅ Loading states
- ⚠️ Paper CRUD operations (create, update, delete) - Ready but may need authentication
- ❌ Authentication integration
- ❌ Real bookmark persistence
- ❌ Comments system backend