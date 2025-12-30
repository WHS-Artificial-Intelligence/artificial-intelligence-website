// Written by: Sean Fang & Christopher Gholmieh
// Imports:

// Configuration:
import { defineConfig as define_configuration } from "prisma/config";

// Configuration:
import "dotenv/config";


// Exports:
export default define_configuration({
    /* Schema: */
    schema: "prisma/schema.prisma",

    /* Migrations: */
    migrations: {
        /* Path: */
        path: "prisma/migrations",
    },

    /* Source: */
    datasource: {
        /* URL: */
        url: process.env["DATABASE_URL"],
    },
});