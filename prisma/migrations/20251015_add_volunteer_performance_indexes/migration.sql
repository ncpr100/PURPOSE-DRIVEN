-- ================================================================
-- VOLUNTEER SYSTEM PERFORMANCE INDEXES MIGRATION
-- ================================================================
-- Purpose: Add critical database indexes to optimize volunteer system queries
-- Expected Impact: 10-100x speedup on date range and filtering queries
-- JIRA: CRITICAL-005 from Volunteer System Audit
-- Created: 2025-10-15
-- ================================================================

-- Index 1: VolunteerAssignment.date
-- Use Case: Filter assignments by date range (GET /api/volunteer-assignments)
-- Query Pattern: WHERE date >= ? AND date <= ?
-- Expected Impact: 50-100x speedup on date range queries
-- Estimated Rows Scanned: 10,000+ → 100-500 (with index)
CREATE INDEX IF NOT EXISTS "idx_volunteer_assignments_date" 
ON "volunteer_assignments"("date" DESC);

-- Index 2: VolunteerAssignment (volunteerId, date) - COMPOSITE
-- Use Case: Get volunteer assignment history (conflicts, scheduling)
-- Query Pattern: WHERE volunteerId = ? AND date = ?
-- Expected Impact: 100x+ speedup on conflict detection queries
-- Critical for: Conflict detection in POST /api/volunteer-assignments
CREATE INDEX IF NOT EXISTS "idx_volunteer_assignments_volunteer_date" 
ON "volunteer_assignments"("volunteerId", "date" DESC);

-- Index 3: VolunteerRecommendation (ministryId, status)
-- Use Case: Filter recommendations by ministry and status
-- Query Pattern: WHERE ministryId = ? AND status = ? AND validUntil >= NOW()
-- Expected Impact: 20-50x speedup on recommendation filtering
-- Used in: GET /api/volunteer-matching with ministryId filter
CREATE INDEX IF NOT EXISTS "idx_volunteer_recommendations_ministry_status" 
ON "volunteer_recommendations"("ministryId", "status", "validUntil" DESC);

-- Index 4: MemberSpiritualProfile.assessmentDate
-- Use Case: Find members with recent spiritual assessments
-- Query Pattern: WHERE assessmentDate >= ? ORDER BY assessmentDate DESC
-- Expected Impact: 10-30x speedup on recent assessment queries
-- Used in: Volunteer qualification checks, gap analysis
CREATE INDEX IF NOT EXISTS "idx_member_spiritual_profiles_assessment_date" 
ON "member_spiritual_profiles"("assessmentDate" DESC);

-- ================================================================
-- VERIFICATION QUERIES (Run these to test index usage)
-- ================================================================
-- 
-- Test Index 1:
-- EXPLAIN ANALYZE SELECT * FROM volunteer_assignments 
-- WHERE date >= NOW() - INTERVAL '30 days' AND date <= NOW() + INTERVAL '30 days'
-- ORDER BY date DESC LIMIT 50;
--
-- Expected: Should use "idx_volunteer_assignments_date"
-- Index Scan on volunteer_assignments using idx_volunteer_assignments_date
--
-- Test Index 2:
-- EXPLAIN ANALYZE SELECT * FROM volunteer_assignments 
-- WHERE "volunteerId" = 'cm123456789' AND date = '2025-10-15'
-- AND status IN ('ASIGNADO', 'CONFIRMADO');
--
-- Expected: Should use "idx_volunteer_assignments_volunteer_date"
-- Index Scan on volunteer_assignments using idx_volunteer_assignments_volunteer_date
--
-- Test Index 3:
-- EXPLAIN ANALYZE SELECT * FROM volunteer_recommendations 
-- WHERE "ministryId" = 'cm123456789' AND status = 'PENDING' 
-- AND "validUntil" >= NOW() ORDER BY "matchScore" DESC;
--
-- Expected: Should use "idx_volunteer_recommendations_ministry_status"
-- Index Scan on volunteer_recommendations using idx_volunteer_recommendations_ministry_status
--
-- Test Index 4:
-- EXPLAIN ANALYZE SELECT * FROM member_spiritual_profiles 
-- WHERE "assessmentDate" >= NOW() - INTERVAL '90 days'
-- ORDER BY "assessmentDate" DESC LIMIT 100;
--
-- Expected: Should use "idx_member_spiritual_profiles_assessment_date"
-- Index Scan on member_spiritual_profiles using idx_member_spiritual_profiles_assessment_date
-- ================================================================

-- ================================================================
-- ROLLBACK (if needed)
-- ================================================================
-- To revert this migration:
-- DROP INDEX IF EXISTS "idx_volunteer_assignments_date";
-- DROP INDEX IF EXISTS "idx_volunteer_assignments_volunteer_date";
-- DROP INDEX IF EXISTS "idx_volunteer_recommendations_ministry_status";
-- DROP INDEX IF EXISTS "idx_member_spiritual_profiles_assessment_date";
-- ================================================================
