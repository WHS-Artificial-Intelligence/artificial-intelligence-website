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
     * This specific function creates a post in our database with the given data.
     *  * The given data is the content and title of the post.
     *  It will return the created post, however this might not be useful just yet.
     */
    
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