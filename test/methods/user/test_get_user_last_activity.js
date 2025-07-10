import assert from 'assert';
import getUserLastActivity from '../../../src/methods/user/getUserLastActivity.js';

describe('getUserLastActivity', function() {
  it('should return the last post and vote times for a valid user', async function() {
    this.timeout(10000); // Increase timeout for API call
    const username = 'quigua'; // A user with known activity
    const activity = await getUserLastActivity(username);

    assert.ok(activity, 'Activity object should not be null');
    assert.ok(activity.last_post, 'last_post should be defined');
    assert.ok(activity.last_vote_time, 'last_vote_time should be defined');
    assert.strictEqual(typeof activity.last_post, 'string', 'last_post should be a string');
    assert.strictEqual(typeof activity.last_vote_time, 'string', 'last_vote_time should be a string');
  });

  it('should return null for a nonexistent user', async function() {
    this.timeout(10000); // Increase timeout for API call
    const username = 'nonexistentuser1234567890'; // A username that should not exist
    const activity = await getUserLastActivity(username);

    assert.strictEqual(activity, null, 'Activity should be null for a nonexistent user');
  });
});
