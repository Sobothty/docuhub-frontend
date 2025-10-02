// NextAuth type declarations

declare module "next-auth" {
  interface Session {
    user: {
      slug: string | null;
      uuid: string | null;
      userName: string | null;
      gender: string | null;
      email: string | null;
      fullName: string | null;
      firstName: string | null;
      lastName: string | null;
      imageUrl: string | null;
      status: boolean | null;
      createDate: string | null;
      updateDate: string | null;
      bio: string | null;
      address: string | null;
      contactNumber: string | null;
      telegramId: string | null;
      isUser: boolean;
      isAdmin: boolean;
      isStudent: boolean;
      isAdvisor: boolean;
      roles: string[];
      student: {
        uuid: string;
        studentCardUrl: string;
        university: string;
        major: string;
        yearsOfStudy: string | null;
        isStudent: boolean;
        userUuid: string;
      } | null;
      adviser: {
        yearsExperience: number;
        linkedinUrl: string | null;
        publication: string | null;
        availability: boolean | null;
        socialLinks: string | null;
        userUuid: string;
      } | null;
    };
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }

  interface User {
    slug: string | null;
    uuid: string | null;
    username: string | null;
    gender: string | null;
    email: string | null;
    fullName: string | null;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    status: boolean | null;
    createDate: string | null;
    updateDate: string | null;
    bio: string | null;
    address: string | null;
    contactNumber: string | null;
    telegramId: string | null;
    isUser: boolean;
    isAdmin: boolean;
    isStudent: boolean;
    isAdvisor: boolean;
    roles: string[];
    student: {
      uuid: string;
      studentCardUrl: string;
      university: string;
      major: string;
      yearsOfStudy: string | null;
      isStudent: boolean;
      userUuid: string;
    } | null;
    adviser: {
      yearsExperience: number;
      linkedinUrl: string | null;
      publication: string | null;
      availability: boolean | null;
      socialLinks: string | null;
      userUuid: string;
    } | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      slug: string | null;
      uuid: string | null;
      userName: string | null;
      email: string | null;
      fullName: string | null;
      firstName: string | null;
      lastName: string | null;
      imageUrl: string | null;
      isUser: boolean;
      isAdmin: boolean;
      isStudent: boolean;
      isAdvisor: boolean;
      roles: string[];
      student: {
        uuid: string;
        studentCardUrl: string;
        university: string;
        major: string;
        yearsOfStudy: string | null;
        isStudent: boolean;
        userUuid: string;
      } | null;
      adviser: {
        yearsExperience: number;
        linkedinUrl: string | null;
        publication: string | null;
        availability: boolean | null;
        socialLinks: string | null;
        userUuid: string;
      } | null;
    };
    accessToken: string;
    refreshToken: string;
  }
}
