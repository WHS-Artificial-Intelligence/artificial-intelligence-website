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

        // Validation:
        if (user?.role !== "TEACHER") {
            return NextResponse.json(
                { error: "[!] Forbidden!" },
                { status: 403 }
            );
        }

        // Identifier:
        const { comment_identifier, approved } = await request.json();

        if (!comment_identifier || typeof approved != "boolean") {
            return NextResponse.json(
                { error: "[!] Missing comment identifier or approval status!" },
                { status: 400 }
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
                /* Approved: */
                approved: approved
            },
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