import assert from 'assert';
import { getUserFollowers } from '../../../index.js';

describe('getUserFollowers', function() {
  it('should return a list of followers for a given user', async function() {
    this.timeout(10000); // Increase timeout for API call
    const username = 'hiveio'; // A user with a known number of followers
    const followers = await getUserFollowers(username, '', 10);

    assert(Array.isArray(followers), 'Followers should be an array');
    assert(followers.length > 0, 'Should return at least one follower');
    assert.strictEqual(followers.length, 10, 'Should return 10 followers');
    assert.strictEqual(followers[0].following, username, 'The following field should match the queried username');
  });

  it('should handle pagination correctly', async function() {
    this.timeout(10000); // Increase timeout for API call
    const username = 'hiveio';
    const firstBatch = await getUserFollowers(username, '', 5);
    const secondBatch = await getUserFollowers(username, firstBatch[firstBatch.length - 1].follower, 5);

    assert(Array.isArray(firstBatch), 'First batch should be an array');
    assert(firstBatch.length === 5, 'First batch should contain 5 followers');
    assert(Array.isArray(secondBatch), 'Second batch should be an array');
    assert(secondBatch.length === 5, 'Second batch should contain 5 followers');
    assert.notDeepStrictEqual(firstBatch, secondBatch, 'Batches should be different');
  });

  it('should throw an error for an invalid username or API call failure', async function() {
    this.timeout(10000); // Increase timeout for API call
    const username = 'nonexistentuser1234567890'; // A username that should not exist
    try {
      await getUserFollowers(username, '', 10);
      assert.fail('Should have thrown an error for a nonexistent user');
    } catch (error) {
      assert.ok(error, 'An error should be thrown');
    }
  });
});
