import { condenser_api_get_content } from '../../lib/hive-rpc/api.js';
// import MarkdownIt from 'markdown-it';

// const md = new MarkdownIt({
//     html: true, // Enable HTML tags in source
//     linkify: true, // Autoconvert URL-like texts to links
//     typographer: true, // Enable some typographic replacements
// });

/**
 * Fetches a single post by author and permlink and returns a processed post object.
 * @param {string} author - The author of the post.
 * @param {string} permlink - The permlink of the post.
 * @returns {Promise<object|null>} A processed post object or null if not found/error.
 */
export async function getPost(author, permlink) {
    if (!author || !permlink) {
        console.error("Author and permlink are required for getPost.");
        return null;
    }

    try {
        const rawResponse = await condenser_api_get_content(author, permlink);

        if (rawResponse && rawResponse.result) {
            const post = rawResponse.result;
            // You can add more processing here if needed, e.g., parsing JSON metadata, cleaning body, etc.
            return {
                author: post.author,
                permlink: post.permlink,
                title: post.title,
                // body: md.render(post.body),
                body: post.body,
                created: post.created,
                json_metadata: post.json_metadata ? JSON.parse(post.json_metadata) : {},
                url: post.url,
                // Add other properties you need
            };
        } else if (rawResponse && rawResponse.error) {
            console.error(`API Error fetching post ${author}/${permlink}:`, rawResponse.error.message);
            return null;
        } else {
            console.warn(`No result found for post ${author}/${permlink}. Raw response:`, rawResponse);
            return null;
        }
    } catch (error) {
        console.error(`Error in getPost for ${author}/${permlink}:`, error);
        return null;
    }
}