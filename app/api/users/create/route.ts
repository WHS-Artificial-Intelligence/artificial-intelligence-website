// Written by: Christopher Gholmieh
// Imports:

// Prisma:
import { prisma } from "@/library/prisma-client";

// Clerk:
import type { WebhookEvent } from "@clerk/nextjs/server";

// Next:
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// SVIX:
import { Webhook } from "svix";


// POST:
export const POST = async (request: Request) => {
    // Variables (Assignment):
    // Secret:
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        return NextResponse.json(
            { error: "[!] Webhook secret not configured!" },
            { status: 500 }
        );
    }

    // Body:
    const body = await request.text();

    // Payload:
    const header_payload = await headers();

    // SVIX:
    const svix_timestamp = header_payload.get("svix-timestamp");
    const svix_signature = header_payload.get("svix-signature");
    const svix_id = header_payload.get("svix-id");

    if (!svix_timestamp || !svix_signature || !svix_id) {
        return NextResponse.json(
            { error: "[!] Payload is missing SVIX headers!" },
            { status: 400 }
        );
    }

    // Event:
    let event: WebhookEvent;

    try {
        // Variables (Assignment):
        // Webhook:
        const webhook = new Webhook(WEBHOOK_SECRET);

        // Event:
        event = webhook.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch {
        return NextResponse.json(
            { error: "[!] Invalid webhook signature!" },
            { status: 400 }
        );
    }

    // Logic:
    try {
        switch (event.type) {
            case "user.created": {
                // Variables (Assignment):
                // Information:
                const { id: clerk_identifier, first_name, last_name, primary_email_address_id, email_addresses } = event.data;

                // Email:
                const primary_email = email_addresses.find(
                    email => email.id === primary_email_address_id
                )?.email_address;

                if (!primary_email) {
                    return NextResponse.json(
                        { error: "[!] Primary email not found!" },
                        { status: 400 }
                    );
                }

                // Logic:
                await prisma.user.upsert({
                    /* Where: */
                    where: { clerk_identifier: clerk_identifier },

                    /* Update: */
                    update: {
                        /* Email: */
                        email: primary_email,

                        /* Name: */
                        first_name: first_name ?? "",
                        last_name: last_name ?? "",
                    },

                    /* Create: */
                    create: {
                        /* Identifier: */
                        clerk_identifier: clerk_identifier,

                        /* Email: */
                        email: primary_email,

                        /* Name: */
                        first_name: first_name ?? "",
                        last_name: last_name ?? "",
                    },
                });

                // Break:
                break;
            }

            case "user.deleted": {
                // Variables (Assignment):
                // Identifier:
                const { id: clerk_identifier } = event.data;

                await prisma.user.delete({
                    /* Where: */
                    where: { clerk_identifier: clerk_identifier },
                });

                /* Break: */
                break;
            }

            /* Default: */
            default:
                break;
        }
    } catch {
        return NextResponse.json(
            { error: "[!] Internal server error!" },
            { status: 500 }
        );
    }

    return new NextResponse(null, { status: 200 });
};