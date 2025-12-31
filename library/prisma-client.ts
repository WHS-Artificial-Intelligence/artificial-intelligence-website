// Written by: Christopher Gholmieh
// Imports:
import { PrismaClient } from "@prisma/client";


// Variables (Assignment):
// Global:
const global_for_prisma = global as unknown as {
    prisma: PrismaClient | undefined;
};

// Exports:
export const prisma = global_for_prisma.prisma ??
    new PrismaClient({
        /* Log: */
        log: ["query"]
    });

// Miscellaneous:
if (process.env.NODE_ENV !== "production") {
    global_for_prisma.prisma = prisma;
}