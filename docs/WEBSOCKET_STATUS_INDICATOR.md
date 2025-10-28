# WebSocket Status Indicator Guide

## Overview

The WebSocket Status Indicator is a visual component that shows the real-time connection status of your WebSocket. It comes in multiple variants for different use cases.

## Features

✨ **Multiple Variants**: Dot, Full Badge, Icon Only, Text Only
✨ **Animated Pulse**: Green dot pulses when connected
✨ **Tooltip Support**: Hover for connection status
✨ **Responsive**: Works on all screen sizes
✨ **Customizable**: Full control over appearance

## Usage Examples

### 1. Minimal Dot Indicator (Recommended)

Perfect for navbars and headers - subtle and clean:

```tsx
import WebSocketStatus from "@/components/ui/WebSocketStatus";

<WebSocketStatus variant="dot" />;
```

**Result**: 🟢 (small pulsing green dot when connected)

### 2. Full Badge with Icon and Text

Shows complete status information:

```tsx
<WebSocketStatus />
// or explicitly:
<WebSocketStatus variant="default" showIcon={true} showText={true} />
```

**Result**: `[WiFi Icon] Connected` badge

### 3. Icon Only

Shows just the WiFi icon:

```tsx
<WebSocketStatus showText={false} />
```

**Result**: WiFi icon (green when connected, gray when disconnected)

### 4. Text Only

Shows just the status text:

```tsx
<WebSocketStatus showIcon={false} />
```

**Result**: "Connected" or "Disconnected" text

## Real-World Examples

### Example 1: Navbar Integration (Already Implemented)

```tsx
// src/components/header/NavbarUser.tsx
export default function NavbarUser() {
  return (
    <nav>
      <div className="flex items-center space-x-4">
        {/* Minimal dot indicator */}
        <WebSocketStatus variant="dot" />

        {/* Other nav items */}
        <ThemeToggle />
        <UserMenu />
      </div>
    </nav>
  );
}
```

### Example 2: Admin Dashboard Header

```tsx
export default function AdminHeader() {
  return (
    <header className="border-b p-4">
      <div className="flex justify-between items-center">
        <h1>Admin Dashboard</h1>

        {/* Full status badge */}
        <WebSocketStatus variant="default" />
      </div>
    </header>
  );
}
```

### Example 3: Chat Page Status Bar

```tsx
export default function ChatPage() {
  return (
    <div>
      <div className="bg-gray-100 p-2 flex items-center justify-center gap-2">
        <WebSocketStatus variant="dot" />
        <span className="text-sm">Real-time messaging active</span>
      </div>

      {/* Chat content */}
    </div>
  );
}
```

### Example 4: Settings Page Connection Status

```tsx
export default function SettingsPage() {
  return (
    <div className="p-6">
      <h2>Connection Settings</h2>

      <div className="flex items-center justify-between p-4 border rounded">
        <div>
          <h3>Real-time Connection</h3>
          <p className="text-sm text-gray-500">
            WebSocket status for live updates
          </p>
        </div>

        {/* Full badge */}
        <WebSocketStatus />
      </div>
    </div>
  );
}
```

### Example 5: Fixed Corner Indicator (Development)

Useful during development to always see connection status:

```tsx
export default function DevIndicator() {
  return (
    <WebSocketStatus variant="dot" className="fixed bottom-4 right-4 z-50" />
  );
}
```

### Example 6: Mobile Bottom Nav

```tsx
export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around items-center p-2">
        <Link href="/home">Home</Link>
        <Link href="/messages">Messages</Link>
        <Link href="/profile">Profile</Link>

        {/* Status indicator */}
        <WebSocketStatus variant="dot" />
      </div>
    </nav>
  );
}
```

## Component API

### Props

```typescript
interface WebSocketStatusProps {
  // Display variant
  variant?: "default" | "dot";

  // Show/hide icon (only for "default" variant)
  showIcon?: boolean;

  // Show/hide text (only for "default" variant)
  showText?: boolean;

  // Additional CSS classes
  className?: string;
}
```

### Default Values

```typescript
{
  variant: "default",
  showIcon: true,
  showText: true,
  className: "",
}
```

## Visual States

### Connected State (🟢)

- **Dot Variant**: Pulsing green dot
- **Default Variant**: Green WiFi icon + "Connected" text
- **Color**: `bg-green-500` / `text-green-500`

### Disconnected State (⚫)

- **Dot Variant**: Gray static dot
- **Default Variant**: Gray WiFi Off icon + "Disconnected" text
- **Color**: `bg-gray-400` / `text-gray-400`

## Styling Customization

### Size Variations

```tsx
{
  /* Small */
}
<WebSocketStatus variant="dot" className="scale-75" />;

{
  /* Normal */
}
<WebSocketStatus variant="dot" />;

{
  /* Large */
}
<WebSocketStatus variant="dot" className="scale-125" />;
```

