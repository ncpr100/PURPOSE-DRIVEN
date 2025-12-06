"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOptions = void 0;
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
const db_1 = require("./db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// NOTE: JWT type extensions are in lib/types.ts to avoid duplication
exports.authOptions = {
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // Reduced to 7 days
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        (0, credentials_1.default)({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                const user = await db_1.db.users.findUnique({
                    where: {
                        email: credentials.email
                    },
                    include: {
                        churches: true
                    }
                });
                if (!user || !user.password) {
                    return null;
                }
                const isPasswordValid = await bcryptjs_1.default.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    return null;
                }
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    churchId: user.churchId,
                    // Remove church object entirely to minimize JWT size
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Store user data in JWT for middleware access
                token.sub = user.id;
                token.role = user.role; // CRITICAL: Middleware needs this!
                token.churchId = user.churchId;
            }
            return token;
        },
        async session({ session, token }) {
            // Fetch user data fresh each time to keep JWT minimal
            if (token.sub) {
                const user = await db_1.db.users.findUnique({
                    where: { id: token.sub },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                        churchId: true
                    }
                });
                if (user) {
                    session.user = {
                        id: user.id,
                        email: user.email || '',
                        name: user.name || '',
                        role: user.role,
                        churchId: user.churchId || ''
                    };
                }
            }
            return session;
        },
    }
};
//# sourceMappingURL=auth.js.map