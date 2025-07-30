import { getLatestFavoritePosts } from './index.js';
import { condenser_api_get_blog } from './src/lib/hive-rpc/api.js'; // Import for direct testing

async function runTest() {
    const clientUsername = 'quigua'; // Replace with a username you follow
    const numberOfUsers = 4;
    const postsPerUserLimit = 1;

    console.log(`Fetching ${postsPerUserLimit} latest post(s) from ${numberOfUsers} most recent followed users of @${clientUsername}...`);
    
    // --- Debugging: Test condenser_api_get_blog directly for a known user ---
    console.log('\n--- Direct Test of condenser_api_get_blog ---');
    const testUser = 'artgrafiken'; // User from favorites.json with recent post
    try {
        const directBlogEntries = await condenser_api_get_blog(testUser, 0, 1);
        console.log(`Raw blog entries for ${testUser}:`, JSON.stringify(directBlogEntries, null, 2));
        if (directBlogEntries && directBlogEntries.result && directBlogEntries.result.length > 0) {
            const filteredDirectPosts = directBlogEntries.result.filter(entry => entry.author === testUser && !entry.reblogged_on).map(entry => entry.comment);
            console.log(`Filtered direct posts for ${testUser}:`, JSON.stringify(filteredDirectPosts, null, 2));
        } else {
            console.log(`No blog entries found for ${testUser} in direct test.`);
        }
    } catch (error) {
        console.error(`Error in direct condenser_api_get_blog test for ${testUser}:`, error);
    }
    console.log('--- End Direct Test ---\n');

    const posts = await getLatestFavoritePosts(clientUsername, numberOfUsers, postsPerUserLimit);

    if (posts && posts.length > 0) {
        console.log(`Found ${posts.length} posts:`);
        posts.forEach((post, index) => {
            console.log(`--- Post ${index + 1} ---`);
            console.log(`  Author: @${post.author}`);
            console.log(`  Title: ${post.title}`);
            console.log(`  Published: ${post.publishedDate}`);
            console.log(`  Image: ${post.imageUrl}`);
            console.log(`  Votes: ${post.votes}`);
            console.log(`  Comments: ${post.comments}`);
            console.log(`  HBD Payout: ${post.hbdPayout}`);
            console.log('---');
        });
    } else {
        console.log('No posts found from followed users or an error occurred.');
    }
}

runTest();