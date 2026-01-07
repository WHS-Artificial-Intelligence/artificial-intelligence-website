// Written by: Sean Fang
// Imports:

// Authentication:
import { require_user } from "@/library/authentication-helper";

// Database:
import { create_comment } from "@/library/database-helper";

// Next:
import { NextResponse } from "next/server";


// POST:
export const POST = async (request: Request) => {
    /**
     * This function is designed to run when our website sends a POST request.
     *  * POST is a type of request indicating that this function will receive data
     *  and perform an action.
     *
     * This specific function creates a comment in our database with the given data.
     *  * The given data is the content of the comment and the post identifier.
     *  It will return the created comment.
     */

    try {
        // Variables (Assignment):
        // Identifier:
        const user_identifier: string = await require_user();

        // Content & Identifier:
        const { content, post_identifier } = await request.json();

        if (!content || !post_identifier) {
            return NextResponse.json(
                { error: "[!] Missing content or post identifier!" },
                { status: 400 }
            );
        }

        // Comment:
        const comment = await create_comment({
                /* Content: */
            content: content,

            /* Identifier: */
            author_identifier: user_identifier,

            /* Post Identifier: */
            post_identifier: post_identifier,

            /* Approved: */
            approved: false           
        });

        // Response:
        return NextResponse.json(comment, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: "[!] Unauthorized" },
            { status: 401 }
        );
    }
};