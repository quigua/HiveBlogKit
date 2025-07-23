import { condenser_api_get_replies_by_last_update } from '../../lib/hive-rpc/api.js';

/**
 * Get comments received by a given user.
 * @param {string} username - The username to get comments for.
 * @param {number} limit - The number of comments to return.
 * @returns {Promise<Array|null>} - A promise that resolves to an array of comments, or null if an error occurs.
 */
async function getUserComments(username, limit = 5) {
  try {
    const comments = await condenser_api_get_replies_by_last_update(username, "", limit);
    return comments.result;
  } catch (error) {
    console.error(`Error fetching comments for ${username}:`, error);
    return null;
  }
}

export default getUserComments;