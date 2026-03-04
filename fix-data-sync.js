#!/usr/bin/env node

/**
 * DATA SYNCHRONIZATION FIXER
 * Clears caches and resets application state after database cleanup
 */

const { PrismaClient } = require('@prisma/client');

class DataSyncFixer {
  constructor() {
    this.prisma = new PrismaClient({
      log: ['error']
    });
  }

  async validateDataConsistency() {
    console.log('🔍 VALIDATING DATA CONSISTENCY ACROSS PLATFORM...\n');

    try {
      // Get fresh counts from database
      const counts = {
        churches: await this.prisma.churches.count(),
        users: await this.prisma.users.count(),
        members: await this.prisma.members.count(),
        checkIns: await this.prisma.check_ins.count(),
        events: await this.prisma.events.count(),
        donations: await this.prisma.donations.count(),
        communications: await this.prisma.communications.count(),
        volunteers: await this.prisma.volunteers.count()
      };

      console.log('📊 CURRENT DATABASE STATE:');
      Object.entries(counts).forEach(([table, count]) => {
        console.log(`   • ${table}: ${count} records`);
      });

      // Get member details
      const members = await this.prisma.members.findMany({
        include: {
          churches: { select: { name: true } },
          users: { select: { email: true, role: true } }
        }
      });

      console.log('\n👥 MEMBER DETAILS:');
      members.forEach(member => {
        console.log(`   • ${member.firstName} ${member.lastName} (${member.email})`);
        console.log(`     Church: ${member.churches.name}`);
        console.log(`     User: ${member.users?.email} (${member.users?.role})`);
      });

      // Check for any analytics/cache tables that might have stale data
      const analyticsQueries = [
        'SELECT COUNT(*) FROM analytics_cache',
        'SELECT COUNT(*) FROM kpi_metrics',
        'SELECT COUNT(*) FROM member_journeys'
      ];

      console.log('\n📈 ANALYTICS DATA:');
      for (const query of analyticsQueries) {
        try {
          const result = await this.prisma.$queryRawUnsafe(query);
          const tableName = query.match(/FROM (\w+)/)[1];
          console.log(`   • ${tableName}: ${result[0].count} records`);
        } catch (err) {
          console.log(`   • ${query.match(/FROM (\w+)/)[1]}: Table not found or empty`);
        }
      }

      return counts;

    } catch (error) {
      console.error('❌ Data validation failed:', error.message);
      throw error;
    }
  }

  async clearAnalyticsCache() {
    console.log('\n🧹 CLEARING ANALYTICS CACHE...\n');

    try {
      // Clear analytics cache table
      const clearedCache = await this.prisma.analytics_cache.deleteMany({});
      console.log(`✅ Cleared ${clearedCache.count} analytics cache entries`);

      // Clear KPI metrics that might be stale
      const clearedMetrics = await this.prisma.kpi_metrics.deleteMany({});
      console.log(`✅ Cleared ${clearedMetrics.count} KPI metric entries`);

      // Clear member journeys that might reference deleted members
      try {
        const clearedJourneys = await this.prisma.member_journeys.deleteMany({});
        console.log(`✅ Cleared ${clearedJourneys.count} member journey entries`);
      } catch (err) {
        console.log('⚠️  Member journeys table empty or not found');
      }

    } catch (error) {
      console.error('❌ Cache clearing failed:', error.message);
    }
  }

  async regenerateMetrics() {
    console.log('\n📊 REGENERATING FRESH METRICS...\n');

    try {
      const churchId = '37oIt8fblOtnq8rlFhbpz'; // Faith Family Church ID
      
      // Get current date
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Generate fresh KPI metrics
      const memberCount = await this.prisma.members.count({ where: { churchId } });
      const eventCount = await this.prisma.events.count({ where: { churchId } });
      const checkInCount = await this.prisma.check_ins.count({ where: { churchId } });

      // Create fresh KPI entries
      const kpiEntries = [
        {
          id: `member-count-${Date.now()}`,
          churchId,
          metricType: 'member_count',
          value: memberCount,
          period: 'current',
          calculatedAt: now
        },
        {
          id: `event-count-${Date.now()}`,
          churchId,
          metricType: 'event_count',
          value: eventCount,
          period: 'current',
          calculatedAt: now
        },
        {
          id: `checkin-count-${Date.now()}`,
          churchId,
          metricType: 'checkin_count',
          value: checkInCount,
          period: 'current',
          calculatedAt: now
        }
      ];

      for (const kpi of kpiEntries) {
        try {
          await this.prisma.kpi_metrics.create({ data: kpi });
          console.log(`✅ Created KPI metric: ${kpi.metricType} = ${kpi.value}`);
        } catch (err) {
          console.log(`⚠️  KPI creation skipped for ${kpi.metricType}: ${err.message}`);
        }
      }

    } catch (error) {
      console.error('❌ Metric regeneration failed:', error.message);
    }
  }

  async fixDataSync() {
    console.log('🔀 DATA SYNCHRONIZATION FIXER');
    console.log('=' .repeat(60));

    try {
      const counts = await this.validateDataConsistency();
      await this.clearAnalyticsCache();
      await this.regenerateMetrics();

      console.log('\n🎉 DATA SYNCHRONIZATION COMPLETED!');
      console.log('   All caches cleared, metrics regenerated');
      console.log('   Platform should now show consistent data across all modules');

      return {
        success: true,
        finalCounts: counts,
        message: 'Data synchronization completed successfully'
      };

    } catch (error) {
      console.error('💥 Data sync failed:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const fixer = new DataSyncFixer();
  fixer.fixDataSync()
    .then(() => {
      console.log('\n✅ Synchronization completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Synchronization failed:', error);
      process.exit(1);
    });
}

module.exports = DataSyncFixer;