# Offline Support Documentation

Docuhub includes comprehensive offline support to ensure users can access the platform even when their internet connection is unstable or unavailable.

## Features

### 1. Service Worker

- **Location**: `public/sw.js`
- Automatically caches static assets and pages
- Provides offline fallbacks for navigation requests
- Implements multiple caching strategies:
  - **Cache First**: For static assets (images, fonts, icons)
  - **Network First**: For API requests and pages
  - **Stale While Revalidate**: For dynamic content

### 2. Offline Page

- **Location**: `src/app/offline/page.tsx`
- Beautiful, user-friendly offline page
- Auto-reloads when connection is restored
- Provides troubleshooting tips and navigation options

### 3. Network Status Indicator

- **Location**: `src/components/page/offline-indicatior.tsx`
- Real-time network status banner
- Shows when connection is lost or restored
- Animated UI with clear messaging

### 4. Network Status Hook

- **Location**: `src/hooks/useNetworkStatus.ts`
- Custom React hook for network status
- Provides connection type, speed, and latency information
- Tracks online/offline state changes

### 5. Offline Utilities

- **Location**: `src/lib/offline.ts`
- Helper functions for offline handling
- Network error detection
- Request queuing and retry logic

### 6. Network Error Boundary

- **Location**: `src/components/error/NetworkErrorBoundary.tsx`
- Catches network errors at the component level
- Provides fallback UI for network failures
- Auto-recovers when connection is restored

## Usage

### Service Worker Registration

The service worker is automatically registered when the app loads via `ServiceWorkerProvider`:

```tsx
import { ServiceWorkerProvider } from "@/components/providers/ServiceWorkerProvider";

// Already integrated in src/app/providers.tsx
```

### Using Network Status Hook

```tsx
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

function MyComponent() {
  const { isOnline, wasOffline, connectionType } = useNetworkStatus();

  if (!isOnline) {
    return <div>You are offline</div>;
  }

  return <div>Online - Connection: {connectionType}</div>;
}
```

### Using Offline Utilities

```tsx
import {
  isOnline,
  retryWhenOnline,
  queueRequestWhenOnline,
} from "@/lib/offline";

// Check online status
if (isOnline()) {
  // Make API call
}

// Retry when online
await retryWhenOnline(async () => {
  await fetch("/api/data");
});

// Queue request for when online
queueRequestWhenOnline(async () => {
  await saveData();
});
```

### Using Network Error Boundary

```tsx
import { NetworkErrorBoundary } from "@/components/error/NetworkErrorBoundary";

function App() {
  return (
    <NetworkErrorBoundary>
      <YourApp />
    </NetworkErrorBoundary>
  );
}
```

## Caching Strategies

### Static Assets

- Cached on install
- Served from cache first
- Updated when service worker updates

### Pages

- Network first, fallback to cache
- Offline page shown if not cached

### API Requests

- Network first
- Returns cached data if available
- Returns offline error response if no cache

## Testing Offline Mode

### Chrome DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Select **Offline** from the throttling dropdown
4. Refresh the page

### Service Worker Testing

1. Open DevTools
2. Go to **Application** tab
3. Click **Service Workers**
4. Check registration status
5. Use **Update** and **Unregister** for testing

### Manual Testing

1. Disconnect your internet connection
2. Navigate to different pages
3. Verify offline page appears
4. Reconnect and verify auto-reload

## Configuration

### Service Worker Cache Version

Update `CACHE_NAME` in `public/sw.js` to force cache refresh:

```javascript
const CACHE_NAME = "docuhub-v2"; // Increment version
```

### Cached Assets

Add or remove assets in `STATIC_ASSETS` array in `public/sw.js`:

```javascript
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/favicon.ico",
  // Add more assets here
];
```

## Browser Support

- ✅ Chrome/Edge (Full support)
- ✅ Firefox (Full support)
- ✅ Safari (iOS 11.3+, macOS 11.1+)
- ⚠️ Internet Explorer (Not supported)

## Best Practices

1. **Cache Important Pages**: Add frequently visited pages to `STATIC_ASSETS`
2. **Handle API Errors**: Use `isNetworkError()` to detect network failures
3. **Queue Critical Requests**: Use `queueRequestWhenOnline()` for important data
4. **Update Cache Version**: Increment version when deploying major changes
5. **Test Offline Mode**: Always test offline functionality before deployment

## Troubleshooting

### Service Worker Not Registering

- Check browser console for errors
- Verify HTTPS (required for service workers)
- Check if service worker file exists at `/sw.js`

### Cache Not Updating

- Increment `CACHE_NAME` version
- Clear browser cache
- Unregister old service worker

### Offline Page Not Showing

- Verify `/offline` route exists
- Check service worker registration
- Verify cache includes offline page

## Performance Considerations

- Service worker adds minimal overhead (~50KB)
- Cached assets load instantly
- Network requests are faster with cached responses
- Offline mode improves user experience significantly

## Security

- Service workers only work on HTTPS (or localhost)
- Cached data is domain-specific
- No sensitive data is cached without encryption
- Service worker scope is limited to your domain

## Future Enhancements

- Background sync for queued requests
- Push notifications support
- Advanced caching strategies
- Offline-first data synchronization
