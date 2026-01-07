// Written by: Christopher Gholmieh
// Imports:

// Database:
import { query_comments } from "@/library/database-helper";

// Prisma:
import { prisma } from "@/library/prisma-client"

// Next:
import { NextResponse } from "next/server"


// GET:
export const GET = async (request: Request) => {
    try {
        // Variables (Assignment):
        // Identifier:
        const { post_identifier } = await request.json();

        if (!post_identifier) {
            return NextResponse.json(
                { error: "[!] Request is missing post identifier!" },
                { status: 400 }
            );
        }

        // Post:
        const post = await prisma.post.findUnique({
            /* Where: */
            where: {
                /* Identifier: */
                identifier: post_identifier
            },

            /* Select: */
            select: {
                /* Approved: */
                approved: true,

                /* Deleted: */
                deleted: true
            }
        });

        // Validation:
        if (!post) {
            return NextResponse.json(
                { error: "[!] Post is not found in database!" },
                { status: 404 }
            );
        }

        if (!post.approved || post.deleted) {
            return NextResponse.json(
                { error: "[!] Post is not available!" },
                { status: 404 }
            )
        };

        // Comments:
        const comments = await query_comments(post_identifier);

        // Response:
        return NextResponse.json(comments, {
            status: 200
        });
    } catch {
        return NextResponse.json(
            { error: "[!] Internal server error!" },
            { status: 500 }
        );
    }
}