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
                console.log('🔐 AUTH: authorize() called with email:', credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.log('❌ AUTH: Missing credentials');
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
                    console.log('❌ AUTH: User not found or no password');
                    return null;
                }
                console.log('✅ AUTH: User found:', user.email, 'Role:', user.role);
                const isPasswordValid = await bcryptjs_1.default.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    console.log('❌ AUTH: Invalid password');
                    return null;
                }
                console.log('✅ AUTH: Password valid, returning user object');
                console.log('   ID:', user.id);
                console.log('   Role:', user.role);
                console.log('   churchId:', user.churchId);
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
                console.log('🔐 JWT: Storing user in token');
                console.log('   user.id:', user.id);
                console.log('   user.role:', user.role);
                console.log('   user.churchId:', user.churchId);
                // Store user data in JWT for middleware access
                token.sub = user.id;
                token.role = user.role; // CRITICAL: Middleware needs this!
                token.churchId = user.churchId;
            }
            return token;
        },
        async session({ session, token }) {
            console.log('🔐 SESSION: Building session from token');
            console.log('   token.sub:', token.sub);
            console.log('   token.role:', token.role);
            console.log('   token.churchId:', token.churchId);
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
                    console.log('✅ SESSION: User fetched from DB');
                    console.log('   role:', user.role);
                    console.log('   churchId:', user.churchId);
                    session.user = {
                        id: user.id,
                        email: user.email || '',
                        name: user.name || '',
                        role: user.role,
                        churchId: user.churchId || ''
                    };
                }
                else {
                    console.log('❌ SESSION: User not found in DB for token.sub:', token.sub);
                }
            }
            return session;
        },
    }
};
//# sourceMappingURL=auth.js.map