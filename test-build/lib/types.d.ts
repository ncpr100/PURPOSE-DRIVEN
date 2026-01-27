import { users, churches, members, sermons, UserRole } from "@prisma/client";
export type ExtendedUser = users & {
    church?: churches | null;
};
export type ExtendedMember = members & {
    church?: churches;
    user?: users | null;
};
export type ExtendedSermon = sermons & {
    church?: churches;
};
export interface DashboardStats {
    totalMembers: number;
    totalSermons: number;
    upcomingEvents: number;
    newMembersThisMonth: number;
}
export interface SermonGenerationRequest {
    topic: string;
    scripture?: string;
    audience?: string;
    duration?: string;
    language: 'es' | 'en';
}
export interface SermonGenerationResponse {
    outline: string;
    introduction: string;
    mainPoints: string[];
    conclusion: string;
    bibleVerses: string[];
}
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role: UserRole;
            churchId: string | null;
            church?: churches | null;
        };
    }
    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role: UserRole;
        churchId: string | null;
        church?: churches | null;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: UserRole;
        churchId: string | null;
        church?: churches | null;
    }
}
export { UserRole };
//# sourceMappingURL=types.d.ts.map