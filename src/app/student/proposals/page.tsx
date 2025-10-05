"use client";

import React, { useRef, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Send,
  UserCheck,
  X,
} from "lucide-react";
import { useGetAllCategoriesQuery } from "@/feature/categoriesSlice/categoriesSlices";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useCreateMediaMutation } from "@/feature/media/mediaSlice";
import { useCreatePaperMutation } from "@/feature/paperSlice/papers";

const mockProposals = [
  {
    id: 1,
    title: "Machine Learning Applications in Healthcare",
    subject: "Computer Science",
    description: "Exploring the use of ML algorithms for medical diagnosis...",
    status: "pending_admin",
    submittedDate: "2024-01-15",
    mentorFeedback: "",
    assignedMentor: "",
    pdfFile: null as File | null,
  },
  {
    id: 2,
    title: "Climate Change Impact on Marine Ecosystems",
    subject: "Environmental Science",
    description: "Analyzing the effects of rising temperatures on ocean life...",
    status: "pending_mentor",
    submittedDate: "2024-01-20",
    mentorFeedback: "",
    assignedMentor: "Dr. Michael Rodriguez",
    pdfFile: null as File | null,
  },
  {
    id: 3,
    title: "Quantum Computing Fundamentals",
    subject: "Physics",
    description: "A comprehensive study of quantum computing principles...",
    status: "rejected",
    submittedDate: "2024-01-10",
    mentorFeedback:
      "The scope is too broad. Narrow focus to a specific aspect.",
    assignedMentor: "",
    pdfFile: null as File | null,
  },
];

