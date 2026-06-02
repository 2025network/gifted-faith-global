const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Application" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "fullName" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "destinationCountry" TEXT NOT NULL,
      "travelPurpose" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'Pending',
      "trackingCode" TEXT NOT NULL,
      "passportUploadPath" TEXT,
      "passportPhotoPath" TEXT,
      "bankStatementPath" TEXT,
      "supportingDocPath" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const columns = await prisma.$queryRawUnsafe(`PRAGMA table_info("Application");`);
  const columnNames = new Set(columns.map((column) => column.name));

  if (!columnNames.has("status")) {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Application" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'Pending';
    `);
  }

  if (!columnNames.has("trackingCode")) {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Application" ADD COLUMN "trackingCode" TEXT;
    `);
  }

  const uploadColumns = [
    "passportUploadPath",
    "passportPhotoPath",
    "bankStatementPath",
    "supportingDocPath",
  ];

  for (const column of uploadColumns) {
    if (!columnNames.has(column)) {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Application" ADD COLUMN "${column}" TEXT;
      `);
    }
  }

  const rowsWithoutTracking = await prisma.$queryRawUnsafe(`
    SELECT "id" FROM "Application" WHERE "trackingCode" IS NULL OR "trackingCode" = '';
  `);

  for (const row of rowsWithoutTracking) {
    await prisma.$executeRawUnsafe(
      `UPDATE "Application" SET "trackingCode" = ? WHERE "id" = ?;`,
      `GFG-2026-${String(row.id).padStart(5, "0")}`,
      row.id
    );
  }

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Application_trackingCode_key"
    ON "Application"("trackingCode");
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
