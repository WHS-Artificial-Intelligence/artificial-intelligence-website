// Written by: Sean Fang
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
     * NOTE: Authorization is different from post removal:
     *  * Both teachers and the comment author are allowed to remove comments.
     */

    try {
        // Variables (Assignment):
        // Identifier:
        const user_identifier: string = await require_user();

        // Identifier:
        const { comment_identifier } = await request.json();

        if (!comment_identifier) {
            return NextResponse.json(
                { error: "[!] Invalid payload!" },
                { status: 400 }
            );
        }

        // Comment:
        const comment = await prisma.comment.findUnique({
            /* Where: */
            where: { identifier: comment_identifier },

            /* Select: */
            select: {
                /* Identifier: */
                author_identifier: true,

                /* Deleted: */
                deleted: true,
            },
        });

        // User:
        const user = await prisma.user.findUnique({
            /* Where: */
            where: { 
                /* Identifier: */
                clerk_identifier: user_identifier
            },

            /* Select: */
            select: { 
                /* Role: */
                role: true 
            },
        });

        // Author:
        const is_author = comment?.author_identifier === user_identifier;

        // Teacher:
        const is_teacher = user?.role === "TEACHER";

        // Validation:
        if (!is_author && !is_teacher) {
            return NextResponse.json(
                { error: "[!] Forbidden!" },
                { status: 403 }
            );
        }

        // Deletion:
        const deleted_comment = await prisma.comment.update({
            /* Where: */
            where: { 
                /* Identifier: */
                identifier: comment_identifier 
            },

            data: {
                /* Deleted: */
                deleted: true,

                /* Timestamp: */
                deletion_timestamp: new Date(),
            },
        });

        // Response:
        return NextResponse.json(deleted_comment, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "[!] Unauthorized" },
            { status: 401 }
        );
    }
};