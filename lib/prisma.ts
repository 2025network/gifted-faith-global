import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databasePlaceholderTokens = ["DB_USER", "DB_PASSWORD", "DB_HOST", "DB_NAME"];

export function isDatabaseConfigured() {
  const databaseUrl = process.env.DATABASE_URL ?? "";

  if (!databaseUrl || databasePlaceholderTokens.some((token) => databaseUrl.includes(token))) {
    return false;
  }

  try {
    const url = new URL(databaseUrl);
    return Boolean(url.protocol && url.hostname);
  } catch {
    return false;
  }
}

export const databaseUnavailableMessage =
  "Database is not configured. Set a valid DATABASE_URL before using database-backed features.";

function getPrismaClient() {
  if (!isDatabaseConfigured()) {
    throw new Error(databaseUnavailableMessage);
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }

  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    return Reflect.get(getPrismaClient(), property, receiver);
  },
});
