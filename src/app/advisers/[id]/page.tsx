"use client";

import { MentorPublicProfile } from "@/components/profiles/mentor-public-profile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock mentor data - in a real app, this would come from a database
const mentorData = {
  name: "Dr. Sarah Johnson",
  title: "Professor of Computer Science",
  department: "Computer Science Department",
  university: "Stanford University",
  avatar: "/placeholder.svg?height=128&width=128",
  bio: "Dr. Sarah Johnson is a distinguished Professor of Computer Science at Stanford University with over 15 years of experience in machine learning and artificial intelligence research. She has published over 50 peer-reviewed papers and has guided numerous students to successful academic careers. Her research focuses on the intersection of AI and healthcare, developing innovative solutions that improve patient outcomes through intelligent systems.",
  researchInterests: [
    "Machine Learning",
    "Artificial Intelligence",
    "Healthcare Technology",
    "Computer Vision",
    "Data Science",
    "Neural Networks",
  ],
  mentoredWorks: [
    {
      title: "Machine Learning Applications in Medical Diagnosis",
      author: "Sarah Chen",
      year: "2024",
      link: "#",
    },
    {
      title: "AI-Powered Drug Discovery Mechanisms",
      author: "Mike Rodriguez",
      year: "2024",
      link: "#",
    },
    {
      title: "Computer Vision in Radiology",
      author: "Emma Thompson",
      year: "2023",
      link: "#",
    },
    {
      title: "Deep Learning for Genomic Analysis",
      author: "Alex Kim",
      year: "2023",
      link: "#",
    },
  ],
  publications: [
    {
      title: "Advanced Neural Networks for Healthcare Applications",
      journal: "Nature Machine Intelligence",
      year: "2024",
      link: "#",
      abstract:
        "This paper explores the application of advanced neural network architectures in healthcare, focusing on improving diagnostic accuracy and patient outcomes through intelligent systems.",
      tags: ["Machine Learning", "Healthcare", "Neural Networks"],
      image:
        "https://idpdefault.s3.ap-south-1.amazonaws.com/589465a620a8be4fd4220240116115232.jpg",
      downloads: "245",
      star: "128",
    },
    {
      title: "Ethical AI in Medical Decision Making",
      journal: "Journal of Medical AI",
      year: "2023",
      link: "#",
      abstract:
        "An in-depth analysis of ethical considerations when implementing AI systems for medical decision-making processes.",
      tags: ["Ethics", "AI", "Healthcare"],
      image:
        "https://idpdefault.s3.ap-south-1.amazonaws.com/589465a620a8be4fd4220240116115232.jpg",
      downloads: "189",
      star: "96",
    },
    {
      title: "Federated Learning in Healthcare Systems",
      journal: "IEEE Transactions on Medical Imaging",
      year: "2023",
      link: "#",
      abstract:
        "This research presents novel approaches to federated learning that enable collaborative machine learning while preserving patient privacy.",
      tags: ["Federated Learning", "Privacy", "Medical Imaging"],
      image:
        "https://idpdefault.s3.ap-south-1.amazonaws.com/589465a620a8be4fd4220240116115232.jpg",
      downloads: "312",
      star: "156",
    },
  ],
  stats: {
    studentsGuided: 47,
    papersApproved: 89,
    yearsExperience: 15,
  },
  contact: {
    email: "sarah.johnson@stanford.edu",
    website: "https://cs.stanford.edu/~sjohnson",
    office: "Gates Building, Room 392",
    officeHours: "Tuesdays & Thursdays, 2-4 PM",
  },
  socialLinks: {
    linkedin: "https://linkedin.com/in/sarah-johnson-cs",
    orcid: "https://orcid.org/0000-0000-0000-0000",
    googleScholar: "https://scholar.google.com/citations?user=example",
  },
};

export default function MentorProfilePage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/student/mentorship");
  };

  return (
    <div className="min-h-screen dashboard-background py-8 px-6">
      <div className="max-w-7xl mx-auto mb-6">
        <Button
          onClick={handleGoBack}
          variant="outline"
          className="px-6 py-2 rounded-xl font-semibold bg-card hover:bg-accent text-card-foreground border-2 border-border"
          style={{
            backgroundColor: "#1f2937",
            color: "#ffffff",
            borderColor: "#1f2937",
          }}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Go Back
        </Button>
      </div>
      <MentorPublicProfile mentor={mentorData} />
    </div>
  );
}
