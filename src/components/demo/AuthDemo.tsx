'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, LogIn, LogOut } from 'lucide-react';

export default function AuthDemo() {
  const { user, isAuthenticated, signIn, signOut, isLoading } = useAuth();
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateLogin = async () => {
    setIsSimulating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on our auth types
    const mockUser = {
      slug: "test-user",
      uuid: "test-uuid-123",
      userName: "demo_user",
      gender: null,
      email: "demo@example.com",
      fullName: "Demo User",
      firstName: "Demo",
      lastName: "User",
      imageUrl: null,
      status: null,
      createDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
      bio: "This is a demo user for testing the navbar functionality.",
      address: null,
      contactNumber: null,
      telegramId: null,
      isUser: true,
      isAdmin: false,
      isStudent: true,
      isAdvisor: false
    };

    // Simulate login with mock token and user data
    login('mock-jwt-token-123', mockUser);
    setIsSimulating(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Authentication Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated && user ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold">Logged in as:</h3>
              <p className="text-sm text-muted-foreground">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                {user.isStudent && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Student</span>}
                {user.isAdvisor && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Mentor</span>}
                {user.isAdmin && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Admin</span>}
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Logout (Test)
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Click the button below to simulate a login and see the navbar change from guest to user mode.
            </p>
            <Button 
              onClick={simulateLogin} 
              disabled={isSimulating} 
              className="w-full"
            >
              {isSimulating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login (Demo)
                </>
              )}
            </Button>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
          <strong>Note:</strong> This is a demo component. In a real application, you would integrate with your actual authentication system.
        </div>
      </CardContent>
    </Card>
  );
}