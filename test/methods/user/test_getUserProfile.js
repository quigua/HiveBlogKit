import { getUserProfile } from '../../../src/methods/user/getUserProfile.js';

async function test() {
  try {
    const profile = await getUserProfile('quigua');
    console.log(JSON.stringify(profile, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
