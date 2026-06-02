-- AlterTable
ALTER TABLE "Application" ADD COLUMN "passportUploadOriginalPath" TEXT;
ALTER TABLE "Application" ADD COLUMN "passportUploadOptimizedPath" TEXT;
ALTER TABLE "Application" ADD COLUMN "passportUploadOriginalSize" INTEGER;
ALTER TABLE "Application" ADD COLUMN "passportUploadOptimizedSize" INTEGER;
ALTER TABLE "Application" ADD COLUMN "passportPhotoOriginalPath" TEXT;
ALTER TABLE "Application" ADD COLUMN "passportPhotoOptimizedPath" TEXT;
ALTER TABLE "Application" ADD COLUMN "passportPhotoOriginalSize" INTEGER;
ALTER TABLE "Application" ADD COLUMN "passportPhotoOptimizedSize" INTEGER;
ALTER TABLE "Application" ADD COLUMN "bankStatementOriginalPath" TEXT;
ALTER TABLE "Application" ADD COLUMN "bankStatementOptimizedPath" TEXT;
ALTER TABLE "Application" ADD COLUMN "bankStatementOriginalSize" INTEGER;
ALTER TABLE "Application" ADD COLUMN "bankStatementOptimizedSize" INTEGER;
ALTER TABLE "Application" ADD COLUMN "supportingDocOriginalPath" TEXT;
ALTER TABLE "Application" ADD COLUMN "supportingDocOptimizedPath" TEXT;
ALTER TABLE "Application" ADD COLUMN "supportingDocOriginalSize" INTEGER;
ALTER TABLE "Application" ADD COLUMN "supportingDocOptimizedSize" INTEGER;
