// Written by: Christopher Gholmieh
// Imports:

// Authentication:
import { auth as authentication } from "@clerk/nextjs/server";


// Exports:
export const require_user = async () => {
    // Variables (Assignment):
    // Session:
    const session = await authentication();

    if (!session.userId) {
        throw new Error("[!] Unauthorized!");
    }

    // Session:
    return session.userId;
}