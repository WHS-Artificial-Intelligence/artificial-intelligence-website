// Written by: Christopher Gholmieh
// Imports:

// Markdown:
import ReactMarkdown from "react-markdown";

// GFM:
import remarkGfm from "remark-gfm";


const Page = async ({ parameters }: {
    parameters: { post_identifier: string }
}) => {
    // Variables (Assignment):
    // Response:
    const response = await fetch("http://localhost:3000/api/posts/information", {
        /* Method: */
        method: "POST",

        /* Headers: */
        headers: { "Content-Type": "application/json" },

        /* Body: */
        body: JSON.stringify({ post_identifier: parameters.post_identifier }),
    });

    // Information:
    const information = await response.json();

    
    // Post:
    return (
        <article className="prose prose-neutral max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {information.content}
            </ReactMarkdown>
        </article>
    );
};

// Exports:
export default Page;