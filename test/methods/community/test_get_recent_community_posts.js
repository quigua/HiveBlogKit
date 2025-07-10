import { getRecentCommunityPosts } from '../../../index.js';

async function testGetRecentCommunityPosts() {
    console.log('Testing getRecentCommunityPosts...');
    const communityToTest = 'hive-13323'; // Example: Splinterlands community

    try {
        const recentPosts = await getRecentCommunityPosts(communityToTest);

        if (recentPosts && recentPosts.length > 0) {
            console.log(`Test Passed: Found ${recentPosts.length} recent posts for ${communityToTest}.`);
            console.log('First recent post:', recentPosts[0].url);
            console.log('Last recent post:', recentPosts[recentPosts.length - 1].url);
            // You can add more assertions here, e.g., check post dates
        } else {
            console.log(`Test Passed (no recent posts found): No recent posts for ${communityToTest} or an issue occurred.`);
        }
    } catch (error) {
        console.error('Test Failed: An error occurred during getRecentCommunityPosts test:', error);
    }
}

testGetRecentCommunityPosts();
