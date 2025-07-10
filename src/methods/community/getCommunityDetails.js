import { bridge_get_community } from '../../lib/hive-rpc/api.js';

export async function getCommunityDetails(communityName) {
    try {
        const response = await bridge_get_community(communityName);
        return response;
    } catch (error) {
        console.error('Error fetching community details:', error);
        throw error;
    }
}
