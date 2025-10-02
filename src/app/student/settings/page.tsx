import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Save,
  User,
  Bell,
  LinkIcon,
  Shield,
  GraduationCap,
} from 'lucide-react';

const researchInterests = [
  'Machine Learning',
  'Healthcare Technology',
  'Data Analysis',
  'Computer Vision',
];

export default function StudentSettingsPage() {
  return (
    <DashboardLayout
      userRole="student"
      userName="Sarah Chen"
      userAvatar="/placeholder.svg?height=40&width=40"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and account preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your public profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Sarah Chen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School/University</Label>
                <Input id="school" defaultValue="Stanford University" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Academic Year</Label>
                <Input id="year" defaultValue="Graduate Student - 2nd Year" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Major/Field of Study</Label>
                <Input id="major" defaultValue="Computer Science" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue="Graduate student passionate about machine learning applications in healthcare. Currently working on research projects involving AI-driven diagnostic tools."
                />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Information
              </CardTitle>
              <CardDescription>
                Your academic details and achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input id="student-id" defaultValue="SC2024001" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpa">Current GPA</Label>
                <Input id="gpa" defaultValue="3.85" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected-graduation">Expected Graduation</Label>
                <Input id="expected-graduation" defaultValue="May 2025" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advisor">Academic Advisor</Label>
                <Input id="advisor" defaultValue="Dr. Sarah Johnson" disabled />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Update Academic Info
              </Button>
            </CardContent>
          </Card>

          {/* Research Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Research Interests</CardTitle>
              <CardDescription>
                Manage your areas of academic interest
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {researchInterests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                  >
                    {interest} ×
                  </Badge>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-interest">Add New Interest</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-interest"
                    placeholder="Enter research interest"
                  />
                  <Button size="sm">Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Social Links
              </CardTitle>
              <CardDescription>
                Add links to your professional profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio Website</Label>
                <Input id="portfolio" placeholder="https://yourportfolio.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orcid">ORCID (Optional)</Label>
                <Input
                  id="orcid"
                  placeholder="https://orcid.org/0000-0000-0000-0000"
                />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Links
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mentor Feedback</Label>
                  <p className="text-sm text-muted-foreground">
                    When mentors provide feedback on your work
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Submission Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Status changes on your paper submissions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mentorship Opportunities</Label>
                  <p className="text-sm text-muted-foreground">
                    New mentorship opportunities and matches
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
