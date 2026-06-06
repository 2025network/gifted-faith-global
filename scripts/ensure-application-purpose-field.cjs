const { PrismaClient } = require("@prisma/client");

const databaseUrl = process.env.DATABASE_URL || "";

if (
  !databaseUrl ||
  databaseUrl.includes("DB_USER") ||
  databaseUrl.includes("DB_PASSWORD") ||
  databaseUrl.includes("DB_HOST") ||
  databaseUrl.includes("DB_NAME")
) {
  console.warn(
    "Skipping Application purposeOfTravel setup because DATABASE_URL is missing or still uses placeholder values."
  );
  process.exit(0);
}

const prisma = new PrismaClient();

async function main() {
  const column = await prisma.$queryRawUnsafe(
    "SHOW COLUMNS FROM `Application` LIKE 'purposeOfTravel';"
  );

  if (column.length === 0) {
    await prisma.$executeRawUnsafe(
      "ALTER TABLE `Application` ADD COLUMN `purposeOfTravel` VARCHAR(191) NULL;"
    );
  }

  console.log("Application purposeOfTravel field is ready.");
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
