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
        const { comment_identifier } = await request.json();

        if (!comment_identifier) {
            return NextResponse.json(
                { error: "[!] Invalid payload!" },
                { status: 400 }
            );
        }

        // Comment:
        const comment = await prisma.comment.findUnique({
            where: { identifier: comment_identifier },
            select: {
                author_identifier: true,
                deleted: true,
            },
        });

        // User:
        const user = await prisma.user.findUnique({
            where: { identifier: user_identifier },
            select: { role: true },
        });

        const is_author = comment.author_identifier === user_identifier;
        const is_teacher = user?.role === "TEACHER";

        if (!is_author && !is_teacher) {
            return NextResponse.json(
                { error: "[!] Forbidden!" },
                { status: 403 }
            );
        }

        // Deletion:
        const deleted_comment = await prisma.comment.update({
            where: { identifier: comment_identifier },
            data: {
                deleted: true,
                deleted_at: new Date(),
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
