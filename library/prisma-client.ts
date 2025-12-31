// Written by: Christopher Gholmieh
// Imports:

// Prisma:
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


// Variables (Assignment):
// Global:
const global_for_prisma = global as unknown as {
    prisma: PrismaClient | undefined;
};

// Exports:
export const prisma = global_for_prisma.prisma ??
    new PrismaClient({
        /* Adapter: */
        adapter: new PrismaPg({
            /* Connection: */
            connectionString: process.env.DATABASE_URL
        }),

        /* Log: */
        log: ["query"]
    });

// Miscellaneous:
if (process.env.NODE_ENV !== "production") {
    global_for_prisma.prisma = prisma;
}