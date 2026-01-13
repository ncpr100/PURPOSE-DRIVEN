export type UserRole = string;
export type ExtendedUser = any & {
    church?: any | null;
};
export type ExtendedMember = any & {
    church?: any;
    user?: any | null;
};
export type ExtendedSermon = any & {
    church?: any;
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
            church?: any | null;
        };
    }
    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role: UserRole;
        churchId: string | null;
        church?: any | null;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: UserRole;
        churchId: string | null;
        church?: any | null;
    }
}
//# sourceMappingURL=types.d.ts.map