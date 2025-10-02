import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Search, Calendar, User } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function MyDownloads() {
  const downloads = [
    {
      id: 1,
      title: "Deep Learning Fundamentals: A Comprehensive Guide",
      author: "Dr. Sarah Chen",
      downloadDate: "2024-01-15",
      category: "Machine Learning",
      size: "2.4 MB",
    },
    {
      id: 2,
      title: "Ethical Considerations in AI Development",
      author: "Prof. Michael Rodriguez",
      downloadDate: "2024-01-12",
      category: "AI Ethics",
      size: "1.8 MB",
    },
    {
      id: 3,
      title: "Computer Vision Applications in Healthcare",
      author: "Dr. Emily Watson",
      downloadDate: "2024-01-10",
      category: "Computer Vision",
      size: "3.1 MB",
    },
    {
      id: 4,
      title: "Natural Language Processing Techniques",
      author: "Dr. James Liu",
      downloadDate: "2024-01-08",
      category: "NLP",
      size: "2.7 MB",
    },
  ]

  return (
      <DashboardLayout userRole="public">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Downloads</h1>
            <p className="text-muted-foreground">Papers you&apos;ve downloaded from the platform</p>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search your downloads..." className="pl-10" />
                  </div>
                </div>
                <Button variant="outline">Filter</Button>
              </div>
            </CardContent>
          </Card>

          {/* Downloads List */}
          <div className="space-y-4">
            {downloads.map((paper) => (
                <Card key={paper.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{paper.title}</h3>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {paper.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Downloaded {paper.downloadDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {paper.size}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{paper.category}</Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Re-download
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>

          {/* Download Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Download Statistics</CardTitle>
              <CardDescription>Your download activity overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24</div>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">8.2 MB</div>
                  <p className="text-sm text-muted-foreground">Total Size</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">6</div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
  )
}