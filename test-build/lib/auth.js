"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOptions = void 0;
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
const prisma_adapter_1 = require("@next-auth/prisma-adapter");
const db_1 = require("./db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.authOptions = {
    adapter: (0, prisma_adapter_1.PrismaAdapter)(db_1.db),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
    },
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
                const user = await db_1.db.user.findUnique({
                    where: {
                        email: credentials.email
                    },
                    include: {
                        church: true
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
                    church: user.church
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    role: user.role,
                    churchId: user.churchId,
                    church: user.church,
                };
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role,
                    churchId: token.churchId,
                    church: token.church,
                }
            };
        },
    }
};
//# sourceMappingURL=auth.js.map