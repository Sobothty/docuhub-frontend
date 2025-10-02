// Authentication utilities and types
export type UserRole = "admin" | "mentor" | "student" | "public"

export interface User {
  slug: string
  uuid: string
  userName: string
  gender: string | null
  email: string
  fullName: string
  firstName: string
  lastName: string
  imageUrl: string | null
  status: string | null
  createDate: string
  updateDate: string
  bio: string | null
  address: string | null
  contactNumber: string | null
  telegramId: string | null
  isUser: boolean
  isAdmin: boolean
  isStudent: boolean
  isAdvisor: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock authentication functions - in a real app, these would connect to your backend
export async function signIn(email: string, password: string): Promise<{ user: User; token: string }> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock user data based on email for demo purposes
  const mockUsers: Record<string, User> = {
    "admin@ipub.com": {
      slug: "admin-user",
      uuid: "1",
      userName: "admin001",
      gender: null,
      email: "admin@ipub.com",
      fullName: "Admin User",
      firstName: "Admin",
      lastName: "User",
      imageUrl: null,
      status: "active",
      createDate: "2024-01-01",
      updateDate: "2024-01-01",
      bio: null,
      address: null,
      contactNumber: null,
      telegramId: null,
      isUser: true,
      isAdmin: true,
      isStudent: false,
      isAdvisor: false,
    },
    "mentor@ipub.com": {
      slug: "dr-sarah-chen",
      uuid: "2",
      userName: "sarahchen",
      gender: "female",
      email: "mentor@ipub.com",
      fullName: "Dr. Sarah Chen",
      firstName: "Sarah",
      lastName: "Chen",
      imageUrl: null,
      status: "active",
      createDate: "2024-01-01",
      updateDate: "2024-01-01",
      bio: "Expert in machine learning and AI research",
      address: null,
      contactNumber: null,
      telegramId: null,
      isUser: true,
      isAdmin: false,
      isStudent: false,
      isAdvisor: true,
    },
    "student@ipub.com": {
      slug: "john-smith",
      uuid: "3",
      userName: "johnsmith",
      gender: "male",
      email: "student@ipub.com",
      fullName: "John Smith",
      firstName: "John",
      lastName: "Smith",
      imageUrl: null,
      status: "active",
      createDate: "2024-01-01",
      updateDate: "2024-01-01",
      bio: "PhD candidate researching neural networks",
      address: null,
      contactNumber: null,
      telegramId: null,
      isUser: true,
      isAdmin: false,
      isStudent: true,
      isAdvisor: false,
    },
    "user@ipub.com": {
      slug: "jane-doe",
      uuid: "4",
      userName: "janedoe",
      gender: "female",
      email: "user@ipub.com",
      fullName: "Jane Doe",
      firstName: "Jane",
      lastName: "Doe",
      imageUrl: null,
      status: "active",
      createDate: "2024-01-01",
      updateDate: "2024-01-01",
      bio: "Passionate about AI ethics and research",
      address: null,
      contactNumber: null,
      telegramId: null,
      isUser: true,
      isAdmin: false,
      isStudent: false,
      isAdvisor: false,
    },
  }

  const user = mockUsers[email]
  if (!user || password !== "password") {
    throw new Error("Invalid credentials")
  }

  return {
    user,
    token: `mock-jwt-token-${user.uuid}`,
  }
}

export async function signUp(data: {
  email: string
  password: string
  name: string
  role: UserRole
  title?: string
  department?: string
  university?: string
}): Promise<{ user: User; token: string }> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user: User = {
    slug: data.name.toLowerCase().replace(/\s+/g, '-'),
    uuid: Math.random().toString(36).substr(2, 9),
    userName: data.name.toLowerCase().replace(/\s+/g, ''),
    gender: null,
    email: data.email,
    fullName: data.name,
    firstName: data.name.split(' ')[0] || '',
    lastName: data.name.split(' ').slice(1).join(' ') || '',
    imageUrl: null,
    status: 'active',
    createDate: new Date().toISOString().split('T')[0],
    updateDate: new Date().toISOString().split('T')[0],
    bio: null,
    address: null,
    contactNumber: null,
    telegramId: null,
    isUser: true,
    isAdmin: data.role === 'admin',
    isStudent: data.role === 'student',
    isAdvisor: data.role === 'mentor',
  }

  return {
    user,
    token: `mock-jwt-token-${user.uuid}`,
  }
}

export async function signOut(): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export async function getCurrentUser(token: string): Promise<User | null> {
  // Simulate API call to validate token and get user
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, you'd validate the JWT token here
  if (!token || !token.startsWith("mock-jwt-token-")) {
    return null
  }

  // Mock user lookup - in reality, you'd decode the JWT or query your database
  const userId = token.replace("mock-jwt-token-", "")
  const mockUsers: Record<string, User> = {
    "1": {
      slug: "admin-user",
      uuid: "1",
      userName: "admin001",
      gender: null,
      email: "admin@ipub.com",
      fullName: "Admin User",
      firstName: "Admin",
      lastName: "User",
      imageUrl: null,
      status: "active",
      createDate: "2024-01-01",
      updateDate: "2024-01-01",
      bio: null,
      address: null,
      contactNumber: null,
      telegramId: null,
      isUser: true,
      isAdmin: true,
      isStudent: false,
      isAdvisor: false,
    },
    "2": {
      slug: "dr-sarah-chen",
      uuid: "2",
      userName: "sarahchen",
      gender: "female",
      email: "mentor@ipub.com",
      fullName: "Dr. Sarah Chen",
      firstName: "Sarah",
      lastName: "Chen",
      imageUrl: null,
      status: "active",
      createDate: "2024-01-01",
      updateDate: "2024-01-01",
      bio: "Expert in machine learning and AI research",
      address: null,
      contactNumber: null,
      telegramId: null,
      isUser: true,
      isAdmin: false,
      isStudent: false,
      isAdvisor: true,
    },
    "3": {
      slug: "john-smith",
      uuid: "3",
      userName: "johnsmith",
      gender: "male",
      email: "student@ipub.com",
      fullName: "John Smith",
      firstName: "John",
      lastName: "Smith",
      imageUrl: null,
      status: "active",
      createDate: "2024-01-01",
      updateDate: "2024-01-01",
      bio: "PhD candidate researching neural networks",
      address: null,
      contactNumber: null,
      telegramId: null,
      isUser: true,
      isAdmin: false,
      isStudent: true,
      isAdvisor: false,
    },
    "4": {
      slug: "jane-doe",
      uuid: "4",
      userName: "janedoe",
      gender: "female",
      email: "user@ipub.com",
      fullName: "Jane Doe",
      firstName: "Jane",
      lastName: "Doe",
      imageUrl: null,
      status: "active",
      createDate: "2024-01-01",
      updateDate: "2024-01-01",
      bio: "Passionate about AI ethics and research",
      address: null,
      contactNumber: null,
      telegramId: null,
      isUser: true,
      isAdmin: false,
      isStudent: false,
      isAdvisor: false,
    },
  }

  return mockUsers[userId] || null
}

// Role-based access control utilities
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    public: 0,
    student: 1,
    mentor: 2,
    admin: 3,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  // Define route access rules
  const routePermissions: Record<string, UserRole> = {
    "/admin": "admin",
    "/mentor": "mentor",
    "/student": "student",
    "/profile": "public", // Any authenticated user can access profile
  }

  const requiredRole = routePermissions[route]
  if (!requiredRole) return true // Public routes

  return hasPermission(userRole, requiredRole)
}
