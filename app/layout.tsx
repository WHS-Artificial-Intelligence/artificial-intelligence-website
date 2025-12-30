// Written by: Sean Fang & Christopher Gholmieh
// Imports:

// Clerk:
import { ClerkProvider } from "@clerk/nextjs";

// React:
import { type ReactNode } from "react";

// Next:
import { type Metadata } from "next";

// CSS:
import "./index.css";


// Metadata:
export const metadata: Metadata = {
    /* Title: */
    "title": "WHS AI",

    /* Description: */
    "description": "The official website for Gretchen Whitney High School's AI Community",
}


// Layout:
const Layout = ({
    children
}: { children: Readonly<ReactNode> }) => {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="antialiased">
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}

// Exports:
export default Layout;