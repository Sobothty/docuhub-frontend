# DocuHub Frontend Backend Integration Guide

This guide shows how to use the integrated backend API in your frontend components.

## Overview

The integration includes:
- ✅ Updated type definitions to match your backend API
- ✅ Comprehensive API service layer (`src/services/api.ts`)
- ✅ Custom React hooks for easy API integration (`src/hooks/useApi.ts`)
- ✅ Updated Redux slices for state management
- ✅ Authentication context for user management

## Quick Start

### 1. Using Custom Hooks in Components

```tsx
// Example: Fetching papers in a component
import { usePapers } from '@/hooks/useApi';

function PapersPage() {
  const { 
    data: papers, 
    loading, 
    error, 
    getPublishedPapers 
  } = usePapers();

  useEffect(() => {
    getPublishedPapers({ page: 0, size: 10 });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {papers?.papers.content.map(paper => (
        <div key={paper.uuid}>
          <h3>{paper.title}</h3>
          <p>{paper.abstractText}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Using Redux with Redux Toolkit

```tsx
// Example: Using Redux for user management
import { useAppDispatch, useAppSelector } from '@/lib/hook';
import { fetchAllUsers, selectUsers } from '@/feature/users/userSlice';

function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div>
      {users.map(user => (
        <div key={user.uuid}>
          <h3>{user.fullName}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Using Direct API Service

```tsx
// Example: Upload file
import { useMedia } from '@/hooks/useApi';
import apiService from '@/services/api';

function FileUpload() {
  const { loading, error, uploadFile } = useMedia();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await uploadFile(file);
        console.log('File uploaded:', result);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {loading && <p>Uploading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## API Service Examples

### Authentication

```typescript
import apiService from '@/services/api';

// Login
const loginResponse = await apiService.auth.login({
  username: 'your-username',
  password: 'your-password'
});

// Get current user profile
const profile = await apiService.auth.getUserProfile();

// Check token validity
const tokenInfo = await apiService.auth.checkTokenValidity();
```

### Papers Management

```typescript
// Create paper (Student)
const paperData = {
  title: "My Research Paper",
  abstractText: "This is the abstract...",
  fileUrl: "https://api.docuhub.me/media/paper.pdf",
  thumbnailUrl: "https://api.docuhub.me/media/thumbnail.jpg",
  categoryNames: ["AI", "Machine Learning"]
};

await apiService.papers.createPaper(paperData);

// Get published papers
const publishedPapers = await apiService.papers.getPublishedPapers({
  page: 0,
  size: 10,
  sortBy: 'createdAt',
  direction: 'desc'
});

// Get author's papers
const authorPapers = await apiService.papers.getAuthorPapers();

// Update paper
await apiService.papers.updatePaperByAuthor(paperUuid, updatedData);

// Delete paper
await apiService.papers.deletePaperByAuthor(paperUuid);
```

### Adviser Management

```typescript
// Create adviser detail
const adviserData = {
  experienceYears: 5,
  linkedinUrl: "https://linkedin.com/in/adviser",
  publication: "Published 20+ papers in AI",
  socialLinks: "https://twitter.com/adviser",
  status: "ACTIVE" as const,
  userUuid: "user-uuid-here",
  specializeUuids: ["ai-uuid", "ml-uuid"]
};

await apiService.advisers.createAdviserDetail(adviserData);

// Get all advisers
const advisers = await apiService.advisers.getAllAdviserDetails();

// Get adviser assignments
const assignments = await apiService.advisers.getAllAssignments(0, 10);
```

### User Management

```typescript
// Get all students
const students = await apiService.users.getAllStudents(0, 10);

// Get all advisers
const advisers = await apiService.users.getAllAdvisers(0, 10);

// Promote user to student
await apiService.users.promoteToStudent(userUuid);

// Promote user to adviser
await apiService.users.promoteToAdviser(userUuid);
```

### File Upload

```typescript
// Upload file
const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
const uploadResult = await apiService.media.uploadFile(file);

console.log('File uploaded:', uploadResult.data.uri);

// Delete file
await apiService.media.deleteMedia('filename.pdf');
```

### Comments System

```typescript
// Create comment
await apiService.comments.createComment({
  content: "Great paper!",
  paperUuid: "paper-uuid",
  parentUuid: null // or parent comment UUID for replies
});

// Get comments for paper
const comments = await apiService.comments.getCommentsForPaper(paperUuid);

// Update comment
await apiService.comments.updateComment(commentUuid, {
  commentUuid: commentUuid,
  content: "Updated comment"
});
```

### Star System

```typescript
// Star a paper
const starResponse = await apiService.stars.starPaper(paperUuid);

// Unstar a paper
await apiService.stars.unstarPaper(paperUuid);

// Get star count
const starCount = await apiService.stars.getStarCount(paperUuid);

// Get users who starred
const usersWhoStarred = await apiService.stars.getUsersWhoStarred(paperUuid);
```

## Authentication Integration

### Using the Auth Context (Updated)

Your existing `AuthContext` has been updated to integrate with the backend:

```tsx
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const { login, loading, error } = useAuth();

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      await login(credentials);
      // User will be redirected based on their role
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Your login form */}
    </form>
  );
}
```

### Protected Routes

```tsx
import { withAuth, withRole } from '@/contexts/AuthContext';

