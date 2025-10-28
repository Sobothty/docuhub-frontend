# WebSocket Setup Documentation

## Overview

The WebSocket connection is now automatically established when the application starts. This provides real-time messaging capabilities across your entire application.

## Architecture

The WebSocket connection is managed by a global provider (`WebSocketProvider`) that:

- Automatically connects when the user is authenticated
- Maintains a persistent connection throughout the app lifecycle
- Provides access to WebSocket functionality via a React Context
- Handles reconnection automatically
- Logs all connection events for debugging

## Setup

### 1. Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_WS_URL=https://api.docuhub.me/ws-chat
```

### 2. Provider Integration

The `WebSocketProvider` is already integrated in `src/app/providers.tsx`:

```tsx
<SessionProvider>
  <WebSocketProvider>{/* Your app components */}</WebSocketProvider>
</SessionProvider>
```

**Important:** The `WebSocketProvider` must be inside `SessionProvider` to access authentication tokens.

## Usage in Components

### Basic Example

```tsx
import { useWebSocket } from "@/hooks/useWebSocket";

export default function ChatComponent() {
  const { isConnected, sendPrivateMessage, allChats, currentUser } =
    useWebSocket();

  const handleSendMessage = () => {
    const receiverUuid = "some-uuid";
    const message = "Hello, World!";
    sendPrivateMessage(receiverUuid, message);
  };

  return (
    <div>
      <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>
      <button onClick={handleSendMessage} disabled={!isConnected}>
        Send Message
      </button>
    </div>
  );
}
```

### Accessing All Chats

```tsx
const { allChats } = useWebSocket();

// allChats structure: Record<string, Message[]>
// Key: user UUID, Value: array of messages with that user

const messages = allChats["some-user-uuid"] || [];
```

### Accessing Current User

```tsx
const { currentUser } = useWebSocket();

console.log("Current User UUID:", currentUser?.uuid);
console.log("Current User Email:", currentUser?.email);
```

### Direct STOMP Client Access

For advanced use cases:

```tsx
const { stompClient } = useWebSocket();

if (stompClient?.connected) {
  stompClient.publish({
    destination: "/app/custom-endpoint",
    body: JSON.stringify({ data: "value" }),
  });
}
```

## API Reference

### `useWebSocket()` Hook

Returns an object with the following properties:

| Property             | Type                                              | Description                              |
| -------------------- | ------------------------------------------------- | ---------------------------------------- |
| `isConnected`        | `boolean`                                         | WebSocket connection status              |
| `sendPrivateMessage` | `(receiverUuid: string, message: string) => void` | Send a private message to a user         |
| `allChats`           | `Record<string, Message[]>`                       | All chat messages organized by user UUID |
| `currentUser`        | `UserProfile \| null`                             | Current authenticated user profile       |
| `stompClient`        | `Client \| null`                                  | Direct access to STOMP client instance   |

### Message Interface

```typescript
interface Message {
  id: number | null;
  senderUuid: string;
  receiverUuid: string;
  message: string;
  timestamp: string; // ISO 8601 format
  isRead: boolean;
}
```

## Features

### ✅ Automatic Connection

- Connects automatically when user is authenticated
- No manual connection setup needed in components

### ✅ Automatic Reconnection

- Reconnects automatically on connection loss
- Configurable reconnection delay (default: 3 seconds)

### ✅ Heartbeat

- Maintains connection health with heartbeat mechanism
- Incoming: 4000ms, Outgoing: 4000ms

### ✅ Debugging

- All WebSocket events are logged to console
- Connection status indicators
- Message send/receive logging

### ✅ Optimistic Updates

- Messages are added to local state immediately when sent
- Provides instant feedback to users

## Troubleshooting

### Connection Not Establishing

1. **Check Authentication:**

   ```tsx
   const { data: session } = useSession();
   console.log("Session:", session);
   ```

2. **Check Environment Variable:**

   ```bash
   echo $NEXT_PUBLIC_WS_URL
   ```

3. **Check Console Logs:**
   - Look for `🔌 Initializing WebSocket connection...`
   - Look for `✅ WebSocket connected successfully`

### Messages Not Sending

1. **Check Connection Status:**

   ```tsx
   const { isConnected } = useWebSocket();
   console.log("Connected:", isConnected);
   ```

2. **Check for Errors:**
   - Open browser DevTools > Console
   - Look for red error messages with ❌

### Messages Not Receiving

1. **Check Subscription:**

   - Look for `📡 Subscribing to topic:` in console
   - Verify the topic matches your user UUID

2. **Check Message Format:**
   - Messages must be valid JSON
   - Must match the `Message` interface

## Migration from Component-Level WebSocket

If you have existing components with their own WebSocket logic:

### Before:

```tsx
// ❌ Old way - each component has its own connection
const [stompClient, setStompClient] = useState<Client | null>(null);

