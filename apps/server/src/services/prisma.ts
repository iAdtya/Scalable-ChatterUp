import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({
  log: ["query", "info", "warn"],
});

export default prismaClient;