// Protected route for any authenticated user
const ProtectedDashboard = withAuth(Dashboard);

// Admin-only route
const AdminPanel = withRole(AdminDashboard, ['admin']);

// Adviser-only route
const AdviserDashboard = withRole(AdviserDashboardComponent, ['adviser']);

// Student-only route
const StudentDashboard = withRole(StudentDashboardComponent, ['student']);

// Multiple roles allowed
const SharedDashboard = withRole(SharedComponent, ['adviser', 'admin']);
```

## Environment Configuration

Make sure your `.env.local` file has the correct API base URL:

```env
NEXT_PUBLIC_BASE_URL=https://api.docuhub.me/api/v1
AUTH_SECRET=your-auth-secret
NEXTAUTH_URL=http://localhost:3000
KEYCLOAK_ID=docuhub-client
KEYCLOAK_SECRET=your-keycloak-secret
KEYCLOAK_ISSUER=https://keycloak.docuhub.me/realms/docuapi
```

## Error Handling

All API functions include proper error handling. You can catch errors at the component level:

```tsx
try {
  const result = await apiService.papers.createPaper(paperData);
  // Success
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
    // Show user-friendly error message
  }
}
```

## Redux Store Integration

The Redux store has been updated to include all the new slices. You can use them in your components:

```tsx
import { useAppSelector, useAppDispatch } from '@/lib/hook';
import { 
  selectPapers, 
  selectPaperLoading, 
  fetchPublishedPapers 
} from '@/feature/paperSlice/paperSlice';

function PapersComponent() {
  const dispatch = useAppDispatch();
  const papers = useAppSelector(selectPapers);
  const loading = useAppSelector(selectPaperLoading);

  useEffect(() => {
    dispatch(fetchPublishedPapers({ page: 0, size: 10 }));
  }, [dispatch]);

  // Component implementation
}
```

## Key Changes Made

1. **Types Updated**: All types now match your backend API exactly
2. **"Mentor" → "Adviser"**: Consistent terminology throughout
3. **Comprehensive API Service**: All your backend endpoints are covered
4. **Custom Hooks**: Easy-to-use React hooks for API calls
5. **Redux Integration**: Updated slices with backend integration
6. **Authentication**: Keycloak integration with token management
7. **Error Handling**: Comprehensive error handling throughout

## Next Steps

1. Update your existing components to use the new API integration
2. Test the authentication flow with your Keycloak setup
3. Replace any hardcoded data with API calls
4. Add loading states and error handling to your UI components
5. Implement role-based access control where needed

This integration provides a solid foundation for connecting your frontend to your comprehensive backend API!