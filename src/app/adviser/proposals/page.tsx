'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  BookOpen,
  MessageSquare,
  Search,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import PDFEdit from '@/components/pdf/PDFEdit';

// Define Proposal type for type safety
type Proposal = {
  id: number;
  title: string;
  student: string;
  studentEmail: string;
  subject: string;
  description: string;
  objectives: string;
  methodology: string;
  submittedDate: string;
  status: string;
  pdfUrl: string;
  feedback?: string;
};

const mockProposals: Proposal[] = [
  {
    id: 1,
    title: 'Machine Learning Applications in Healthcare',
    student: 'John Smith',
    studentEmail: 'john.smith@university.edu',
    subject: 'Computer Science',
    description:
      'Exploring the use of ML algorithms for medical diagnosis and treatment optimization. This research focuses on implementing deep learning models for early disease detection and personalized treatment recommendations.',
    objectives:
      '1. Analyze current ML applications in healthcare\n2. Develop new diagnostic algorithms\n3. Evaluate effectiveness and accuracy\n4. Implement real-time monitoring systems',
    methodology:
      'Literature review, algorithm development, clinical data analysis, validation studies',
    submittedDate: '2024-01-15',
    status: 'pending_mentor',
    pdfUrl:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 2,
    title: 'Advanced Neural Network Architectures',
    student: 'Emily Davis',
    studentEmail: 'emily.davis@university.edu',
    subject: 'Computer Science',
    description:
      'Research on transformer architectures and their applications in natural language processing. Investigating novel attention mechanisms and their impact on model performance.',
    objectives:
      'Study transformer models, implement custom architectures, evaluate performance, optimize for efficiency',
    methodology:
      'Literature review, model implementation, benchmark testing, performance analysis',
    submittedDate: '2024-01-18',
    status: 'approved',
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
  },
  {
    id: 3,
    title: 'Blockchain in Supply Chain Management',
    student: 'Michael Brown',
    studentEmail: 'michael.brown@university.edu',
    subject: 'Computer Science',
    description:
      'Investigating blockchain technology for supply chain transparency and traceability. Focus on implementing smart contracts for automated verification processes.',
    objectives:
      'Analyze current supply chain issues, design blockchain solution, test implementation, measure efficiency gains',
    methodology:
      'Case study analysis, prototype development, performance evaluation, stakeholder interviews',
    submittedDate: '2024-01-12',
    status: 'rejected',
    feedback:
      'The scope is too broad for an undergraduate thesis. Please focus on a specific industry or use case for blockchain implementation.',
    pdfUrl:
      'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf',
  },
  {
    id: 4,
    title: 'Cybersecurity in IoT Devices',
    student: 'Sarah Wilson',
    studentEmail: 'sarah.wilson@university.edu',
    subject: 'Computer Science',
    description:
      'Comprehensive analysis of security vulnerabilities in Internet of Things devices and development of robust security protocols for smart home environments.',
    objectives:
      'Identify common IoT vulnerabilities, develop security frameworks, test penetration resistance, create user guidelines',
    methodology:
      'Vulnerability assessment, penetration testing, framework development, user testing',
    submittedDate: '2024-01-20',
    status: 'pending_mentor',
    pdfUrl:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 5,
    title: 'Data Privacy in Social Media Platforms',
    student: 'Alex Chen',
    studentEmail: 'alex.chen@university.edu',
    subject: 'Computer Science',
    description:
      'Analysis of data collection practices in social media platforms and development of privacy-preserving algorithms for user data protection.',
    objectives:
      'Audit data collection methods, design privacy algorithms, implement encryption protocols, evaluate user awareness',
    methodology:
      'Data audit, algorithm design, implementation testing, user survey analysis',
    submittedDate: '2024-01-22',
    status: 'pending_mentor',
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
  },
  {
    id: 6,
    title: 'Quantum Computing Applications',
    student: 'Maria Garcia',
    studentEmail: 'maria.garcia@university.edu',
    subject: 'Computer Science',
    description:
      'Exploration of quantum computing principles and their potential applications in cryptography, optimization, and machine learning.',
    objectives:
      'Study quantum algorithms, implement quantum simulations, analyze computational advantages, explore practical applications',
    methodology:
      'Theoretical study, simulation development, performance comparison, application analysis',
    submittedDate: '2024-01-25',
    status: 'approved',
    pdfUrl:
      'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf',
  },
];

export default function MentorProposalsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewingProposal, setReviewingProposal] = useState<number | null>(
    null
  );
  const [feedback, setFeedback] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [showPdfEditor, setShowPdfEditor] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_mentor':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
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
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleSubmitReview = (proposalId: number) => {
    if (decision && feedback.trim()) {
      console.log(
        `${decision} proposal ${proposalId} with feedback: ${feedback}`
      );
      // Handle review submission logic
      setReviewingProposal(null);
      setFeedback('');
      setDecision(null);
    }
  };

  const handleReviewProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowPdfEditor(true);
  };

  const handleClosePdfEditor = () => {
    setShowPdfEditor(false);
    setSelectedProposal(null);
  };

  const filteredProposals = mockProposals.filter(
    (proposal) =>
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userRole="mentor">
      <div className="space-y-6">
        <PageHeader
          title="Student Documents"
          description="Review and provide feedback on student documents"
        />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      <Button
                        variant="link"
                        className="p-0 h-auto font-semibold text-lg"
                        onClick={() =>
                          router.push(`/mentor/proposals/${proposal.id}`)
                        }
                      >
                        {proposal.title}
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {proposal.student}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {proposal.subject}
                        </span>
                        <span>Submitted: {proposal.submittedDate}</span>
                      </div>
                    </CardDescription>
                  </div>
                  {getStatusBadge(proposal.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {proposal.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Research Objectives</h4>
                      <p className="text-sm text-muted-foreground">
                        {proposal.objectives}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Methodology</h4>
                      <p className="text-sm text-muted-foreground">
                        {proposal.methodology}
                      </p>
                    </div>
                  </div>

                  {/* Existing Feedback */}
                  {proposal.feedback && (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          Your Feedback
                        </span>
                      </div>
                      <p className="text-sm">{proposal.feedback}</p>
                    </div>
                  )}

                  {/* Review Actions */}
                  {proposal.status === 'pending_mentor' && (
                    <div className="border-t pt-4">
                      {reviewingProposal === proposal.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="feedback">Feedback</Label>
                            <Textarea
                              id="feedback"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              placeholder="Provide detailed feedback on the proposal..."
                              rows={4}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setDecision('approve');
                                handleSubmitReview(proposal.id);
                              }}
                              className="bg-green-500 hover:bg-green-600"
                              disabled={!feedback.trim()}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => {
                                setDecision('reject');
                                handleSubmitReview(proposal.id);
                              }}
                              variant="destructive"
                              disabled={!feedback.trim()}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setReviewingProposal(null);
                                setFeedback('');
                                setDecision(null);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button onClick={() => handleReviewProposal(proposal)}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Review Proposal
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* PDF Editor Modal */}
      {showPdfEditor && selectedProposal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedProposal.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Student: {selectedProposal.student} | Subject:{' '}
                  {selectedProposal.subject}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClosePdfEditor}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PDFEdit pdfUri={selectedProposal.pdfUrl} />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
