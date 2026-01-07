// Written by: Christopher Gholmieh
// Imports:

// Prisma:
import { prisma } from "./prisma-client";


// Types:
export type comment_t = {
    /* Identifier: */
    author_identifier: string,

    /* Identifier: */
    post_identifier: string,

    /* Content: */
    content: string,

    /* Approved: */
    approved: boolean
}

export type post_t = {
    /* Title: */
    title: string,

    /* Content: */
    content: string,

    /* Identifier: */
    author_identifier: string,

    /* Approved: */
    approved: boolean
}


// Functions:
export const create_comment = async (comment_data: comment_t) => {
    return await prisma.comment.create({
        data: {
            /* Identifier: */
            author_identifier: comment_data.author_identifier,

            /* Identifier: */
            post_identifier: comment_data.post_identifier,

            /* Content: */
            content: comment_data.content,

            /* Approved: */
            approved: comment_data.approved
        }
    });
}

export const create_post = async (post_data: post_t) => {
    return await prisma.post.create({
        data: {
            /* Title: */
            title: post_data.title,

            /* Content: */
            content: post_data.content,

            /* Identifier: */
            author_identifier: post_data.author_identifier,

            /* Approved: */
            approved: false
        }
    });
}