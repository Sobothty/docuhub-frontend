import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Download, MessageSquare, ExternalLink, Mail } from "lucide-react"

interface PublicUserProfileProps {
  user: {
    id: string
    name: string
    title: string
    bio: string
    researchInterests: string[]
    joinDate: string
    stats: {
      downloads: number
      comments: number
      savedPapers: number
    }
    socialLinks: {
      linkedin?: string
      orcid?: string
      website?: string
      twitter?: string
    }
    isPublic: boolean
  }
}

export default function PublicUserProfile({ user }: PublicUserProfileProps) {
  if (!user.isPublic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Profile Not Public</h2>
            <p className="text-muted-foreground">This user has chosen to keep their profile private.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-1">{user.name}</h1>
                  <p className="text-xl text-muted-foreground mb-3">{user.title}</p>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    Member since {user.joinDate}
                  </div>

                  <p className="text-foreground mb-4">{user.bio}</p>

                  <div className="flex gap-2">
                    <Button>
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline">Follow</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Research Interests */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Research Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.researchInterests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Activity Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Download className="h-5 w-5 text-muted-foreground" />
                        <span className="text-2xl font-bold text-primary">{user.stats.downloads}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Downloads</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <span className="text-2xl font-bold text-primary">{user.stats.comments}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Comments</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Download className="h-5 w-5 text-muted-foreground" />
                        <span className="text-2xl font-bold text-primary">{user.stats.savedPapers}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Saved Papers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Links */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.socialLinks.linkedin && (
                    <a
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {user.socialLinks.orcid && (
                    <a
                      href={user.socialLinks.orcid}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      ORCID
                    </a>
                  )}
                  {user.socialLinks.website && (
                    <a
                      href={user.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {user.socialLinks.twitter && (
                    <a
                      href={user.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Twitter/X
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
