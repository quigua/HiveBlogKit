import assert from 'assert';
import getAllUserFollowers from '../../../src/methods/user/getAllUserFollowers.js';

describe('getAllUserFollowers', function() {
  it('should return all followers for a given user', async function() {
    this.timeout(30000); // Increase timeout for potentially long API calls
    const username = 'hiveio'; // A user with many followers
    const allFollowers = await getAllUserFollowers(username);

    assert(Array.isArray(allFollowers), 'All followers should be an array');
    assert(allFollowers.length > 1000, 'Should return more than 1000 followers (assuming hiveio has many)');
    // Further assertions can be added here to check for duplicates or correct structure
  });

  it('should return an empty array for a user with no followers', async function() {
    this.timeout(10000); // Increase timeout for API call
    const username = 'thisuserhasnofollowers12345'; // A user that should have no followers
    const allFollowers = await getAllUserFollowers(username);

    assert(Array.isArray(allFollowers), 'All followers should be an array');
    assert.strictEqual(allFollowers.length, 0, 'Should return an empty array');
  });
});
