
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
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
        token.sub = user.id
        // Store minimal data in JWT to avoid 431 errors
      }
      return token
    },
    async session({ session, token }) {
      if (token.sub) {
        // Fetch only essential user data - no church object to minimize size
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
