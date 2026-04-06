import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from "bcryptjs";

// NOTE: JWT type extensions are in lib/types.ts to avoid duplication

// Auth debug logging: silenced in production to prevent leaking user data
const devLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") console.log(...args);
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // Reduced to 7 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Cookie configuration for production
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        devLog("🔐 AUTH: authorize() called with email:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          devLog("❌ AUTH: Missing credentials");
          return null;
        }

        // Database authentication ONLY - no fallback users
        try {
          const user = await db.users.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            devLog("❌ AUTH: User not found or no password in database");
            return null;
          }

          devLog("✅ AUTH: User found:", user.email, "Role:", user.role);

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            devLog("❌ AUTH: Invalid password");
            return null;
          }

          devLog("✅ AUTH: Password valid, returning user object");
          devLog("   ID:", user.id);
          devLog("   Role:", user.role);
          devLog("   churchId:", user.churchId);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            churchId: user.churchId,
          };
        } catch (error) {
          console.error("❌ AUTH: Database connection FAILED");
          console.error(
            "Error type:",
            error instanceof Error ? error.constructor.name : "Unknown",
          );
          console.error(
            "Error message:",
            error instanceof Error ? error.message : String(error),
          );
          console.error("Full error:", JSON.stringify(error, null, 2));

          // Database authentication failed - reject login
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        devLog("🔐 JWT: Storing user in token");
        devLog("   user.id:", user.id);
        devLog("   user.role:", user.role);
        devLog("   user.churchId:", user.churchId);

        // Store user data in JWT for middleware access
        token.sub = user.id;
        token.role = user.role; // CRITICAL: Middleware needs this!
        token.churchId = user.churchId;
        token.email = user.email; // Store for fallback sessions
        token.name = user.name; // Store for fallback sessions
      }
      return token;
    },
    async session({ session, token }) {
      devLog("🔐 SESSION: Building session from token");
      devLog("   token.sub:", token.sub);
      devLog("   token.role:", token.role);
      devLog("   token.churchId:", token.churchId);

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
              churchId: true,
            },
          });

          if (user) {
            devLog("✅ SESSION: User fetched from DB");
            devLog("   role:", user.role);
            devLog("   churchId:", user.churchId);

            session.user = {
              id: user.id,
              email: user.email || "",
              name: user.name || "",
              role: user.role,
              churchId: user.churchId || "",
            };
          } else {
            devLog(
              "❌ SESSION: User not found in DB for token.sub:",
              token.sub,
            );
          }
        } catch (error) {
          devLog("⚠️ SESSION: Database connection failed, using token data");
          devLog(
            "Error:",
            error instanceof Error ? error.message : String(error),
          );
          // Fallback to token data when database is unavailable
          session.user = {
            id: token.sub,
            email: token.email || "",
            name: token.name || "",
            role: token.role,
            churchId: token.churchId || "",
          };
        }
      }
      return session;
    },
  },
};
