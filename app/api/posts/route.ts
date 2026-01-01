// Written by: Christopher Gholmieh
// Imports:

// Authentication:
import { require_user } from "@/library/authentication-helper";

// Prisma:
import { prisma } from "@/library/prisma-client";

// Next:
import { NextResponse } from "next/server";


// GET:
export const GET = async (request: Request) => {
    try {
        // Authentication:
        await require_user();

        // Posts:
        const posts = await prisma.post.findMany({
            /* Select: */
            select: {
                /* Author: */
                author: true,

                /* Content: */
                content: true,

                /* Comments: */
                comments: true,
            },

            /* Order: */
            orderBy: {
                /* Timestamp: */
                creation_timestamp: "desc",
            },

            /* Where: */
            where: {
                /* Approved: */
                approved: true,
            },

            /* Take: */
            take: 15,
        })

        // Response:
        return NextResponse.json(posts, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "[!] Unauthorized or internal server error!" },
            { status: 401 }
        );
    }
}