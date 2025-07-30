import { condenser_api_get_blog } from '../../lib/hive-rpc/api.js';

/**
 * Retrieves the latest posts from a specified number of recently followed users.
 *
 * @param {string} clientUsername - The username of the client for whom to fetch favorite posts.
 * @param {number} [numberOfUsers=4] - The number of most recent followed users to get posts from.
 * @param {number} [postsPerUserLimit=1] - The number of latest posts to retrieve per user.
 * @returns {Promise<Array<object>>} A list of the latest posts from followed users, formatted for HomePagePostCard.
 */
export async function getLatestFavoritePosts(clientUsername, numberOfUsers = 4, postsPerUserLimit = 1) {
    console.time('getLatestFavoritePosts execution');
    const DATA_REPO_BASE_URL = 'https://raw.githubusercontent.com/quigua/hived-static-content/main/data';
    const favoritesDataUrl = `${DATA_REPO_BASE_URL}/${clientUsername}/favorites.json`;

    let favoritePosts = [];

    try {
        console.time('Fetch favorites.json');
        const response = await fetch(favoritesDataUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch favorites: ${response.statusText}`);
        }
        const data = await response.json();
        console.timeEnd('Fetch favorites.json');
        // Ensure data.pages[0].favorites exists and is an array
        const allFavorites = Array.isArray(data.pages[0]?.favorites) ? data.pages[0].favorites : [];
        
        const followedUsers = allFavorites.slice(0, numberOfUsers); // Get the N most recent followed users

        console.time('Fetch and process user posts concurrently');
        const fetchPromises = followedUsers.map(async (user) => {
            let foundPost = null;
            let startIndex = 0;
            const fetchLimit = 20; // Number of entries to fetch per API call
            const maxEntriesToSearch = 100; // Maximum total entries to search for a post
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setHours(0, 0, 0, 0); // Set to the beginning of the day
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            while (!foundPost && startIndex < maxEntriesToSearch) {
                const blogEntries = await condenser_api_get_blog(user.username, startIndex, fetchLimit);

                if (!blogEntries.result || blogEntries.result.length === 0) {
                    break; // No more entries to fetch
                }

                for (const entry of blogEntries.result) {
                    const isCommentPresent = !!entry.comment;
                    const isAuthorMatch = entry.comment && entry.comment.author === user.username;
                    const isOriginalPost = entry.reblogged_on === '1970-01-01T00:00:00' || entry.reblogged_on === null;
                    const isTopLevelPost = entry.comment && entry.comment.depth === 0 && entry.comment.parent_author === '';
                    const postDate = entry.comment ? new Date(entry.comment.created) : null;
                    const isRecent = postDate && postDate >= sevenDaysAgo;

                    if (isCommentPresent && isAuthorMatch && isOriginalPost && isTopLevelPost && isRecent) {
                        foundPost = entry.comment;
                        break; // Found a suitable post, stop searching for this user
                    }
                }
                startIndex += fetchLimit;
            }
            return foundPost; // Return the found post or null
        });

        const results = await Promise.all(fetchPromises);
        console.timeEnd('Fetch and process user posts concurrently');

        console.time('Populate favoritePosts array');
        for (const foundPost of results) {
            if (foundPost) {
                favoritePosts.push({
                    author: foundPost.author,
                    authorAvatarUrl: `https://images.hive.blog/u/${foundPost.author}/avatar`,
                    title: foundPost.title,
                    votes: foundPost.stats?.total_votes || 0, // Assuming stats.total_votes exists
                    comments: foundPost.children || 0,
                    hbdPayout: `${parseFloat(foundPost.pending_payout_value || foundPost.total_payout_value || "0").toFixed(2)} HBD`,
                    publishedDate: new Date(foundPost.created).toLocaleDateString(),
                    permlink: foundPost.permlink,
                    imageUrl: (() => {
                        let imgUrl = 'https://via.placeholder.com/600x400?text=No+Image';
                        try {
                            const metadata = foundPost.json_metadata ? JSON.parse(foundPost.json_metadata) : null;
                            if (metadata && metadata.image && metadata.image.length > 0) {
                                imgUrl = metadata.image[0];
                            } else if (foundPost.body) {
                                const markdownImageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/;
                                const match = foundPost.body.match(markdownImageRegex);
                                if (match && match[1]) {
                                    imgUrl = match[1];
                                }
                            }
                        } catch (e) {
                            console.error("Error parsing json_metadata or extracting image from body:", e);
                        }
                        return imgUrl;
                    })()
                });
            }
        }
        console.timeEnd('Populate favoritePosts array');
    } catch (error) {
        console.error("Error in getLatestFavoritePosts:", error);
    }

    console.timeEnd('getLatestFavoritePosts execution');
    return favoritePosts;
}
