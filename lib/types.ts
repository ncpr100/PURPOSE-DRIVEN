
// ✅ ENTERPRISE-FIRST APPROACH: Create custom types replacing broken @prisma/client imports
// Following established patterns from working platform files

// Custom database table types (replacing Prisma table imports)
export interface users {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  role: UserRole
  churchId: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface churches {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string
  website: string | null
  founded: string | null
  description: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface members {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  address: string | null
  birthDate: Date | null
  gender: string | null
  maritalStatus: string | null
  occupation: string | null
  membershipDate: Date | null
  baptismDate: Date | null
  isActive: boolean
  churchId: string
  userId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface sermons {
  id: string
  title: string
  content: string
  outline: string | null
  scripture: string | null
  speaker: string | null
  date: Date | null
  topic: string | null
  isPublic: boolean
  churchId: string
  createdAt: Date
  updatedAt: Date
}

// UserRole enum (following role-access-control.d.ts enterprise pattern)
export type UserRole = 'SUPER_ADMIN' | 'ADMIN_IGLESIA' | 'PASTOR' | 'LIDER' | 'MIEMBRO'

// Extended types for complex relationships
export type ExtendedUser = users & {
  church?: churches | null
}

export type ExtendedMember = members & {
  church?: churches
  user?: users | null
}

export type ExtendedSermon = sermons & {
  church?: churches
}

export interface DashboardStats {
  totalMembers: number
  totalSermons: number
  upcomingEvents: number
  newMembersThisMonth: number
}

export interface SermonGenerationRequest {
  topic: string
  scripture?: string
  audience?: string
  duration?: string
  language: 'es' | 'en'
}

export interface SermonGenerationResponse {
  outline: string
  introduction: string
  mainPoints: string[]
  conclusion: string
  bibleVerses: string[]
}

// NextAuth type extensions
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
      churchId: string | null
      church?: churches | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: UserRole
    churchId: string | null
    church?: churches | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    churchId: string | null
    church?: churches | null
  }
}

export { UserRole }
