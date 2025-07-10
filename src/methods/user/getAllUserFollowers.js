import getUserFollowers from './getUserFollowers.js';

/**
 * Retrieves all followers for a given Hive account, handling pagination.
 * @param {string} username - The username of the account to retrieve followers for.
 * @returns {Promise<Array>} A promise that resolves to an array of all follower objects.
 */
async function getAllUserFollowers(username) {
  let allFollowers = [];
  let lastFollower = '';
  let hasMore = true;

  while (hasMore) {
    const batch = await getUserFollowers(username, lastFollower, 1000); // Fetch in batches of 1000
    if (batch.length === 0) {
      hasMore = false; // No more followers to fetch
    } else {
      allFollowers = allFollowers.concat(batch);
      if (batch.length < 1000) {
        hasMore = false; // Last batch
      } else {
        lastFollower = batch[batch.length - 1].follower; // Prepare for next batch
      }
    }
  }

  return allFollowers;
}

export default getAllUserFollowers;
