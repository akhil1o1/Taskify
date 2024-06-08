import { PrismaClient } from "@prisma/client";

// declared as typescript global and additional checks to avoid multiple instances of PrismaClient to be created during hot reload
declare global {
   var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === "production") {
   globalThis.prisma = db;
}
