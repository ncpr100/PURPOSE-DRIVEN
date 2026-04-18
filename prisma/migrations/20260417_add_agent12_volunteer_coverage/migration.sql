-- Agent 12: Volunteer Coverage Engine
-- Migration: 20260417_add_agent12_volunteer_coverage

-- Enum: CoverageStatus
CREATE TYPE "CoverageStatus" AS ENUM (
  'UNCONFIRMED',
  'CONFIRMED',
  'CANCELLED',
  'COVERED',
  'UNPROTECTED',
  'NO_BACKUP_ASSIGNED'
);

-- Table 1: Backup roster
CREATE TABLE "volunteer_backup_rosters" (
    "id"                 TEXT NOT NULL,
    "churchId"           TEXT NOT NULL,
    "primaryVolunteerId" TEXT NOT NULL,
    "backupVolunteerId"  TEXT NOT NULL,
    "ministryId"         TEXT,
    "priorityOrder"      INTEGER NOT NULL,
    "skills"             TEXT[],
    "isActive"           BOOLEAN NOT NULL DEFAULT true,
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volunteer_backup_rosters_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "volunteer_backup_rosters_churchId_primaryVolunteerId_backupVolunteerId_ministryId_key"
  ON "volunteer_backup_rosters"("churchId", "primaryVolunteerId", "backupVolunteerId", "ministryId");

ALTER TABLE "volunteer_backup_rosters"
  ADD CONSTRAINT "volunteer_backup_rosters_churchId_fkey"
  FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Table 2: Coverage status per event slot
CREATE TABLE "event_coverage_status" (
    "id"              TEXT NOT NULL,
    "churchId"        TEXT NOT NULL,
    "eventId"         TEXT NOT NULL,
    "volunteerId"     TEXT NOT NULL,
    "role"            TEXT NOT NULL,
    "status"          "CoverageStatus" NOT NULL DEFAULT 'UNCONFIRMED',
    "confirmedAt"     TIMESTAMP(3),
    "cancelledAt"     TIMESTAMP(3),
    "cancelReason"    TEXT,
    "coveredById"     TEXT,
    "coverageMethod"  TEXT,
    "lastContactedAt" TIMESTAMP(3),
    "contactAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_coverage_status_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "event_coverage_status_eventId_volunteerId_role_key"
  ON "event_coverage_status"("eventId", "volunteerId", "role");

ALTER TABLE "event_coverage_status"
  ADD CONSTRAINT "event_coverage_status_churchId_fkey"
  FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Table 3: Cascade contact log
CREATE TABLE "coverage_contact_log" (
    "id"                   TEXT NOT NULL,
    "churchId"             TEXT NOT NULL,
    "coverageStatusId"     TEXT NOT NULL,
    "contactedVolunteerId" TEXT NOT NULL,
    "channel"              TEXT NOT NULL,
    "messageBody"          TEXT NOT NULL,
    "sentAt"               TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseReceived"     BOOLEAN NOT NULL DEFAULT false,
    "responseAt"           TIMESTAMP(3),
    "responseType"         TEXT,

    CONSTRAINT "coverage_contact_log_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "coverage_contact_log"
  ADD CONSTRAINT "coverage_contact_log_churchId_fkey"
  FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Table 4: Weekly coverage reports
CREATE TABLE "ministry_coverage_reports" (
    "id"               TEXT NOT NULL,
    "churchId"         TEXT NOT NULL,
    "weekStartDate"    TIMESTAMP(3) NOT NULL,
    "totalSlots"       INTEGER NOT NULL,
    "confirmedSlots"   INTEGER NOT NULL,
    "cancelledSlots"   INTEGER NOT NULL,
    "coveredSlots"     INTEGER NOT NULL,
    "unprotectedSlots" INTEGER NOT NULL,
    "coverageRate"     DOUBLE PRECISION NOT NULL,
    "generatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ministry_coverage_reports_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ministry_coverage_reports"
  ADD CONSTRAINT "ministry_coverage_reports_churchId_fkey"
  FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
