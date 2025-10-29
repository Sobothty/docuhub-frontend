# API Notification System

A modern, beautiful notification component for displaying alerts during API operations (create, update, delete, etc.).

## Features

- 🎨 **Beautiful Design**: Modern UI with gradients, animations, and smooth transitions
- 🎯 **Multiple Types**: Success, Error, Warning, Info, and Loading states
- ⚡ **Auto-close**: Automatically closes after a specified duration (with progress bar)
- 🔄 **Loading State**: Special state for ongoing operations
- 🎭 **Dark Mode**: Fully supports dark/light themes
- 📱 **Responsive**: Works great on all screen sizes
- ♿ **Accessible**: Proper ARIA labels and keyboard support

## Installation

The component is already installed in your project at:

- `src/components/ui/api-notification.tsx`

## Usage

### Basic Setup

1. **Import the hook in your component:**

```typescript
import { useApiNotification } from "@/components/ui/api-notification";
```

2. **Use the hook in your component:**

```typescript
export default function YourComponent() {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    closeNotification,
    NotificationComponent,
  } = useApiNotification();

  // Your component logic...

  return (
    <div>
      {/* Your component JSX */}

      {/* Add the notification component at the end */}
      {NotificationComponent}
    </div>
  );
}
```

### Notification Types

#### 1. Success Notification

Use for successful operations (create, update, etc.)

```typescript
showSuccess("Operation Successful!", "Your data has been saved successfully.");
```

#### 2. Error Notification

Use for failed operations

```typescript
showError("Operation Failed", "Something went wrong. Please try again.");
```

#### 3. Warning Notification

Use for warnings or confirmations

```typescript
showWarning("Are you sure?", "This action cannot be undone.");
```

#### 4. Info Notification

Use for informational messages

```typescript
showInfo("Information", "Your request is being processed.");
```

#### 5. Loading Notification

Use during API calls (does not auto-close)

```typescript
showLoading("Processing...", "Please wait while we process your request.");
```

To close a loading notification:

```typescript
closeNotification();
```

## Real-World Examples

### Example 1: Create Operation

```typescript
const handleCreate = async (data: FormData) => {
  // Show loading
  showLoading(
    "Creating Document",
    "Please wait while we create your document..."
  );

  try {
    const result = await createDocument(data).unwrap();

    // Close loading and show success
    closeNotification();
    setTimeout(() => {
      showSuccess(
        "Document Created!",
        "Your document has been successfully created and submitted for review."
      );
    }, 100);

    // Reset form or redirect
    resetForm();
  } catch (error) {
    // Close loading and show error
    closeNotification();
    setTimeout(() => {
      showError(
        "Creation Failed",
        "Failed to create document. Please check your inputs and try again."
      );
    }, 100);
  }
};
```

### Example 2: Update Operation

```typescript
const handleUpdate = async (id: string, data: UpdateData) => {
  showLoading("Updating...", "Saving your changes...");

  try {
    await updateDocument({ id, data }).unwrap();

    closeNotification();
    setTimeout(() => {
      showSuccess("Updated Successfully!", "Your changes have been saved.");
    }, 100);
  } catch (error) {
    closeNotification();
    setTimeout(() => {
      showError(
        "Update Failed",
        "Failed to save your changes. Please try again."
      );
    }, 100);
  }
};
```

### Example 3: Delete Operation

```typescript
const handleDelete = async (id: string) => {
  // First show warning
  showWarning(
    "Delete Confirmation",
    "Are you sure you want to delete this item? This action cannot be undone."
  );

  // In a real app, you'd wait for user confirmation
  // Then proceed with delete:
  showLoading("Deleting...", "Please wait...");

  try {
    await deleteDocument(id).unwrap();

    closeNotification();
    setTimeout(() => {
      showSuccess("Deleted Successfully!", "The item has been removed.");
    }, 100);
  } catch (error) {
    closeNotification();
    setTimeout(() => {
      showError(
        "Delete Failed",
        "Failed to delete the item. Please try again."
      );
    }, 100);
  }
};
```

### Example 4: File Upload

```typescript
const handleFileUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await uploadFile(formData).unwrap();

    showSuccess(
      "File Uploaded!",
      `${file.name} has been uploaded successfully.`
    );
  } catch (error) {
    showError(
      "Upload Failed",
      `Failed to upload ${file.name}. Please try again.`
    );
  }
};
```

### Example 5: Form Validation

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  if (!formData.title || !formData.description) {
    showWarning("Missing Information", "Please fill in all required fields.");
    return;
  }

  // Proceed with submission
  handleCreate(formData);
};
```

## Customization

### Auto-close Duration

By default, notifications auto-close after 4 seconds (except loading). You can customize this:

```typescript
// In api-notification.tsx, modify the default value:
autoCloseDuration?: number; // default is 4000ms
```

### Colors and Styling

The notification colors are configured in the `notificationConfig` object in `api-notification.tsx`:

```typescript
const notificationConfig = {
  success: {
    gradient: "from-green-500 to-emerald-600",
    iconBg: "#10b981",
    textColor: "#059669",
    // ...
  },
  // Other types...
};
```

## Best Practices

1. **Always close loading notifications**: Don't forget to call `closeNotification()` after showing a loading state.

2. **Use setTimeout for sequential notifications**: When showing a new notification immediately after closing one, use a small timeout (100ms) to ensure smooth transitions.

3. **Provide clear messages**: Use descriptive titles and messages that help users understand what happened.

4. **Don't overuse**: Only show notifications for important events, not for every minor action.

5. **Test error cases**: Make sure to handle and display errors appropriately.

## Integration Checklist

When adding notifications to a new page/component:

- [ ] Import `useApiNotification` hook
- [ ] Destructure the needed functions from the hook
- [ ] Add `{NotificationComponent}` to your JSX (at the end)
- [ ] Replace all `alert()` calls with appropriate notification methods
- [ ] Add loading states to async operations
- [ ] Handle error cases with error notifications
- [ ] Test all notification types in your component

## Browser Support

Works in all modern browsers that support:

- CSS Grid
- CSS Animations
- React 18+
- Next.js 14+

## Accessibility

- Uses semantic HTML
- Proper ARIA roles and labels
- Keyboard accessible (ESC to close)
- Screen reader friendly

## Related Files

- Component: `src/components/ui/api-notification.tsx`
- Example: `src/components/ui/api-notification-example.tsx`
- Implementation: `src/app/student/proposals/page.tsx`

## Support

For issues or questions, refer to:

- The example file: `src/components/ui/api-notification-example.tsx`
- The implementation in: `src/app/student/proposals/page.tsx`
