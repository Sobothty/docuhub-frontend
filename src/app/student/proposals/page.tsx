'use client';

import type React from 'react';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Send,
  UserCheck,
} from 'lucide-react';

const mockProposals = [
  {
    id: 1,
    title: 'Machine Learning Applications in Healthcare',
    subject: 'Computer Science',
    description: 'Exploring the use of ML algorithms for medical diagnosis...',
    status: 'pending_admin',
    submittedDate: '2024-01-15',
    mentorFeedback: '',
    assignedMentor: '',
    pdfFile: null as File | null,
  },
  {
    id: 2,
    title: 'Climate Change Impact on Marine Ecosystems',
    subject: 'Environmental Science',
    description:
      'Analyzing the effects of rising temperatures on ocean life...',
    status: 'pending_mentor',
    submittedDate: '2024-01-20',
    mentorFeedback: '',
    assignedMentor: 'Dr. Michael Rodriguez',
    pdfFile: null as File | null,
  },
  {
    id: 3,
    title: 'Quantum Computing Fundamentals',
    subject: 'Physics',
    description: 'A comprehensive study of quantum computing principles...',
    status: 'rejected',
    submittedDate: '2024-01-10',
    mentorFeedback:
      'The scope is too broad. Narrow focus to a specific aspect.',
    assignedMentor: '',
    pdfFile: null as File | null,
  },
];

export default function StudentProposalsPage() {
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    objectives: '',
    methodology: '',
    pdfFile: null as File | null,
  });
  const [proposals, setProposals] = useState(mockProposals);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_admin':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending Admin Review
          </Badge>
        );
      case 'pending_mentor':
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Pending Mentor Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, pdfFile: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split('T')[0]; // 2025-08-28
    const newProposal = {
      id: Date.now(),
      title: formData.title,
      subject: formData.subject,
      description: formData.description,
      status: 'pending_admin',
      submittedDate: currentDate,
      mentorFeedback: '',
      assignedMentor: '',
      pdfFile: formData.pdfFile,
    };
    setProposals([...proposals, newProposal]);
    setShowNewProposal(false);
    setFormData({
      title: '',
      subject: '',
      description: '',
      objectives: '',
      methodology: '',
      pdfFile: null,
    });
    console.log('Proposal submitted to admin:', newProposal);
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
                status === 'pending_mentor'
                  ? 'Dr. Assigned Mentor'
                  : proposal.assignedMentor,
            }
          : proposal
      )
    );
    console.log(`Admin reviewed proposal ${id} with status: ${status}`);
  };

  const handleSubmitDocument = (id: number) => {
    setProposals((prev) =>
      prev.map((proposal) =>
        proposal.id === id && proposal.status === 'approved'
          ? { ...proposal, status: 'pending_mentor' }
          : proposal
      )
    );
    console.log(`Document submitted for mentor review: ${id}`);
  };

  return (
    <DashboardLayout userRole="student">
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
                      value={formData.subject}
                      onValueChange={(value) =>
                        setFormData({ ...formData, subject: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer-science">
                          Computer Science
                        </SelectItem>
                        <SelectItem value="environmental-science">
                          Environmental Science
                        </SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="psychology">Psychology</SelectItem>
                        <SelectItem value="literature">Literature</SelectItem>
                      </SelectContent>
                    </Select>
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

                <div className="space-y-2">
                  <Label htmlFor="objectives">Research Objectives</Label>
                  <Textarea
                    id="objectives"
                    value={formData.objectives}
                    onChange={(e) =>
                      setFormData({ ...formData, objectives: e.target.value })
                    }
                    placeholder="What are your main research objectives?"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="methodology">Proposed Methodology</Label>
                  <Textarea
                    id="methodology"
                    value={formData.methodology}
                    onChange={(e) =>
                      setFormData({ ...formData, methodology: e.target.value })
                    }
                    placeholder="How do you plan to conduct your research?"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdfFile">Upload PDF Document</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                    <Input
                      id="pdfFile"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        document.getElementById('pdfFile')?.click()
                      }
                      className="mb-2 bg-primary text-gray-50 hover:bg-primary/90"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Choose PDF
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      or drag and drop a PDF file here
                    </p>
                    {formData.pdfFile && (
                      <p className="text-sm text-foreground mt-2">
                        Selected: {formData.pdfFile.name} (
                        {(formData.pdfFile.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="w-full md:w-auto">
                    Submit for Review
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewProposal(false)}
                    className="w-full md:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

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
                  {proposal.pdfFile && (
                    <div>
                      <strong>Attached PDF:</strong>{' '}
                      {proposal.pdfFile instanceof File
                        ? proposal.pdfFile.name
                        : 'N/A'}
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

                {proposal.status === 'approved' && (
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
                {proposal.status === 'pending_admin' && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Awaiting admin review. Check back soon!
                  </div>
                )}
                {proposal.status === 'pending_mentor' && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleAdminReview(proposal.id, 'approved')}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Track Progress with Mentor
                    </Button>
                  </div>
                )}
                {proposal.status === 'rejected' && (
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
