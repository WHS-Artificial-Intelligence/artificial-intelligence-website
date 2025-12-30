// Written by: Sean Fang & Christopher Gholmieh
// Imports:

// Clerk:
import { clerkMiddleware as clerk_middleware } from "@clerk/nextjs/server";


// Configuration:
export const config = {
    /* Matcher: */
    matcher: [
        /* Static: */
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

        /* API: */
        "/(api|trpc)(.*)",
    ],
};

// Exports:
export default clerk_middleware();