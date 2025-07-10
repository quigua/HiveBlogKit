import { getAllCommunities } from '../../../index.js';
import fs from 'fs/promises';
import path from 'path';

async function testGetAllCommunities() {
    console.log('Testing getAllCommunities...');
    try {
        const filePath = await getAllCommunities();
        console.log(`getAllCommunities completed. Communities saved to: ${filePath}`);

        // Optional: Read the file to verify content
        const fileContent = await fs.readFile(filePath, 'utf8');
        const communities = JSON.parse(fileContent);

        if (communities.length > 0) {
            console.log(`Test Passed: Successfully fetched and saved ${communities.length} communities.`);
            console.log('First community:', communities[0]);
            console.log('Last community:', communities[communities.length - 1]);
        } else {
            console.error('Test Failed: No communities were fetched.');
        }
    } catch (error) {
        console.error('Test Failed: An error occurred during getAllCommunities test:', error);
    }
}

testGetAllCommunities();
