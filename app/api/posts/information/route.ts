// Written by: Christopher Gholmieh
// Imports:

// Prisma:
import { prisma } from "@/library/prisma-client";

// Next:
import { NextResponse } from "next/server";


// GET:
export const POST = async (request: Request) => {
    try {
        // Variables (Assignment):
        // Identifier:
        const { post_identifier } = await request.json();

        if (!post_identifier) {
            return NextResponse.json(
                { error: "[!] Invalid payload!" },
                { status: 400 }
            );
        }

        // Post:
        const post = await prisma.query_post(post_identifier);

        // Validation:
        if (!post) {
            return NextResponse.json(
                { error: "[!] Post is not found in database!" },
                { status: 404 }
            );
        }

        // Response:
        return NextResponse.json(post, {
            status: 200
        });
    } catch {
        return NextResponse.json(
            { error: "[!] Invalid payload!" },
            { status: 400 }
        );
    }
}