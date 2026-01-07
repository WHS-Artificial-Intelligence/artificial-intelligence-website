// Written by: Christopher Gholmieh
// Imports:

// Authentication:
import { require_user } from "@/library/authentication-helper";

// Database:
import { query_posts } from "@/library/database-helper";

// Next:
import { NextResponse } from "next/server";


// GET:
export const GET = async (request: Request) => {
    /**
     * This function is designed to run when our website sends a GET request.
     *  * GET is a type of request indicating that this function will return data
     *  and not perform an internal action.
     * 
     * This specific function retrieves the 15 most recent posts,
     * returning it in a JSON format.
     * 
     * NOTE: The reason why this specific route is not teacher-only is because we only
     * desire for authorized (logged-in) users to have access to posts.
     */

    try {
        // Authentication:
        await require_user();

        // Posts:
        const posts = await query_posts();

        // Response:
        return NextResponse.json(posts, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "[!] Unauthorized or internal server error!" },
            { status: 401 }
        );
    }
}