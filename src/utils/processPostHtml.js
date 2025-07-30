// src/utils/processPostHtml.js

/**
 * Processes the HTML body of a Hive post to fix image URLs.
 * Specifically, it removes the '0x0/' prefix from image URLs
 * which is often used by Hive frontends for image resizing.
 * @param {string} htmlContent - The raw HTML content of the post body.
 * @returns {string} The processed HTML content with corrected image URLs.
 */
export function processPostHtml(htmlContent) {
    if (!htmlContent) {
        return '';
    }
    // Regex to find image URLs with 0x0/ prefix
    // It looks for src="..." or src='..." and captures the URL
    const regex = /(src=["'])(https?:\/\/images\.hive\.blog\/0x0\/)(https?:\/\/[^"']+)(["'])/g;
    return htmlContent.replace(regex, '$1$3$4');
}
