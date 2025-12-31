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

        // Content & Title:
        const { content, title } = await request.json();

        if (!content || !title) {
            return NextResponse.json(
                { error: "[!] Missing content or title!" },
                { status: 400 }
            );
        }

        // Post:
        const post = await prisma.post.create({
            data: {
                /* Title: */
                title: title,

                /* Content: */
                content: content,

                /* Identifier: */
                author_identifier: user_identifier,

                /* Approved: */
                approved: false
            }
        });

        // Response:
        return NextResponse.json(post, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: "[!] Unauthorized" },
            { status: 401 }
        );
    }
}