import { rawApiCall } from '../../lib/hive-rpc/api.js';

/**
 * Fetches a page of recent posts for a given community from the Hive blockchain.
 * @param {string} communityName - The name of the community (e.g., 'hive-13323').
 * @param {number} [limit=10] - The maximum number of posts to retrieve.
 * @param {string} [start_author=null] - The author of the last post from the previous page (for pagination).
 * @param {string} [start_permlink=null] - The permlink of the last post from the previous page (for pagination).
 * @returns {Promise<Array<object>>} A promise that resolves to an array of recent post objects for the current page.
 */
export async function getRecentCommunityPosts(communityName, limit = 10, start_author = null, start_permlink = null) {
    console.log(`Fetching recent posts for community: ${communityName}, limit: ${limit}, start_author: ${start_author}, start_permlink: ${start_permlink}...`);

    try {
        const params = {
            sort: 'created', // Get posts by creation date
            tag: communityName,
            limit: limit,
            observer: 'quigua' // Using a default observer as per working curl command
        };

        if (start_author && start_permlink) {
            params.start_author = start_author;
            params.start_permlink = start_permlink;
        }

        const response = await rawApiCall('bridge.get_ranked_posts', params);

        if (response.error) {
            console.error(`Error fetching community posts for ${communityName}:`, response.error.message);
            return [];
        }

        return response.result || [];

    } catch (error) {
        console.error(`Unhandled error in getRecentCommunityPosts for ${communityName}:`, error);
        return [];
    }
}