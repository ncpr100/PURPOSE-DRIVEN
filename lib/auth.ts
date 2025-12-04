
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // Reduced to 7 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            church: true
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          churchId: user.churchId,
          // Remove church object entirely to minimize JWT size
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store user data in JWT for middleware access
        token.sub = user.id
        token.role = user.role  // CRITICAL: Middleware needs this!
        token.churchId = user.churchId
      }
      return token
    },
    async session({ session, token }) {
      // Fetch user data fresh each time to keep JWT minimal
      if (token.sub) {
        const user = await db.user.findUnique({
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
          session.user = {
            id: user.id,
            email: user.email || '',
            name: user.name || '',
            role: user.role,
            churchId: user.churchId || ''
          }
        }
      }
      return session
    },
  }
}
