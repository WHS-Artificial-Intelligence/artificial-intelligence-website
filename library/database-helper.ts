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

export type user_t = {
    /* Identifier: */
    clerk_identifier: string,

    /* Email: */
    email: string,

    /* Name: */
    first_name: string | undefined,
    last_name:  string | undefined,
}


// Functions:
export const remove_comment = async (comment_identifier: string) => {
    return await prisma.comment.update({
        /* Where: */
        where: { 
            /* Identifier: */
            identifier: comment_identifier 
        },

        data: {
            /* Deleted: */
            deleted: true,

            /* Timestamp: */
            deletion_timestamp: new Date(),
        },
    })
}

export const query_comments = async (post_identifier: string) => {
    return await prisma.comment.findMany({
        /* Where: */
        where: {
            /* Identifier: */
            post_identifier: post_identifier,

            /* Approved: */
            approved: true,

            /* Deleted: */
            deleted: false,
        },

        /* Select: */
        select: {
            /* Content: */
            content: true,

            /* Author: */
            author: {
                /* Select: */
                select: {
                    /* Email: */
                    email: true,

                    /* Name: */
                    first_name: true,
                    last_name: true
                },
            },
        },

        /* Take: */
        take: 15
    });
}

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

export const remove_post = async (post_identifier: string) => {
    return await prisma.post.update({
        /* Where: */
        where: {
            /* Identifier: */
            identifier: post_identifier
        },

        /* Data: */
        data: {
            /* Deleted: */
            deleted: true,

            /* Timestamp: */
            deletion_timestamp: new Date()
        },
    });
}

export const query_posts = async () => {
    return await prisma.post.findMany({
        /* Select: */
        select: {
        /* Author: */
            author: true,

            /* Content: */
            content: true,

            /* Comments: */
            comments: true,
        },

        /* Order: */
        orderBy: {
            /* Timestamp: */
            creation_timestamp: "desc",
        },

        /* Where: */
        where: {
            /* Approved: */
            approved: true,
        },

        /* Take: */
        take: 15,
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

export const create_user = async (user_data: user_t) => {
    return await prisma.user.upsert({
        /* Where: */
        where: { clerk_identifier: user_data.clerk_identifier },

        /* Update: */
        update: {
            /* Email: */
            email: user_data.email,

            /* Name: */
            first_name: user_data.first_name ?? "",
            last_name: user_data.last_name ?? "",
        },

        /* Create: */
        create: {
            /* Identifier: */
            clerk_identifier: user_data.clerk_identifier,

            /* Email: */
            email: user_data.email,

            /* Name: */
            first_name: user_data.first_name ?? "",
            last_name: user_data.last_name ?? "",
        },
    });
}