import { rawApiCall } from '../../lib/hive-rpc/api.js';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = '/home/elvis/Web/HiveBlogs/src/data';
const ALL_COMMUNITIES_FILE = path.join(DATA_DIR, 'all_communities.json');

/**
 * Fetches all communities from the Hive blockchain using pagination and saves them to a JSON file.
 * @returns {Promise<string>} A promise that resolves with the path to the saved file.
 */
export async function getAllCommunities() {
    console.log('Fetching all communities...');
    let allCommunities = [];
    let lastCommunityName = null;
    const limit = 100; // Fetch 100 communities at a time

    try {
        // Ensure the data directory exists
        await fs.mkdir(DATA_DIR, { recursive: true });

        while (true) {
            const params = {
                limit: limit,
                sort: 'new' // Sort by new to ensure consistent pagination
            };

            if (lastCommunityName) {
                params.last = lastCommunityName;
            }

            const response = await rawApiCall('bridge.list_communities', params);

            if (response.error) {
                throw new Error(`Error fetching communities: ${response.error.message}`);
            }

            const communities = response.result;

            if (!communities || communities.length === 0) {
                break; // No more communities to fetch
            }

            allCommunities = allCommunities.concat(communities);

            // Update lastCommunityName for the next iteration
            lastCommunityName = communities[communities.length - 1].name;

            console.log(`Fetched ${allCommunities.length} communities so far...`);

            // Add a small delay to avoid hitting rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        await fs.writeFile(ALL_COMMUNITIES_FILE, JSON.stringify(allCommunities, null, 2), 'utf8');
        console.log(`All communities saved to ${ALL_COMMUNITIES_FILE}`);
        return ALL_COMMUNITIES_FILE;

    } catch (error) {
        console.error('Error in getAllCommunities:', error);
        throw error;
    }
}
