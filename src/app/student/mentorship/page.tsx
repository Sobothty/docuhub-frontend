import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquare, Calendar, Award, Search, UserPlus } from 'lucide-react';

// Mock current mentor data
const currentMentor = {
  name: 'Dr. Sarah Johnson',
  title: 'Professor of Computer Science',
  department: 'Computer Science Department',
  university: 'Stanford University',
  avatar: '/placeholder.svg?height=60&width=60',
  assignedDate: '2024-01-15',
  totalInteractions: 12,
  papersGuided: 3,
  researchInterests: ['Machine Learning', 'AI', 'Healthcare Technology'],
  bio: 'Professor specializing in machine learning and artificial intelligence with over 15 years of research experience.',
};

// Mock interaction history
const interactionHistory = [
  {
    date: '2024-03-15',
    type: 'feedback',
    title: 'Paper Review - Climate Change Analysis',
    description: 'Provided detailed feedback on methodology and data analysis',
  },
  {
    date: '2024-03-12',
    type: 'approval',
    title: 'Paper Approved - ML in Healthcare',
    description: 'Approved paper for publication with minor suggestions',
  },
  {
    date: '2024-03-08',
    type: 'meeting',
    title: 'Weekly Check-in Meeting',
    description: 'Discussed progress on current research and next steps',
  },
  {
    date: '2024-03-05',
    type: 'feedback',
    title: 'Revision Request - Economic Recovery',
    description: 'Requested revisions to strengthen statistical analysis',
  },
];

// Mock available mentors for application
const availableMentors = [
  {
    name: 'Dr. Michael Chen',
    title: 'Associate Professor',
    department: 'Data Science',
    university: 'MIT',
    avatar: '/placeholder.svg?height=40&width=40',
    researchInterests: ['Data Mining', 'Big Data', 'Analytics'],
    studentsGuided: 23,
  },
  {
    name: 'Prof. Emily Rodriguez',
    title: 'Professor',
    department: 'Computer Science',
    university: 'Harvard',
    avatar: '/placeholder.svg?height=40&width=40',
    researchInterests: ['Cybersecurity', 'Network Security', 'Privacy'],
    studentsGuided: 31,
  },
];

export default function StudentMentorshipPage() {
  return (
    <DashboardLayout
      userRole="student"
      userName="Sarah Chen"
      userAvatar="/placeholder.svg?height=40&width=40"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mentorship</h1>
            <p className="text-muted-foreground">
              Manage your mentor relationship and explore opportunities
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Find New Mentor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Apply for Additional Mentorship</DialogTitle>
                <DialogDescription>
                  Find mentors who match your research interests
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by research area or mentor name..."
                    className="pl-10"
                  />
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {availableMentors.map((mentor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={mentor.avatar || '/placeholder.svg'}
                            alt={mentor.name}
                          />
                          <AvatarFallback>
                            {mentor.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{mentor.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {mentor.title} • {mentor.department}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mentor.researchInterests
                              .slice(0, 2)
                              .map((interest, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {interest}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Apply</Button>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current Mentor */}
        <Card>
          <CardHeader>
            <CardTitle>Current Mentor</CardTitle>
            <CardDescription>
              Your assigned mentor and relationship details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={currentMentor.avatar || '/placeholder.svg'}
                    alt={currentMentor.name}
                  />
                  <AvatarFallback className="text-lg">
                    {currentMentor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {currentMentor.name}
                  </h3>
                  <p className="text-muted-foreground">{currentMentor.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentMentor.department}, {currentMentor.university}
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {currentMentor.totalInteractions}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Interactions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {currentMentor.papersGuided}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Papers Guided
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-muted-foreground">Months</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentMentor.researchInterests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Interaction History</CardTitle>
            <CardDescription>
              Timeline of your mentorship activities and communications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interactionHistory.map((interaction, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 border border-border rounded-lg"
                >
                  <div className="flex-shrink-0 mt-1">
                    {interaction.type === 'feedback' && (
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    )}
                    {interaction.type === 'approval' && (
                      <Award className="h-4 w-4 text-green-600" />
                    )}
                    {interaction.type === 'meeting' && (
                      <Calendar className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{interaction.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        {interaction.date}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {interaction.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mentorship Application */}
        <Card>
          <CardHeader>
            <CardTitle>Apply for Mentorship</CardTitle>
            <CardDescription>
              Request mentorship from additional faculty members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="research-area">Research Area of Interest</Label>
                <Input
                  id="research-area"
                  placeholder="e.g., Machine Learning, Data Science, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="application-message">Application Message</Label>
                <Textarea
                  id="application-message"
                  placeholder="Explain why you're interested in this mentorship and what you hope to achieve..."
                />
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Submit Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
