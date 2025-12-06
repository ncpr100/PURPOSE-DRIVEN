import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const optimizedQueries: {
    getSocialMediaAccountsMinimal: (churchId: string) => Promise<any>;
    getSocialMediaPostsPaginated: (churchId: string, page?: number, limit?: number, filters?: {
        status?: string;
        campaignId?: string;
    }) => Promise<{
        posts: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getCampaignStats: (churchId: string) => Promise<{
        campaigns: any;
        stats: any;
    }>;
    getMetricsAggregated: (churchId: string, filters: {
        platform?: string;
        accountId?: string;
        startDate?: Date;
        endDate?: Date;
        metricType?: string;
    }) => Promise<any>;
};
export declare const dbCleanup: {
    cleanupOldMetrics: () => Promise<any>;
    cleanupOrphanedPosts: () => Promise<any>;
};
export declare const closeDbConnection: () => Promise<void>;
export declare const checkDbHealth: () => Promise<boolean>;
//# sourceMappingURL=db-utils.d.ts.map