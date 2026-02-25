import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"

// NOTE: JWT type extensions are in lib/types.ts to avoid duplication

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // Reduced to 7 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || 'build-time-fallback-secret-change-in-production',
  // Cookie configuration for production
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 AUTH: authorize() called with email:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ AUTH: Missing credentials')
          return null
        }

        // Database authentication ONLY - no fallback users
        try {
          const user = await db.users.findUnique({
            where: {
              email: credentials.email
            },
            include: {
              churches: true
            }
          })

          if (!user || !user.password) {
            console.log('❌ AUTH: User not found or no password in database')
            return null
          }

          console.log('✅ AUTH: User found:', user.email, 'Role:', user.role)

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.log('❌ AUTH: Invalid password')
            return null
          }

          console.log('✅ AUTH: Password valid, returning user object')
          console.log('   ID:', user.id)
          console.log('   Role:', user.role)
          console.log('   churchId:', user.churchId)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            churchId: user.churchId,
          }
        } catch (error) {
          console.error('❌ AUTH: Database connection FAILED')
          console.error('Error type:', error instanceof Error ? error.constructor.name : 'Unknown')
          console.error('Error message:', error instanceof Error ? error.message : String(error))
          console.error('Full error:', JSON.stringify(error, null, 2))
          
          // Database authentication failed - reject login
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('🔐 JWT: Storing user in token')
        console.log('   user.id:', user.id)
        console.log('   user.role:', user.role)
        console.log('   user.churchId:', user.churchId)
        
        // Store user data in JWT for middleware access
        token.sub = user.id
        token.role = user.role  // CRITICAL: Middleware needs this!
        token.churchId = user.churchId
        token.email = user.email  // Store for fallback sessions
        token.name = user.name    // Store for fallback sessions
      }
      return token
    },
    async session({ session, token }) {
      console.log('🔐 SESSION: Building session from token')
      console.log('   token.sub:', token.sub)
      console.log('   token.role:', token.role)
      console.log('   token.churchId:', token.churchId)
      
      // Fetch user data fresh each time to keep JWT minimal
      if (token.sub) {
        try {
          const user = await db.users.findUnique({
            where: { id: token.sub },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              churchId: true
            }
          })
          
          if (user) {
            console.log('✅ SESSION: User fetched from DB')
            console.log('   role:', user.role)
            console.log('   churchId:', user.churchId)
            
            session.user = {
              id: user.id,
              email: user.email || '',
              name: user.name || '',
              role: user.role,
              churchId: user.churchId || ''
            }
          } else {
            console.log('❌ SESSION: User not found in DB for token.sub:', token.sub)
          }
        } catch (error) {
          console.log('⚠️ SESSION: Database connection failed, using token data')
          console.log('Error:', error instanceof Error ? error.message : String(error))
          // Fallback to token data when database is unavailable
          session.user = {
            id: token.sub,
            email: token.email || '',
            name: token.name || '',
            role: token.role,
            churchId: token.churchId || ''
          }
        }
      }
      return session
    },
  }
}
