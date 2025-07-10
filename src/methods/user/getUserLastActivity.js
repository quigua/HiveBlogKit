import { rawApiCall } from '../../lib/hive-rpc/api.js';

/**
 * Retrieves the last post and vote times for a given Hive account.
 * @param {string} username - The username of the account to retrieve activity for.
 * @returns {Promise<object|null>} A promise that resolves to an object containing last_post and last_vote_time, or null if the account is not found.
 */
async function getUserLastActivity(username) {
  try {
    const response = await rawApiCall('condenser_api.get_accounts', [[username]]);
    if (response.result && response.result.length > 0) {
      const account = response.result[0];
      return {
        last_post: account.last_post,
        last_vote_time: account.last_vote_time,
      };
    } else {
      return null; // Account not found
    }
  } catch (error) {
    console.error(`Error fetching last activity for ${username}:`, error);
    throw error;
  }
}

export default getUserLastActivity;
