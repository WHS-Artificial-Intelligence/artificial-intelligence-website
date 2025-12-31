// Written by: Christopher Gholmieh
// Imports:

// Prisma:
import { prisma } from "@/library/prisma-client";

// Clerk:
import { auth as authentication } from "@clerk/nextjs/server";

// React:
import { type ReactNode } from "react";

// Next:
import { redirect } from "next/navigation";


// Layout:
const Layout = async ({
    children
}: { children: Readonly<ReactNode> }) => {
    // Variables (Assignment):
    // Identifier:
    const { userId: user_identifier } = await authentication();

    if (!user_identifier) {
        redirect("/");
    }

    // User:
    const user = await prisma.user.findUnique({
        /* Where: */
        where: { clerk_identifier: user_identifier },
        
        /* Select: */
        select: { role: true }
    });

    if (!user || user.role !== "TEACHER") {
        redirect("/");
    }

    // Logic:
    return children;
}

// Exports:
export default Layout;