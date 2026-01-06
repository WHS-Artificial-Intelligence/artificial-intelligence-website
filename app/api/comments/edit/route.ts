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
     * NOTE: Whenever a student action invokes this route, the comment will require re-approval.
     *  * In constrast, whenever a teacher makes an edit, the comment will still be approved.
     */

    try {
        // Variables (Assignment):
        // Identifier:
        const user_identifier: string = await require_user();

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
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "[!] User is not found in database!" },
                { status: 404 }
            );
        }

        // Identifier:
        const { comment_identifier, content } = await request.json();

        if (!comment_identifier || !content) {
            return NextResponse.json(
                { error: "[!] Comment identifier or content missing from payload! " },
                { status: 400 }
            );
        }

        if (typeof content !== "string" || content.trim().length === 0) {
            return NextResponse.json(
                { error: "[!] Content cannot be empty!" },
                { status: 400 }
            );
        }

        // Comment:
        const comment = await prisma.comment.findUnique({
            /* Where: */
            where: {
                /* Identifier: */
                identifier: comment_identifier
            },

            /* Select: */
            select: {
                /* Identifier: */
                author_identifier: true
            }
        });

        if (!comment) {
            return NextResponse.json(
                { error: "[!] Comment is not found in database!" },
                { status: 404 }
            );
        }

        // Author:
        const is_author: boolean = comment?.author_identifier === user_identifier;

        // Teacher:
        const is_teacher: boolean = user.role === "TEACHER";

        // Validation:
        if (!is_author && !is_teacher) {
            return NextResponse.json(
                { error: "[!] Forbidden!" },
                { status: 403 }
            );
        }

        // Comment:
        const updated_comment = await prisma.comment.update({
            /* Where: */
            where: {
                /* Identifier: */
                identifier: comment_identifier
            },

            /* Data: */
            data: {
                /* Content: */
                content: content,

                /* Approved: */
                approved: is_teacher ? true : false,
            }
        });

        // Response:
        return NextResponse.json(updated_comment, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "[!] Internal server error!" },
            { status: 500 }
        );
    }
}