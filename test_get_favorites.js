import { getLatestFavoritePosts } from './index.js';

async function runTest() {
    const clientUsername = 'quigua'; // Replace with a username you follow
    const numberOfUsers = 4;
    const postsPerUserLimit = 1;

    console.log(`Fetching ${postsPerUserLimit} latest post(s) from ${numberOfUsers} most recent followed users of @${clientUsername}...`);
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