export default function StudentProposalsPage() {
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    thumbnailUrl: "",
    category: [] as string[],
  });
  const [proposals, setProposals] = useState(mockProposals);

  const { data: categories, isLoading: categoriesLoading } =
    useGetAllCategoriesQuery();

  const { data: user } = useGetUserProfileQuery();

  const [uploadMedia, { isLoading: isUploading }] = useCreateMediaMutation();
  const [createPaper, { isLoading: isCreatingPaper }] = useCreatePaperMutation();

  const [thumbnailFile, setThumbnailFile] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<string>("");

  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to format filename
  const getFileName = (url: string) => {
    try {
      return decodeURIComponent(url.split("/").pop()?.split("?")[0] || "");
    } catch {
      return "Unknown file";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_admin":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending Admin Review
          </Badge>
        );
      case "pending_mentor":
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Pending Mentor Review
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-500">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleAdminReview = (id: number, status: string, feedback?: string) => {
    setProposals((prev) =>
      prev.map((proposal) =>
        proposal.id === id
          ? {
              ...proposal,
              status,
              mentorFeedback: feedback || proposal.mentorFeedback,
              assignedMentor:
                status === "pending_mentor"
                  ? "Dr. Assigned Mentor"
                  : proposal.assignedMentor,
            }
          : proposal
      )
    );
  };

  const handleSubmitDocument = (id: number) => {
    setProposals((prev) =>
      prev.map((proposal) =>
        proposal.id === id && proposal.status === "approved"
          ? { ...proposal, status: "pending_mentor" }
          : proposal
      )
    );
    console.log(`Document submitted for mentor review: ${id}`);
  };

  const handleAddSubject = (value: string) => {
    if (value && !formData.category.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        category: [...prev.category, value],
      }));
    }
    setSelectedCategory("");
  };

  const handleRemoveSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.filter((s) => s !== subject),
    }));
  };

  const handleThumbnailFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await uploadMedia(data).unwrap();
      if (!response?.data?.uri) throw new Error("No URI returned from upload.");

      setThumbnailFile(response.data.uri);
      setFormData((prev) => ({ ...prev, thumbnailUrl: response.data.uri }));
    } catch (error) {
      console.error("Thumbnail upload failed:", error);
      alert("Thumbnail upload failed. Please try again.");
    }
  };

  const handlePdfFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await uploadMedia(data).unwrap();
      if (!response?.data?.uri) throw new Error("No URI returned from upload.");

      setPdfFile(response.data.uri);
      setFormData((prev) => ({ ...prev, fileUrl: response.data.uri }));
    } catch (error) {
      console.error("PDF upload failed:", error);
      alert("PDF upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.fileUrl ||
      !formData.thumbnailUrl ||
      formData.category.length === 0
    ) {
      alert("Please fill in all required fields and upload files.");
      return;
    }

    try {
      const result = await createPaper({
        title: formData.title,
        abstractText: formData.description,
        fileUrl: formData.fileUrl,
        thumbnailUrl: formData.thumbnailUrl,
        categoryNames: formData.category,
      }).unwrap();

      console.log("Paper created successfully:", result);

      // Reset form
      setFormData({
        title: "",
        description: "",
        fileUrl: "",
        thumbnailUrl: "",
        category: [],
      });
      setThumbnailFile("");
      setPdfFile("");
      setShowNewProposal(false);

      alert("Paper submitted successfully!");
    } catch (error) {
    console.log("Failed to create paper - Full Error:", error);
  }
  };

  return (
    <DashboardLayout
      userRole="student"
      userName={user?.user.fullName}
      userAvatar={
        user?.user.imageUrl ||
        "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg"
      }
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Documents</h1>
            <p className="text-muted-foreground">
              Create, submit, and track your documents
            </p>
          </div>
          <Button onClick={() => setShowNewProposal(true)}>
            <Send className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>

        {showNewProposal && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Document</CardTitle>
              <CardDescription>
                Submit your document proposal and PDF for admin review. A mentor
                will be assigned after approval.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Document Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter your document title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Area</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={handleAddSubject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject areas" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : Array.isArray(categories?.content) &&
                          categories.content.length > 0 ? (
                          categories.content.map((category) => (
                            <SelectItem
                              value={category.name}
                              key={category.uuid}
                              disabled={formData.category.includes(
                                category.name
                              )}
                            >
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-categories" disabled>
                            No categories available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>

                    {formData.category.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.category.map((subject) => (
                          <Badge
                            key={subject}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {subject}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-destructive"
                              onClick={() => handleRemoveSubject(subject)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your document topic and research question"
                    rows={4}
                    required
                  />
                </div>

                {/* Thumbnail Upload */}
                <div className="space-y-2">
                  <Label>Upload Thumbnail of Document</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                    <Input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailFileChange}
                      className="hidden"
                      required
                    />
                    <Button
                      type="button"
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="mb-2 bg-primary text-gray-50 hover:bg-primary/90"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      or drag and drop an image file here
                    </p>
                    {thumbnailFile && (
                      <div className="mt-4">
                        <p className="text-sm text-foreground mb-2">
                          Selected: {getFileName(thumbnailFile)}
                        </p>
                        <img
                          src={thumbnailFile}
                          alt="Thumbnail preview"
                          className="max-w-full h-auto max-h-48 mx-auto rounded-lg border border-border object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Upload */}
                <div className="space-y-2">
                  <Label>Upload File of Document</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                    <Input
                      ref={pdfInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfFileChange}
                      className="hidden"
                      required
                    />
                    <Button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      className="mb-2 bg-primary text-gray-50 hover:bg-primary/90"
                      disabled={isUploading}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Choose PDF"}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      or drag and drop a PDF file here
                    </p>
                    {pdfFile && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground mb-2">
                          <strong>Selected:</strong> {getFileName(pdfFile)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF preview not available
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isCreatingPaper || isUploading}
                  >
                    {isCreatingPaper ? "Submitting..." : "Submit for Review"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewProposal(false)}
                    className="w-full md:w-auto"
                    disabled={isCreatingPaper || isUploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Existing Proposals */}
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      {proposal.title}
                    </CardTitle>
                    <CardDescription>
                      Subject: {proposal.subject}
                    </CardDescription>
                  </div>
                  {getStatusBadge(proposal.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  {proposal.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
                  <div>
                    <strong>Submitted:</strong> {proposal.submittedDate}
                  </div>
                  {proposal.assignedMentor && (
                    <div>
                      <strong>Mentor:</strong> {proposal.assignedMentor}
                    </div>
                  )}
                </div>

                {proposal.mentorFeedback && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <strong className="text-sm sm:text-base">Feedback:</strong>
                    <p className="text-sm sm:text-base mt-1">
                      {proposal.mentorFeedback}
                    </p>
                  </div>
                )}

                {proposal.status === "approved" && (
                  <div className="mt-4">
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleSubmitDocument(proposal.id)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Submit Final Document
                    </Button>
                  </div>
                )}
                {proposal.status === "pending_admin" && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Awaiting admin review. Check back soon!
                  </div>
                )}
                {proposal.status === "pending_mentor" && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleAdminReview(proposal.id, "approved")}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Track Progress with Mentor
                    </Button>
                  </div>
                )}
                {proposal.status === "rejected" && (
                  <div className="mt-4 text-sm text-destructive">
                    Rejected. Please revise and resubmit based on feedback.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
