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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Upload,
  FileText,
  Download,
  MoreHorizontal,
  Eye,
  Trash2,
} from 'lucide-react';

// Mock resource data
const resources = [
  {
    id: 1,
    title: 'Research Methodology Guide',
    description: 'Comprehensive guide for conducting academic research',
    type: 'PDF',
    size: '2.4 MB',
    uploadDate: '2024-03-10',
    downloads: 45,
    category: 'Guide',
  },
  {
    id: 2,
    title: 'Data Analysis Templates',
    description: 'Excel templates for statistical analysis',
    type: 'XLSX',
    size: '856 KB',
    uploadDate: '2024-03-08',
    downloads: 32,
    category: 'Template',
  },
  {
    id: 3,
    title: 'Citation Style Examples',
    description: 'Examples of proper academic citations',
    type: 'DOCX',
    size: '1.2 MB',
    uploadDate: '2024-03-05',
    downloads: 67,
    category: 'Reference',
  },
  {
    id: 4,
    title: 'Machine Learning Basics',
    description: 'Introduction to ML concepts and algorithms',
    type: 'PDF',
    size: '3.8 MB',
    uploadDate: '2024-02-28',
    downloads: 89,
    category: 'Tutorial',
  },
];

const categories = ['All', 'Guide', 'Template', 'Reference', 'Tutorial'];

export default function MentorResourcesPage() {
  return (
    <DashboardLayout userRole="mentor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Resources</h1>
            <p className="text-muted-foreground">
              Share materials and resources with your students
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Resource</DialogTitle>
                <DialogDescription>
                  Share a resource with your assigned students
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="res-title">Title</Label>
                  <Input id="res-title" placeholder="Enter resource title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="res-desc">Description</Label>
                  <Textarea
                    id="res-desc"
                    placeholder="Brief description of the resource"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="res-category">Category</Label>
                    <Input
                      id="res-category"
                      placeholder="Guide, Template, Reference..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="res-file">File</Label>
                    <Input id="res-file" type="file" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input id="res-publish" type="checkbox" className="w-4 h-4" />
                  <Label htmlFor="res-publish">
                    Publish immediately to students
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Save as Draft</Button>
                <Button>Publish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search resources..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={category === 'All' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Upload Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Resources
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
              <p className="text-xs text-muted-foreground">Shared materials</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Downloads
              </CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.reduce(
                  (sum, resource) => sum + resource.downloads,
                  0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12</span> this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Popular
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                ML Basics
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">Downloads</p>
            </CardContent>
          </Card>
        </div>

        {/* Resources Table */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Resources</CardTitle>
            <CardDescription>
              Manage your shared materials and track their usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{resource.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {resource.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{resource.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{resource.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {resource.size}
                    </TableCell>
                    <TableCell className="font-medium">
                      {resource.downloads}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {resource.uploadDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
