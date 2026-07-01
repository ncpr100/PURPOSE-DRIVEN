CREATE TABLE IF NOT EXISTS "admin_audit_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "churchId" TEXT,
    "action" TEXT NOT NULL,
    "target" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_audit_log_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "admin_audit_log_userId_idx" ON "admin_audit_log"("userId");
CREATE INDEX IF NOT EXISTS "admin_audit_log_churchId_idx" ON "admin_audit_log"("churchId");
CREATE INDEX IF NOT EXISTS "admin_audit_log_createdAt_idx" ON "admin_audit_log"("createdAt");
