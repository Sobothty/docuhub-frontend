import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Link, X } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function PublicUserSettings() {
  return (
      <DashboardLayout userRole="public">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and profile settings</p>
          </div>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your public profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title/Position</Label>
                  <Input id="title" defaultValue="Independent Researcher" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    defaultValue="Passionate about exploring the intersection of artificial intelligence and ethical computing. Interested in contributing to open research and academic discussions."
                    rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Research Interests</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Machine Learning
                    <X className="h-3 w-3 cursor-pointer" />
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Data Science
                    <X className="h-3 w-3 cursor-pointer" />
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Computer Vision
                    <X className="h-3 w-3 cursor-pointer" />
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    AI Ethics
                    <X className="h-3 w-3 cursor-pointer" />
                  </Badge>
                </div>
                <Input placeholder="Add new research interest..." />
              </div>

              <Button>Save Profile Changes</Button>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Social Links
              </CardTitle>
              <CardDescription>Add links to your professional profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" placeholder="https://linkedin.com/in/yourprofile" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orcid">ORCID</Label>
                <Input id="orcid" placeholder="https://orcid.org/0000-0000-0000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Personal Website</Label>
                <Input id="website" placeholder="https://yourwebsite.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input id="twitter" placeholder="https://twitter.com/yourusername" />
              </div>
              <Button>Save Social Links</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what notifications you&apos;d like to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email updates about your activity</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="comment-replies">Comment Replies</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone replies to your comments</p>
                </div>
                <Switch id="comment-replies" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-papers">New Papers</Label>
                  <p className="text-sm text-muted-foreground">Notifications about new papers in your interests</p>
                </div>
                <Switch id="new-papers" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-digest">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">Weekly summary of platform activity</p>
                </div>
                <Switch id="weekly-digest" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Security
              </CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
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
              <Button>Update Password</Button>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your profile visibility and data preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public-profile">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                </div>
                <Switch id="public-profile" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-activity">Show Activity</Label>
                  <p className="text-sm text-muted-foreground">Display your download and comment activity</p>
                </div>
                <Switch id="show-activity" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-analytics">Analytics</Label>
                  <p className="text-sm text-muted-foreground">Help improve the platform with usage analytics</p>
                </div>
                <Switch id="data-analytics" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Delete Account</Label>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
  )
}