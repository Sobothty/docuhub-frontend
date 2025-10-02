import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Calendar, ThumbsUp, Reply } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function MyDiscussions() {
  const discussions = [
    {
      id: 1,
      paperTitle: "Neural Network Architectures for Computer Vision",
      comment:
          "This paper provides excellent insights into CNN architectures. The comparison between ResNet and DenseNet is particularly valuable.",
      date: "2024-01-14",
      likes: 5,
      replies: 2,
      status: "active",
    },
    {
      id: 2,
      paperTitle: "Ethical AI Considerations in Healthcare",
      comment:
          "I appreciate the discussion on bias mitigation. However, I think the paper could benefit from more real-world case studies.",
      date: "2024-01-12",
      likes: 8,
      replies: 4,
      status: "active",
    },
    {
      id: 3,
      paperTitle: "Deep Learning Fundamentals",
      comment: "Great introduction to the field! The mathematical explanations are clear and accessible.",
      date: "2024-01-10",
      likes: 3,
      replies: 1,
      status: "resolved",
    },
    {
      id: 4,
      paperTitle: "Natural Language Processing Techniques",
      comment:
          "The transformer architecture explanation is comprehensive. Would love to see more on attention mechanisms.",
      date: "2024-01-08",
      likes: 6,
      replies: 3,
      status: "active",
    },
  ]

  return (
      <DashboardLayout userRole="public">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Discussions</h1>
            <p className="text-muted-foreground">Comments and discussions you&apos;ve participated in</p>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search your comments and discussions..." className="pl-10" />
                  </div>
                </div>
                <Button variant="outline">Filter</Button>
              </div>
            </CardContent>
          </Card>

          {/* Discussions List */}
          <div className="space-y-4">
            {discussions.map((discussion) => (
                <Card key={discussion.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2">{discussion.paperTitle}</h3>

                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant={discussion.status === "active" ? "default" : "secondary"}>
                              {discussion.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {discussion.date}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-foreground">{discussion.comment}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {discussion.likes} likes
                          </div>
                          <div className="flex items-center gap-1">
                            <Reply className="h-4 w-4" />
                            {discussion.replies} replies
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View Thread
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>

          {/* Discussion Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Discussion Statistics</CardTitle>
              <CardDescription>Your engagement activity overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">8</div>
                  <p className="text-sm text-muted-foreground">Total Comments</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">22</div>
                  <p className="text-sm text-muted-foreground">Likes Received</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10</div>
                  <p className="text-sm text-muted-foreground">Replies Received</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">6</div>
                  <p className="text-sm text-muted-foreground">Active Threads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
  )
}