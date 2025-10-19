interface StudentInfoData {
  uuid: string;
  fullName: string;
  email: string;
  username: string;
  gender: string;
  bio: string;
  imageUrl: string;
  contactNumber: string;
  address: string;
  telegramId: string;
  university: string;
  major: string;
  yearsOfStudy: string | number;
}

interface PaperData {
  uuid: string;
  title: string;
  abstract: string;
  categories: string;
  status: string;
  isPublished: boolean;
  publishedAt: string;
  submittedAt: string;
  downloads: number;
  isApproved: boolean;
}

export interface AdviserData {
  adviserId: string;
  adviserName: string;
  adviserBio: string;
  relationship: string;
  status: string;
  startDate: string;
  researchArea: string;
}

interface ResearchTitleData {
  title: string;
  category: string;
  status: string;
  submittedDate: string;
}

export interface ExportData {
  studentInfo?: StudentInfoData;
  papers?: PaperData[];
  studentAdviser?: AdviserData[];
  researchTitles?: ResearchTitleData[];
}