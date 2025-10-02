import { MentorPublicProfile } from "@/components/profiles/mentor-public-profile"

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
    },
    {
      title: "Ethical AI in Medical Decision Making",
      journal: "Journal of Medical AI",
      year: "2023",
      link: "#",
    },
    {
      title: "Federated Learning in Healthcare Systems",
      journal: "IEEE Transactions on Medical Imaging",
      year: "2023",
      link: "#",
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
}

export default function MentorProfilePage() {
  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <MentorPublicProfile mentor={mentorData} />
    </div>
  )
}
