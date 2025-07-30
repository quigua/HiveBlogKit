import { condenser_api_get_blog } from '../../lib/hive-rpc/api.js';

import { getUsersOriginalPosts } from '../posts/getUsersOriginalPosts.js';

/**
 * Retrieves the latest posts from a specified number of recently followed users.
 *
 * @param {string} clientUsername - The username of the client for whom to fetch favorite posts.
 * @param {number} [numberOfUsers=4] - The number of most recent followed users to get posts from.
 * @param {number} [postsPerUserLimit=1] - The number of latest posts to retrieve per user.
 * @returns {Promise<Array<object>>} A list of the latest posts from followed users, formatted for HomePagePostCard.
 */
export async function getLatestFavoritePosts(clientUsername, numberOfUsers = 4, postsPerUserLimit = 1) {
    const DATA_REPO_BASE_URL = 'https://raw.githubusercontent.com/quigua/hived-static-content/main/data';
    const favoritesDataUrl = `${DATA_REPO_BASE_URL}/${clientUsername}/favorites.json`;

    let favoritePosts = [];

    try {
        const response = await fetch(favoritesDataUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch favorites: ${response.statusText}`);
        }
        const data = await response.json();
        // Ensure data.pages[0].favorites exists and is an array
        const allFavorites = Array.isArray(data.pages[0]?.favorites) ? data.pages[0].favorites : [];
        
        const followedUsers = allFavorites.slice(0, numberOfUsers); // Get the N most recent followed users

        for (const user of followedUsers) {
            // Get the latest posts for each followed user
            // Use condenser_api_get_blog to get a limited number of posts
            const blogEntries = await condenser_api_get_blog(user.username, 0, postsPerUserLimit);
            const posts = blogEntries.result.filter(entry => entry.comment && entry.comment.author === user.username && (entry.reblogged_on === '1970-01-01T00:00:00' || entry.reblogged_on === null)).map(entry => entry.comment);
            
            if (posts && posts.length > 0) {
                // Iterate through the posts obtained for each user up to postsPerUserLimit
                for (let i = 0; i < Math.min(posts.length, postsPerUserLimit); i++) {
                    const post = posts[i];
                    favoritePosts.push({
                        author: post.author,
                        authorAvatarUrl: `https://images.hive.blog/u/${post.author}/avatar`,
                        title: post.title,
                        votes: post.stats?.total_votes || 0, // Assuming stats.total_votes exists
                        comments: post.children || 0,
                        hbdPayout: `${parseFloat(post.pending_payout_value || post.total_payout_value || "0").toFixed(2)} HBD`,
                        publishedDate: new Date(post.created).toLocaleDateString(),
                        imageUrl: post.json_metadata && JSON.parse(post.json_metadata).image && JSON.parse(post.json_metadata).image.length > 0
                            ? JSON.parse(post.json_metadata).image[0]
                            : 'https://via.placeholder.com/600x400?text=No+Image',
                    });
                }
            }
        }
    } catch (error) {
        console.error("Error in getLatestFavoritePosts:", error);
    }

    return favoritePosts;
}
