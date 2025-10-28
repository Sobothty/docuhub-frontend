# WebSocket Indicator Locations

## Visual Guide

This document shows exactly where the WebSocket status indicators are located in your application.

---

## 🌐 Public Pages (Navbar)

When users are on public pages (Home, Browse, About, Contact), the indicator appears in the navbar:

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]    Home  Browse  About  Contact    [🟢]  [🌙]  [👤]│  ← Navbar
└─────────────────────────────────────────────────────────────┘
                                                ↑
                                    WebSocket Indicator
                                    (Next to theme toggle)
```

### Desktop Navbar

- **Position**: Top right section
- **Next to**: Theme toggle button (moon/sun icon)
- **Before**: User profile dropdown

### Mobile Navbar

- **Position**: Top bar, before user avatar
- **Visible**: When navbar is expanded

---

## 📊 Dashboard Pages (Sidebar)

When users are on dashboard pages (Student, Adviser, Admin, Profile), the indicator appears in the sidebar:

### Expanded Sidebar (Desktop & Mobile)

```
┌──────────────────────┐
│ [📚] DocuHub    [🟢] │  ← Sidebar Header with Indicator
│ Student Portal       │
├──────────────────────┤
│ [👤] John Doe    ⌄  │  ← User Profile
│ Student Account      │
├──────────────────────┤
│ [🏠] Overview        │  ← Navigation
│ [📋] Documents       │
│ [📤] Submissions     │
│ [💬] Feedback        │
│ [⭐] Favorites       │
│ [⚙️]  Settings       │
└──────────────────────┘
         ↑
WebSocket Indicator
(Top right of header)
```

### Collapsed Sidebar (Desktop)

```
┌────┐
│ 📚 │ ← Sidebar with just icons
│ 🟢 │ ← WebSocket Indicator still visible
├────┤
│ 👤 │
├────┤
│ 🏠 │
│ 📋 │
│ 📤 │
│ 💬 │
│ ⭐ │
│ ⚙️  │
└────┘
```

---

## 📱 Responsive Behavior

### Desktop (> 768px)

- **Navbar**: Indicator always visible in top right
- **Sidebar**: Indicator always visible in header (expanded or collapsed)

### Mobile (< 768px)

- **Navbar**: Indicator visible when logged in
- **Sidebar**: Indicator visible when sidebar is open

---

## 🎨 Visual States

### Connected (🟢)

- **Color**: Green (`bg-green-500`)
- **Animation**: Pulsing effect
- **Tooltip**: "Connected"

### Disconnected (⚫)

- **Color**: Gray (`bg-gray-400`)
- **Animation**: None (static)
- **Tooltip**: "Disconnected"

---

## 📐 Exact Positions

### Navbar Implementation

**File**: `src/components/header/NavbarUser.tsx`

**Desktop** (Line ~200-203):

```tsx
<div className="hidden md:flex items-center space-x-2 lg:space-x-4">
  {/* WebSocket Status Indicator */}
  <WebSocketStatus variant="dot" className="mr-1" />
  <button onClick={toggleDarkMode}>...</button>
  ...
</div>
```

**Mobile** (Line ~307-312):

```tsx
<div className="md:hidden flex items-center space-x-2">
  {/* WebSocket Status Indicator */}
  <WebSocketStatus variant="dot" />
  <DropdownMenu>...</DropdownMenu>
  ...
</div>
```

### Sidebar Implementation

**File**: `src/components/layout/sidebar.tsx`

**Header Section** (Line ~147-176):

```tsx
<div className="flex items-center justify-between p-4 border-b">
  <div className="flex items-center gap-2 flex-1">
    <BookOpen className="h-6 w-6" />
    {isOpen && <div>Logo & Portal Name</div>}
  </div>
  {/* WebSocket Status Indicator */}
  <div className="ml-auto">
    <WebSocketStatus variant="dot" />
  </div>
</div>
```

---

## 🔍 How to Locate

### Quick Check

1. **Log in** to your account
2. Look for a **small dot** (3x3 pixels):
   - **Public pages**: Top right navbar
   - **Dashboard pages**: Sidebar header (top right)
3. If green and pulsing → **Connected** ✅
4. If gray and static → **Disconnected** ❌

### Browser DevTools

1. Open DevTools (F12)
2. Inspect the navbar or sidebar
3. Search for `WebSocketStatus` component
4. Check connection status in console logs

---

## 🚀 Testing the Indicator

### Test Connection Status

1. **Start your app** and log in
2. **Check navbar/sidebar** - should see green pulsing dot
3. **Open DevTools Console** - look for:
   ```
   🔌 Initializing WebSocket connection...
   ✅ WebSocket connected successfully
   📡 Subscribing to topic: /topic/user.{uuid}
   ```
4. **Disable network** (DevTools > Network > Offline)
5. **Check indicator** - should turn gray
6. **Re-enable network** - should turn green again

### Test on Different Pages

- ✅ **Home page** (logged in) → Navbar indicator
- ✅ **Browse page** → Navbar indicator
- ✅ **Student dashboard** → Sidebar indicator
- ✅ **Adviser dashboard** → Sidebar indicator
- ✅ **Profile page** → Sidebar indicator

---

## 💡 Tips

### For Developers

- The indicator uses the `useWebSocket()` hook
- Updates automatically when connection state changes
- No manual refresh needed

### For Users

- Green dot = Real-time features active
- Gray dot = Check your internet connection
- Hover over dot to see status text

---

## 🎯 Summary

| Location    | Position                       | Visibility       | Pages                    |
| ----------- | ------------------------------ | ---------------- | ------------------------ |
| **Navbar**  | Top right, before theme toggle | Desktop & Mobile | Public pages (logged in) |
| **Sidebar** | Header section, top right      | Desktop & Mobile | All dashboards           |

**Quick Rule**: If you're logged in, you'll see the indicator!

- Public pages → Check the navbar
- Dashboard pages → Check the sidebar

---

## 📚 Related Documentation

- [WebSocket Setup Guide](./WEBSOCKET_SETUP.md)
- [Status Indicator Usage](./WEBSOCKET_STATUS_INDICATOR.md)
- [Implementation Summary](../WEBSOCKET_IMPLEMENTATION.md)
