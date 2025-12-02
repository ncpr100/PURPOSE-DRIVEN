
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "./db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  cookies: {
    sessionToken: {
      name: "auth-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
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
        // Store only user ID in JWT, fetch everything else from DB as needed
        return {
          sub: user.id, // Standard JWT claim for user ID
          exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.sub) {
        // Fetch fresh user data from database for each request
        const user = await db.user.findUnique({
          where: { id: token.sub as string },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            churchId: true,
          }
        })
        
        if (user) {
          return {
            ...session,
            user: {
              ...session.user,
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              churchId: user.churchId,
            }
          }
        }
      }
      return session
    },
  }
}
