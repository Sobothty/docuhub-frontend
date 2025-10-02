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
import { Save, User, Bell, LinkIcon, Shield } from 'lucide-react';

const researchInterests = [
  'Machine Learning',
  'Data Science',
  'Healthcare Technology',
  'Artificial Intelligence',
  'Computer Vision',
];

export default function MentorSettingsPage() {
  return (
    <DashboardLayout
      userRole="mentor"
      userName="Dr. Sarah Johnson"
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
                <Input id="name" defaultValue="Dr. Sarah Johnson" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  defaultValue="Professor of Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  defaultValue="Computer Science Department"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input id="university" defaultValue="Stanford University" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue="Professor specializing in machine learning and artificial intelligence with over 15 years of research experience."
                />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Research Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Research Interests</CardTitle>
              <CardDescription>Manage your areas of expertise</CardDescription>
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
                <Label htmlFor="orcid">ORCID</Label>
                <Input
                  id="orcid"
                  placeholder="https://orcid.org/0000-0000-0000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Personal Website</Label>
                <Input id="website" placeholder="https://yourwebsite.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-scholar">Google Scholar</Label>
                <Input
                  id="google-scholar"
                  placeholder="https://scholar.google.com/citations?user="
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
                  <Label>New Student Assignments</Label>
                  <p className="text-sm text-muted-foreground">
                    When new students are assigned to you
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Submission Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    When students submit papers for review
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mentorship Requests</Label>
                  <p className="text-sm text-muted-foreground">
                    When students request mentorship
                  </p>
                </div>
                <Switch defaultChecked />
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

          {/* Contact Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How students can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="sarah.johnson@stanford.edu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="office">Office Location</Label>
                <Input id="office" defaultValue="Gates Building, Room 392" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="office-hours">Office Hours</Label>
                <Input
                  id="office-hours"
                  defaultValue="Tuesdays & Thursdays, 2-4 PM"
                />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Contact Info
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
