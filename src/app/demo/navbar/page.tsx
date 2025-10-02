'use client';

import AuthDemo from '@/components/demo/AuthDemo';

export default function NavbarDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Navbar Authentication Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This page demonstrates the dynamic navbar functionality that switches between 
            guest mode (with Sign Up button) and user mode (with user profile dropdown) 
            based on authentication status.
          </p>
        </div>

        {/* Demo Component */}
        <div className="flex justify-center">
          <AuthDemo />
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">How to Test:</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>
              <strong>Guest Mode:</strong> When not logged in, you&apos;ll see the NavbarGuest with:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Basic navigation links (Home, Browse, About, Contact)</li>
                <li>Dark/Light mode toggle</li>
                <li>Language switcher (EN/KH)</li>
                <li>Sign Up button</li>
              </ul>
            </li>
            <li>
              <strong>User Mode:</strong> Click &quot;Login (Demo)&quot; to switch to NavbarUser with:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Same navigation links with enhanced styling</li>
                <li>Notification bell icon</li>
                <li>Bookmarks/favorites icon</li>
                <li>User profile dropdown with:</li>
                <ul className="list-disc list-inside ml-8">
                  <li>User avatar and name</li>
                  <li>Role badge (Student/Mentor/Admin)</li>
                  <li>Profile, Settings, Notifications, Saved Papers links</li>
                  <li>Logout functionality</li>
                </ul>
              </ul>
            </li>
            <li>
              <strong>Responsive Design:</strong> The navbar adapts to mobile screens with:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Collapsible hamburger menu</li>
                <li>Smooth animations and transitions</li>
                <li>Touch-friendly interface elements</li>
              </ul>
            </li>
          </ol>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-card border rounded-lg space-y-3">
            <h3 className="text-lg font-semibold text-green-600">✅ Features Implemented</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Dynamic navbar based on auth state</li>
              <li>• Real-time user data integration</li>
              <li>• Smooth animations and transitions</li>
              <li>• Mobile-responsive design</li>
              <li>• User profile dropdown with actions</li>
              <li>• Role-based user badges</li>
              <li>• Loading states and error handling</li>
              <li>• Cross-tab authentication sync</li>
            </ul>
          </div>
          
          <div className="p-6 bg-card border rounded-lg space-y-3">
            <h3 className="text-lg font-semibold text-blue-600">🚀 Ready for Integration</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Connect to your auth API endpoints</li>
              <li>• Replace demo login with real auth</li>
              <li>• Add JWT token management</li>
              <li>• Implement protected routes</li>
              <li>• Add notification system</li>
              <li>• Connect user settings pages</li>
              <li>• Add user avatar upload</li>
              <li>• Implement role-based permissions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}