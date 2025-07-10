import { getPostComments } from '../../../index.js';

async function testGetPostComments() {
  const author = 'leofinance';
  const permlink = 'leodex-volumebased-airdrop-leaderboard-is-now-live-ebf';

  console.log(`Fetching comments for ${author}/${permlink}...`);
  const comments = await getPostComments(author, permlink);

  if (comments) {
    console.log('Successfully fetched comments:');
    console.log(JSON.stringify(comments, null, 2));
  } else {
    console.log('Failed to fetch comments.');
  }
}

testGetPostComments();
