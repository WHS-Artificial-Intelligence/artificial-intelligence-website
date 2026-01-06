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

        if (!user) {
            return NextResponse.json(
                { error: "[!] User is not found in database!" },
                { status: 404 }
            );
        }

        // Identifier:
        const { post_identifier, content } = await request.json();

        if (!post_identifier || !content) {
            return NextResponse.json(
                { error: "[!] Post identifier or content missing from payload! " },
                { status: 400 }
            );
        }

        if (typeof content !== "string" || content.trim().length === 0) {
            return NextResponse.json(
                { error: "[!] Content cannot be empty!" },
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
                /* Identifier: */
                author_identifier: true
            }
        });

        if (!post) {
            return NextResponse.json(
                { error: "[!] Post is not found in database! " },
                { status: 404 }
            );
        }

        // Author:
        const is_author: boolean = post?.author_identifier === user_identifier;

        // Teacher:
        const is_teacher: boolean = user.role === "TEACHER";

        // Validation:
        if (!is_author && !is_teacher) {
            return NextResponse.json(
                { error: "[!] Forbidden!" },
                { status: 403 }
            );
        }

        // Post:
        const updated_post = await prisma.post.update({
            /* Where: */
            where: {
                /* Identifier: */
                identifier: post_identifier
            },

            /* Data: */
            data: {
                /* Content: */
                content: content
            }
        });

        // Response:
        return NextResponse.json(updated_post, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "[!] Internal server error!" },
            { status: 500 }
        );
    }
}