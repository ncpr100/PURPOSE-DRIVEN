"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDbHealth = exports.closeDbConnection = exports.dbCleanup = exports.optimizedQueries = exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Database connection with optimizations
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ?? new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
// Optimized query helpers
exports.optimizedQueries = {
    // Get social media accounts with minimal data
    getSocialMediaAccountsMinimal: async (churchId) => {
        return exports.prisma.social_media_accounts.findMany({
            where: {
                churchId,
                isActive: true
            },
            select: {
                id: true,
                platform: true,
                username: true,
                displayName: true,
                isActive: true,
                lastSync: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
    },
    // Get posts with pagination
    getSocialMediaPostsPaginated: async (churchId, page = 1, limit = 10, filters) => {
        const skip = (page - 1) * limit;
        const where = {
            churchId,
            ...(filters?.status && { status: filters.status }),
            ...(filters?.campaignId && { campaignId: filters.campaignId })
        };
        const [posts, total] = await Promise.all([
            exports.prisma.social_media_posts.findMany({
                where,
                include: {
                    marketing_campaigns: {
                        select: { id: true, name: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            exports.prisma.social_media_posts.count({ where })
        ]);
        return {
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    },
    // Get campaign stats efficiently
    getCampaignStats: async (churchId) => {
        const campaigns = await exports.prisma.marketing_campaigns.findMany({
            where: { churchId },
            include: {
                _count: {
                    select: { social_media_posts: true }
                }
            }
        });
        const stats = campaigns.reduce((acc, campaign) => {
            acc.total += 1;
            acc.statuses[campaign.status] = (acc.statuses[campaign.status] || 0) + 1;
            acc.totalBudget += campaign.budget || 0;
            acc.totalPosts += campaign._count?.social_media_posts || 0;
            if (campaign.platforms) {
                const platforms = JSON.parse(campaign.platforms);
                platforms.forEach((platform) => {
                    acc.platforms[platform] = (acc.platforms[platform] || 0) + 1;
                });
            }
            return acc;
        }, {
            total: 0,
            statuses: {},
            platforms: {},
            totalBudget: 0,
            totalPosts: 0
        });
        return { campaigns, stats };
    },
    // Get metrics with aggregation
    getMetricsAggregated: async (churchId, filters) => {
        const where = {
            churchId,
            ...(filters.platform && { platform: filters.platform }),
            ...(filters.accountId && { accountId: filters.accountId }),
            ...(filters.metricType && { metricType: filters.metricType }),
            ...(filters.startDate && filters.endDate && {
                date: {
                    gte: filters.startDate,
                    lte: filters.endDate
                }
            })
        };
        // Get raw metrics and account info in one query
        const metrics = await exports.prisma.social_media_metrics.findMany({
            where,
            include: {
                social_media_accounts: {
                    select: {
                        platform: true,
                        username: true,
                        displayName: true
                    }
                }
            },
            orderBy: { date: 'desc' },
            take: 1000 // Limit to prevent memory issues
        });
        return metrics;
    }
};
// Database cleanup utilities
exports.dbCleanup = {
    // Clean up old metrics data (keep last 6 months)
    cleanupOldMetrics: async () => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const deleted = await exports.prisma.social_media_metrics.deleteMany({
            where: {
                date: {
                    lt: sixMonthsAgo
                }
            }
        });
        return deleted.count;
    },
    // Clean up orphaned posts
    cleanupOrphanedPosts: async () => {
        const deleted = await exports.prisma.social_media_posts.deleteMany({
            where: {
                AND: [
                    { status: 'DRAFT' },
                    {
                        createdAt: {
                            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days old
                        }
                    }
                ]
            }
        });
        return deleted.count;
    }
};
// Connection management
const closeDbConnection = async () => {
    await exports.prisma.$disconnect();
};
exports.closeDbConnection = closeDbConnection;
// Health check
const checkDbHealth = async () => {
    try {
        await exports.prisma.$queryRaw `SELECT 1`;
        return true;
    }
    catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
};
exports.checkDbHealth = checkDbHealth;
//# sourceMappingURL=db-utils.js.map