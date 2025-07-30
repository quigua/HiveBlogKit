import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

/**
 * Processes the HTML body of a Hive post to fix image URLs and convert Markdown to HTML.
 * Specifically, it removes the '0x0/' prefix from image URLs
 * which is often used by Hive frontends for image resizing.
 * @param {string} content - The raw content (can be Markdown or HTML) of the post body.
 * @returns {string} The processed HTML content with corrected image URLs.
 */
export function processPostHtml(content) {
    if (!content) {
        return '';
    }

    // First, render Markdown to HTML
    let processedHtml = md.render(content);

    // Regex to find image URLs with 0x0/ prefix in src attributes
    // It looks for src="..." or src='..." and captures the URL
    // The [^\/]+ part makes it generic for any domain before /0x0/
    const regex0x0 = /(src=["'])(https?:\/\/[^\/]+\/0x0\/)(https?:\/\/[^"']+)(["'])/g;
    processedHtml = processedHtml.replace(regex0x0, '$1$3$4');

    // Optional: Regex to ensure relative image URLs are made absolute if needed
    // This assumes a base domain for relative paths, adjust as necessary
    // const regexRelative = /(src=["'])(?!https?:\/\/)([^"']+)(["'])/g;
    // processedHtml = processedHtml.replace(regexRelative, '$1https://images.hive.blog/$2$3');

    return processedHtml;
}
