import { getUserCommunitySubscriptions } from './index.js';

async function testGetUserSubscriptions() {
    console.log('Testing getUserCommunitySubscriptions for quigua...');
    try {
        const subscriptions = await getUserCommunitySubscriptions('quigua');
        console.log('Raw subscriptions response:', JSON.stringify(subscriptions, null, 2));

        if (subscriptions && subscriptions.length > 0) {
            console.log('Found subscriptions:', subscriptions.map(sub => sub[1]));
        } else {
            console.log('No subscriptions found or unexpected response format.');
        }
    } catch (error) {
        console.error('Error during getUserCommunitySubscriptions test:', error);
    }
}

testGetUserSubscriptions();