useEffect(() => {
  const socket = new SockJS('wss://...');
  const client = new Client({...});
  client.activate();
  setStompClient(client);

  return () => client.deactivate();
}, []);
```

### After:

```tsx
// ✅ New way - use global provider
const { sendPrivateMessage, isConnected } = useWebSocket();

// No useEffect needed!
// No connection setup needed!
// Just use it!
```

## Example: Real-time Notifications

```tsx
"use client";

import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const { allChats, isConnected } = useWebSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Count unread messages across all chats
    const count = Object.values(allChats).reduce((total, messages) => {
      return total + messages.filter((m) => !m.isRead).length;
    }, 0);
    setUnreadCount(count);
  }, [allChats]);

  return (
    <div className="relative">
      <Bell className={isConnected ? "text-green-500" : "text-gray-400"} />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
```

## Best Practices

1. **Always Check Connection Status:**

   ```tsx
   if (!isConnected) {
     return <p>Connecting to real-time services...</p>;
   }
   ```

2. **Handle Empty States:**

   ```tsx
   const messages = allChats[userId] || [];
   if (messages.length === 0) {
     return <p>No messages yet</p>;
   }
   ```

3. **Use the Hook Only in Client Components:**

   ```tsx
   "use client"; // Required!

   import { useWebSocket } from "@/hooks/useWebSocket";
   ```

4. **Don't Call Hooks Conditionally:**

   ```tsx
   // ❌ Bad
   if (someCondition) {
     const { isConnected } = useWebSocket();
   }

   // ✅ Good
   const { isConnected } = useWebSocket();
   if (someCondition && isConnected) {
     // ...
   }
   ```

## Testing

### Manual Testing

1. Open browser DevTools > Console
2. Look for connection messages:

   - `🔌 Initializing WebSocket connection...`
   - `✅ WebSocket connected successfully`
   - `📡 Subscribing to topic: /topic/user.{uuid}`

3. Test sending a message:

   ```tsx
   const { sendPrivateMessage } = useWebSocket();
   sendPrivateMessage("test-uuid", "Test message");
   ```

4. Check for:
   - `📤 Sending private message:` in console
   - Message appears in `allChats`

## Support

For issues or questions:

1. Check console logs for error messages
2. Verify authentication is working
3. Confirm environment variables are set
4. Review the WebSocket provider implementation in `src/components/providers/WebSocketProvider.tsx`

## Advanced Configuration

To modify WebSocket settings, edit `src/components/providers/WebSocketProvider.tsx`:

```tsx
const stompClient = new Client({
  webSocketFactory: () => socket,
  connectHeaders: {
    Authorization: `Bearer ${session.accessToken}`,
  },
  reconnectDelay: 3000, // Adjust reconnection delay
  heartbeatIncoming: 4000, // Adjust heartbeat intervals
  heartbeatOutgoing: 4000,
  debug: (str) => console.log(str), // Enable/disable debug logs
});
```
