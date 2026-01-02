// Written by: Christopher Gholmieh
// Imports:

// Authentication:
import { require_user } from "@/library/authentication-helper";

// Prisma:
import { prisma } from "@/library/prisma-client";

// Next:
import { NextResponse } from "next/server";


// POST:
export const POST = async (request: Request) => {
    /**
     * This function is designed to run when our website sends a POST request.
     *  * POST is a type of request indicating that this function will receive data
     *  and perform an action.
     * 
     * This specific function removes a post in our database with the given data.
     *  * The given data is the post's unique identifier.
     *  It will return the removed post, however this might not be useful just yet.
     * 
     * NOTE: If you look at the authentication, you'll see that we use the user identifier
     * to check if they are a teacher in the database. Any authorized individual that is not
     * a teacher should NOT have access to this route.
     */

    try {
        // Variables (Assignment):
        // Identifier:
        const user_identifier: string = await require_user();

        // User:
        const user = await prisma.user.findUnique({
            where: { identifier: user_identifier },
            select: { role: true },
        });

        if (user?.role !== "TEACHER") {
            return NextResponse.json(
                { error: "[!] Forbidden!" },
                { status: 403 }
            );
        }

        // Identifier:
        const { post_identifier } = await request.json();

        if (!post_identifier) {
            return NextResponse.json(
                { error: "[!] Invalid payload!" },
                { status: 400 }
            );
        }

        // Post:
        const deleted_post = await prisma.post.delete({
            where: { identifier: post_identifier },
        })

        // Response:
        return NextResponse.json(deleted_post, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "[!] Unauthorized" },
            { status: 401 }
        );
    }
}