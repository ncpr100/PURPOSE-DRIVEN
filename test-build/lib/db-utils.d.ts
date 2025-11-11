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
            campaign: {
                name: string;
                id: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            churchId: string;
            status: string;
            content: string;
            title: string | null;
            scheduledAt: Date | null;
            campaignId: string | null;
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
                posts: number;
            };
        } & {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            churchId: string;
            status: string;
            currency: string;
            startDate: Date;
            endDate: Date | null;
            budget: number | null;
            metrics: string | null;
            objectives: string | null;
            targetAudience: string | null;
            platforms: string;
            tags: string | null;
            managerId: string;
        })[];
        stats: {
            total: number;
            statuses: Record<string, number>;
            platforms: Record<string, number>;
            totalBudget: number;
            totalPosts: number;
        };
    }>;
    getMetricsAggregated: (churchId: string, filters: {
        platform?: string;
        accountId?: string;
        startDate?: Date;
        endDate?: Date;
        metricType?: string;
    }) => Promise<({
        account: {
            platform: string;
            username: string | null;
            displayName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        churchId: string;
        metadata: string | null;
        campaignId: string | null;
        metricType: string;
        postId: string | null;
        accountId: string;
        platform: string;
        date: Date;
        value: number;
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