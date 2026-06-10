-- CreateTable
CREATE TABLE "user_mfa_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totpSecret" TEXT,
    "backupCodes" TEXT[],
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_mfa_settings_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "user_mfa_settings_userId_key" ON "user_mfa_settings"("userId");
-- CreateIndex
CREATE INDEX "user_mfa_settings_userId_idx" ON "user_mfa_settings"("userId");
-- CreateIndex
CREATE INDEX "user_mfa_settings_isEnabled_idx" ON "user_mfa_settings"("isEnabled");
-- AddForeignKey
ALTER TABLE "user_mfa_settings" ADD CONSTRAINT "user_mfa_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
