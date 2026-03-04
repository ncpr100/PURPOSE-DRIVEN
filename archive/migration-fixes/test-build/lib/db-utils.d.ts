import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const optimizedQueries: {
    getSocialMediaAccountsMinimal: (churchId: string) => Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        username: string | null;
        displayName: string | null;
        lastSync: Date | null;
    }[]>;
    getSocialMediaPostsPaginated: (churchId: string, page?: number, limit?: number, filters?: {
        status?: string;
        campaignId?: string;
    }) => Promise<{
        posts: ({
            marketing_campaigns: {
                name: string;
                id: string;
            } | null;
        } & {
            id: string;
            churchId: string;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            status: string;
            scheduledAt: Date | null;
            campaignId: string | null;
            content: string;
            publishedAt: Date | null;
            platforms: string;
            mediaUrls: string | null;
            accountIds: string;
            postIds: string | null;
            engagement: string | null;
            hashtags: string | null;
            mentions: string | null;
            authorId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getCampaignStats: (churchId: string) => Promise<{
        campaigns: ({
            _count: {
                social_media_posts: number;
            };
        } & {
            name: string;
            id: string;
            churchId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tags: string | null;
            startDate: Date;
            endDate: Date | null;
            budget: number | null;
            status: string;
            currency: string;
            metrics: string | null;
            objectives: string | null;
            targetAudience: string | null;
            platforms: string;
            managerId: string;
        })[];
        stats: any;
    }>;
    getMetricsAggregated: (churchId: string, filters: {
        platform?: string;
        accountId?: string;
        startDate?: Date;
        endDate?: Date;
        metricType?: string;
    }) => Promise<({
        social_media_accounts: {
            platform: string;
            username: string | null;
            displayName: string | null;
        };
    } & {
        id: string;
        churchId: string;
        createdAt: Date;
        metadata: string | null;
        platform: string;
        campaignId: string | null;
        metricType: string;
        value: number;
        postId: string | null;
        accountId: string;
        date: Date;
        periodType: string;
        collectedAt: Date;
    })[]>;
};
export declare const dbCleanup: {
    cleanupOldMetrics: () => Promise<number>;
    cleanupOrphanedPosts: () => Promise<number>;
};
export declare const closeDbConnection: () => Promise<void>;
export declare const checkDbHealth: () => Promise<boolean>;
//# sourceMappingURL=db-utils.d.ts.map