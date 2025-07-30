// index.js - Main entry point for HiveBlogKit

// Export high-level methods
export { getUserCommunitySubscriptions } from './src/methods/user/getUserCommunitySubscriptions.js';
export { getAccountProfile } from './src/methods/user/getAccountProfile.js';
export { getAccountReputation } from './src/methods/reputation/getAccountReputation.js';
export { getUsersOriginalPosts } from './src/methods/posts/getUsersOriginalPosts.js';
export { getUsersRebloggedPosts } from './src/methods/posts/getUsersRebloggedPosts.js';
export { getCommunityDetails } from './src/methods/community/getCommunityDetails.js';
export { getAllCommunities } from './src/methods/community/getAllCommunities.js';
export { getRecentCommunityPosts } from './src/methods/community/getRecentCommunityPosts.js';
export { getPost } from './src/methods/post/getPost.js';
import getUserFollowers from './src/methods/user/getUserFollowers.js';
import getAllUserFollowers from './src/methods/user/getAllUserFollowers.js';
import getUserLastActivity from './src/methods/user/getUserLastActivity.js';
export { getUserFollowers };
export { getAllUserFollowers };
export { getUserLastActivity };
export * from './src/methods/user/getUserProfile.js';
import getPostComments from './src/methods/post/getPostComments.js';
export { getPostComments };
import getUserComments from './src/methods/user/getUserComments.js';
export { getUserComments };
export { getLatestFavoritePosts } from './src/methods/user/getLatestFavoritePosts.js';
export { processPostHtml } from './src/utils/processPostHtml.js';

// Export raw API call methods (from src/lib/hive-rpc/api.js)
export {
    condenser_api_get_accounts,
    condenser_api_get_blog,
    condenser_api_get_content,
    condenser_api_get_discussions_by_trending,
    condenser_api_get_discussions_by_hot,
    condenser_api_get_discussions_by_created,
    condenser_api_get_state,
    condenser_api_get_followers,
    condenser_api_get_following,
    condenser_api_get_blog_authors,
    bridge_get_community
} from './src/lib/hive-rpc/api.js';

// Puedes añadir más exportaciones aquí a medida que desarrolles más métodos