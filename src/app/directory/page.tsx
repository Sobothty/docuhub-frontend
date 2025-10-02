import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, GraduationCap, User, MapPin } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mentors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Professor of Computer Science",
    department: "Computer Science",
    university: "Stanford University",
    avatar: "/diverse-professor-lecturing.png",
    researchInterests: ["Machine Learning", "AI Ethics", "Natural Language Processing"],
    stats: { studentsGuided: 15, papersApproved: 42 },
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    title: "Associate Professor",
    department: "Data Science",
    university: "MIT",
    avatar: "/diverse-professor-lecturing.png",
    researchInterests: ["Deep Learning", "Computer Vision", "Robotics"],
    stats: { studentsGuided: 23, papersApproved: 38 },
  },
]

const students = [
  {
    id: "1",
    name: "Emily Rodriguez",
    school: "Harvard University",
    year: "PhD Candidate",
    major: "Artificial Intelligence",
    avatar: "/diverse-students-studying.png",
    researchInterests: ["Neural Networks", "Computer Vision"],
    stats: { papersPublished: 3, papersInProgress: 2 },
  },
  {
    id: "2",
    name: "James Wilson",
    school: "UC Berkeley",
    year: "Master's Student",
    major: "Data Science",
    avatar: "/diverse-students-studying.png",
    researchInterests: ["Machine Learning", "Statistics"],
    stats: { papersPublished: 1, papersInProgress: 3 },
  },
]

const publicUsers = [
  {
    id: "1",
    name: "Dr. Lisa Park",
    title: "Research Scientist",
    bio: "Independent researcher focusing on AI applications in healthcare",
    avatar: "/diverse-research-team.png",
    researchInterests: ["Healthcare AI", "Medical Imaging", "Ethics"],
    stats: { downloads: 156, comments: 23 },
  },
  {
    id: "2",
    name: "Alex Thompson",
    title: "Industry Professional",
    bio: "Software engineer with interests in academic research collaboration",
    avatar: "/professional-teamwork.png",
    researchInterests: ["Software Engineering", "AI Applications"],
    stats: { downloads: 89, comments: 15 },
  },
]

export default function DirectoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">IPUB Directory</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Discover mentors, students, and researchers in our academic community
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search by name, research interests, or institution..." className="pl-10" />
              </div>
            </div>
          </div>

          {/* Directory Tabs */}
          <Tabs defaultValue="mentors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mentors" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Mentors ({mentors.length})
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Students ({students.length})
              </TabsTrigger>
              <TabsTrigger value="public" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Public Users ({publicUsers.length})
              </TabsTrigger>
            </TabsList>

            {/* Mentors Tab */}
            <TabsContent value="mentors" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mentors.map((mentor) => (
                  <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-4">
                        <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                        <AvatarFallback className="text-lg">
                          {mentor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <CardDescription>{mentor.title}</CardDescription>
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {mentor.university}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-1">
                          {mentor.researchInterests.slice(0, 2).map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {mentor.researchInterests.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{mentor.researchInterests.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-primary">{mentor.stats.studentsGuided}</div>
                            <div className="text-xs text-muted-foreground">Students</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-primary">{mentor.stats.papersApproved}</div>
                            <div className="text-xs text-muted-foreground">Papers</div>
                          </div>
                        </div>

                        <Link href={`/mentors/${mentor.id}`}>
                          <Button className="w-full">View Profile</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                  <Card key={student.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-4">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback className="text-lg">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>{student.year}</CardDescription>
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {student.school}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-1">
                          {student.researchInterests.slice(0, 2).map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {student.researchInterests.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{student.researchInterests.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-primary">{student.stats.papersPublished}</div>
                            <div className="text-xs text-muted-foreground">Published</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-primary">{student.stats.papersInProgress}</div>
                            <div className="text-xs text-muted-foreground">In Progress</div>
                          </div>
                        </div>

                        <Link href={`/students/${student.id}`}>
                          <Button className="w-full">View Profile</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Public Users Tab */}
            <TabsContent value="public" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {publicUsers.map((user) => (
                  <Card key={user.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-4">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="text-lg">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription>{user.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>

                        <div className="flex flex-wrap gap-1">
                          {user.researchInterests.slice(0, 2).map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {user.researchInterests.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.researchInterests.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-primary">{user.stats.downloads}</div>
                            <div className="text-xs text-muted-foreground">Downloads</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-primary">{user.stats.comments}</div>
                            <div className="text-xs text-muted-foreground">Comments</div>
                          </div>
                        </div>

                        <Link href={`/users/${user.id}`}>
                          <Button className="w-full">View Profile</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
