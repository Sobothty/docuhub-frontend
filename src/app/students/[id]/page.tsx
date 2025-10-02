import { StudentPublicProfile } from '@/components/profiles/student-public-profile';

// Mock function to get student data by ID - in a real app, this would come from a database
async function getStudentData() {
  // Mock student data - in a real app, this would be fetched from a database based on the ID
  const studentData = {
    name: 'Sarah Chen',
    school: 'Stanford University',
    year: 'Graduate Student - 2nd Year',
    major: 'Computer Science',
    avatar: '/placeholder.svg?height=128&width=128',
    bio: 'Graduate student passionate about machine learning applications in healthcare. Currently working on research projects involving AI-driven diagnostic tools and exploring the intersection of technology and medicine. Interested in developing solutions that can improve patient outcomes through intelligent systems.',
    researchInterests: [
      'Machine Learning',
      'Healthcare Technology',
      'Data Analysis',
      'Computer Vision',
      'AI Ethics',
    ],
    publishedPapers: [
      {
        title: 'Machine Learning Applications in Healthcare Diagnostics',
        year: '2024',
        status: 'published',
        link: '/papers/1',
      },
      {
        title: 'AI-Driven Patient Monitoring Systems',
        year: '2024',
        status: 'under review',
        link: '/papers/2',
      },
    ],
    mentor: {
      name: 'Dr. Sarah Johnson',
      title: 'Professor of Computer Science',
      profileLink: '/mentors/1',
    },
    stats: {
      papersPublished: 2,
      papersInProgress: 3,
      academicYear: '2nd',
    },
    contact: {
      email: 'sarah.chen@stanford.edu',
      portfolio: 'https://sarahchen.dev',
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarah-chen-cs',
      github: 'https://github.com/sarahchen',
      orcid: 'https://orcid.org/0000-0000-0000-0001',
    },
  };

  return studentData;
}

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const studentData = await getStudentData();

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <StudentPublicProfile student={studentData} />
    </div>
  );
}
