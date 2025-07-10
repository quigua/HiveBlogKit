import { getCommunityDetails } from '../../../index.js';

async function testGetCommunityDetails() {
    console.log('Testing getCommunityDetails...');
    try {
        const communityName = 'hive-148441'; // Example community name
        const details = await getCommunityDetails(communityName);
        console.log('Community Details for ', communityName, ':', JSON.stringify(details, null, 2));

        if (details && details.result && details.result.title === 'GEMS') {
            console.log('Test Passed: getCommunityDetails returned expected title.');
        } else {
            console.error('Test Failed: getCommunityDetails did not return expected title.');
        }
    } catch (error) {
        console.error('Test Failed: An error occurred during getCommunityDetails test:', error);
    }
}

testGetCommunityDetails();