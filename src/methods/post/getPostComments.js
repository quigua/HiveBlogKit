import { condenser_api_get_content_replies } from '../../lib/hive-rpc/api.js';

/**
 * Recursively fetches nested comments for a given parent comment/post.
 * @param {string} author - The author of the parent comment/post.
 * @param {string} permlink - The permlink of the parent comment/post.
 * @returns {Promise<Array>} - A promise that resolves to an array of comments, including nested replies.
 */
async function fetchNestedComments(author, permlink) {
  const comments = await condenser_api_get_content_replies(author, permlink);
  if (!comments || !comments.result) {
    return [];
  }

  const processedComments = await Promise.all(comments.result.map(async (comment) => {
    if (comment.children > 0) {
      comment.replies = await fetchNestedComments(comment.author, comment.permlink);
    }
    return comment;
  }));

  return processedComments;
}

/**
 * Get comments for a given post.
 * @param {string} author - The author of the post.
 * @param {string} permlink - The permlink of the post.
 * @returns {Promise<Array|null>} - A promise that resolves to an array of comments, or null if an error occurs.
 */
async function getPostComments(author, permlink) {
  try {
    const comments = await fetchNestedComments(author, permlink);
    return comments;
  } catch (error) {
    console.error(`Error fetching comments for ${author}/${permlink}:`, error);
    return null;
  }
}

export default getPostComments;