import { rawApiCall } from '../../lib/hive-rpc/api.js';

/**
 * Fetches recent posts for a given community from the Hive blockchain.
 * Filters posts to include only those created within the last 7 days.
 * @param {string} communityName - The name of the community (e.g., 'hive-13323').
 * @param {number} [limit=50] - The maximum number of posts to retrieve from the API per call.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of recent post objects.
 */
export async function getRecentCommunityPosts(communityName, limit = 50) {
    console.log(`Fetching recent posts for community: ${communityName}...`);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let allRecentPosts = [];
    let lastPermlink = null;
    let lastAuthor = null; // Added for pagination
    let hasMore = true;

    try {
        while (hasMore) {
            const params = {
                sort: 'created', // Get posts by creation date
                tag: communityName,
                // limit: limit + 1, // Removed for initial test
                observer: 'quigua' // Using a default observer as per working curl command
            };

            if (lastPermlink && lastAuthor) {
                params.start_permlink = lastPermlink;
                params.start_author = lastAuthor;
            }

            // Changed method from bridge.get_community_posts to bridge.get_ranked_posts
            const response = await rawApiCall('bridge.get_ranked_posts', params);

            if (response.error) {
                console.error(`Error fetching community posts for ${communityName}:`, response.error.message);
                break;
            }

            let posts = response.result || [];

            // Remove the extra post used for pagination check
            if (posts.length > limit) {
                lastPermlink = posts[limit].permlink;
                lastAuthor = posts[limit].author; // Update lastAuthor for pagination
                posts = posts.slice(0, limit);
            } else {
                hasMore = false;
            }

            // Filter posts older than 7 days
            const filteredPosts = posts.filter(post => {
                const postDate = new Date(post.created);
                return postDate >= sevenDaysAgo;
            });

            allRecentPosts = allRecentPosts.concat(filteredPosts);

            // If the last post fetched was older than 7 days, we can stop early
            if (posts.length === 0 || filteredPosts.length < posts.length) {
                hasMore = false;
            }

            // Add a small delay to avoid hitting rate limits
            if (hasMore) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(`Found ${allRecentPosts.length} recent posts for ${communityName}.`);
        return allRecentPosts;

    } catch (error) {
        console.error(`Unhandled error in getRecentCommunityPosts for ${communityName}:`, error);
        return [];
    }
}