import { rawApiCall } from '../../lib/hive-rpc/api.js';

/**
 * Retrieves a list of followers for a given Hive account.
 * @param {string} username - The username of the account to retrieve followers for.
 * @param {string} startFollower - The account name to start retrieving followers from (for pagination).
 * @param {number} limit - The maximum number of followers to retrieve (max 1000).
 * @returns {Promise<Array>} A promise that resolves to an array of follower objects.
 */
async function getUserFollowers(username, startFollower = '', limit = 1000) {
  try {
    const response = await rawApiCall('condenser_api.get_followers', [
      username,
      startFollower,
      'blog',
      limit,
    ]);
    return response.result || [];
  } catch (error) {
    console.error(`Error fetching followers for ${username}:`, error);
    throw error;
  }
}

export default getUserFollowers;
