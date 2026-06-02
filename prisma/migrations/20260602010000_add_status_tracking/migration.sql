-- AlterTable
ALTER TABLE "Application" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'Pending';
ALTER TABLE "Application" ADD COLUMN "trackingCode" TEXT;

-- Backfill existing rows. New installations use the full schema in init migration.
UPDATE "Application"
SET "trackingCode" = 'GFG-2026-' || substr('00000' || "id", -5, 5)
WHERE "trackingCode" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Application_trackingCode_key" ON "Application"("trackingCode");