### Custom Positioning

```tsx
{
  /* Fixed top-right corner */
}
<WebSocketStatus variant="dot" className="fixed top-4 right-4 z-50" />;

{
  /* Fixed bottom-left corner */
}
<WebSocketStatus variant="dot" className="fixed bottom-4 left-4 z-50" />;

{
  /* Center of screen */
}
<WebSocketStatus
  variant="dot"
  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
/>;
```

### With Custom Container

```tsx
<div className="flex items-center gap-2 p-2 rounded-lg border">
  <WebSocketStatus variant="dot" />
  <span className="text-sm font-medium">Live Connection</span>
</div>
```

## Best Practices

### ✅ Do's

1. **Use dot variant for compact spaces** (navbars, toolbars)

   ```tsx
   <WebSocketStatus variant="dot" />
   ```

2. **Use full variant for informative displays** (settings, dashboards)

   ```tsx
   <WebSocketStatus />
   ```

3. **Add tooltips for context** (already built-in for dot variant)

4. **Position strategically** - where users expect status indicators

### ❌ Don'ts

1. **Don't overuse** - one indicator per page is usually enough

2. **Don't hide in production** - users should see connection status

3. **Don't make it too large** - it should be subtle

4. **Don't use in loading states** - show during active sessions only

## Troubleshooting

### Indicator Not Showing

1. **Check WebSocket Provider is installed:**

   ```tsx
   // In src/app/providers.tsx
   <WebSocketProvider>{children}</WebSocketProvider>
   ```

2. **Verify component import:**

   ```tsx
   import WebSocketStatus from "@/components/ui/WebSocketStatus";
   ```

3. **Ensure it's in a client component:**
   ```tsx
   "use client"; // Add at top of file
   ```

### Always Shows Disconnected

1. **Check authentication:**

   - WebSocket only connects when user is logged in

2. **Verify environment variable:**

   ```env
   NEXT_PUBLIC_WS_URL=https://api.docuhub.me/ws-chat
   ```

3. **Check browser console:**
   - Look for WebSocket connection logs
   - Check for connection errors

## Animation Details

The dot indicator uses Tailwind's `animate-ping` utility for the pulse effect:

```css
/* When connected, shows pulsing animation */
.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
```

## Accessibility

The component includes accessibility features:

- **Tooltip**: Shows status on hover
- **Semantic HTML**: Uses appropriate elements
- **Color + Shape**: Doesn't rely only on color (uses icons too)

## Browser Support

Works in all modern browsers:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Performance

- **Lightweight**: < 1KB gzipped
- **No re-renders**: Only updates on connection state change
- **CSS animations**: Hardware accelerated

## Testing

### Manual Testing

1. Open your app and log in
2. Look for the green pulsing dot
3. Open DevTools > Network > WS tab
4. Disable network to test disconnection
5. Re-enable to see reconnection

### Visual Test

```tsx
// Test both states
export default function StatusTest() {
  return (
    <div className="space-y-4 p-8">
      <div>
        <h3>Dot Variant</h3>
        <WebSocketStatus variant="dot" />
      </div>

      <div>
        <h3>Full Badge</h3>
        <WebSocketStatus />
      </div>

      <div>
        <h3>Icon Only</h3>
        <WebSocketStatus showText={false} />
      </div>

      <div>
        <h3>Text Only</h3>
        <WebSocketStatus showIcon={false} />
      </div>
    </div>
  );
}
```

## Related Components

- [`useWebSocket` hook](./WEBSOCKET_SETUP.md#usewebsocket-hook) - Access WebSocket state
- [`WebSocketProvider`](./WEBSOCKET_SETUP.md#provider-integration) - Global connection provider

## Examples in Your App

The status indicator is already implemented in:

- ✅ **Navbar** - Desktop (`src/components/header/NavbarUser.tsx`)
- ✅ **Navbar** - Mobile (`src/components/header/NavbarUser.tsx`)
- ✅ **Sidebar** - All dashboards (`src/components/layout/sidebar.tsx`)
  - Student dashboard
  - Adviser dashboard
  - Admin dashboard
  - Public profile dashboard

You can add it to other pages like:

- Chat pages
- Settings page
- Individual document pages
- Real-time collaboration features

## Summary

The WebSocket Status Indicator is a simple, flexible component that provides visual feedback about your real-time connection status. Use the **dot variant** for subtle indicators in navbars, and the **full variant** for explicit status displays in settings or dashboards.

**Quick Start:**

```tsx
import WebSocketStatus from "@/components/ui/WebSocketStatus";

// In your component
<WebSocketStatus variant="dot" />;
```

That's it! 🎉
