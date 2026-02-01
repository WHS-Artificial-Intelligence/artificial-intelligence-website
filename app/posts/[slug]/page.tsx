// Written by: Christopher Gholmieh
// Imports:

// Markdown:
import ReactMarkdown from "react-markdown";

// Prisma:
import { query_post } from "@/library/database-helper";

// GFM:
import remarkGfm from "remark-gfm";


const Page = async ({ params }: {
    params: { slug: string }
}) => {
    // Variables (Assignment):
    // Post:
    const post = await query_post(params.slug)

    // Post:
    return (
        <article className="prose prose-neutral max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
            </ReactMarkdown>
        </article>
    );
};

// Exports:
export default Page;