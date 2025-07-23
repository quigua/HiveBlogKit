// src/lib/hive-rpc/api.js
// This module contains functions that return the raw and complete JSON response
// from Hive API calls, mimicking cURL behavior.

const HIVE_NODE_URLS = [
    'https://api.hive.blog',
    'https://api.deathwing.me',
    'https://rpc.ecency.com',
    'https://api.openhive.network',
];

// Helper function to perform the direct fetch call
// with a dynamic ID and return the complete response.
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 1000; // 1 second

export async function rawApiCall(method, params) {
    const url = HIVE_NODE_URLS[0]; 
    const payload = {
        jsonrpc: "2.0",
        method: method,
        params: params,
        id: Math.floor(Math.random() * 1000000) // Generate a random ID for each request
    };

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                const errorMessage = `HTTP Error: ${response.status} ${response.statusText}. Body: ${errorBody.substring(0, 200)}`;
                
                // Retry only for 5xx errors (server errors) or network errors
                if (response.status >= 500 && response.status < 600) {
                    console.warn(`Attempt ${i + 1} for ${method} failed with ${response.status}. Retrying...`);
                    const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, i);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue; // Try again
                } else {
                    throw new Error(errorMessage); // Re-throw for non-retryable errors
                }
            }

            return await response.json(); // Return the complete JSON response
        } catch (error) {
            // Catch network errors (e.g., DNS resolution failure, connection refused)
            if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
                console.warn(`Attempt ${i + 1} for ${method} failed with network error. Retrying...`);
                const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, i);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue; // Try again
            } else {
                console.error(`Error in rawApiCall for method '${method}':`, error.message);
                throw error; // Re-throw for other unexpected errors
            }
        }
    }

    // If all retries fail
    const finalError = new Error(`Failed to call ${method} after ${MAX_RETRIES} attempts.`);
    console.error(finalError.message);
    throw finalError;
}

/**
 * Calls condenser_api.get_accounts and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_accounts` in cURL.
 * @param {Array<string>} usernames - An array of usernames to query.
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_accounts(usernames) {
    if (!Array.isArray(usernames) || usernames.length === 0) {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Array of usernames is required for condenser_api_get_accounts"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_accounts', [usernames]);
}

/**
 * Calls condenser_api.get_blog and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_blog` in cURL.
 * @param {string} username - The username whose blog to query.
 * @param {number} [startEntryId=0] - The ID of the entry from which to start (0 for most recent).
 * @param {number} [limit=20] - The maximum number of blog entries to retrieve.
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_blog(username, startEntryId = 0, limit = 20) {
    if (!username) {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Username is required for condenser_api_get_blog"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_blog', [username, startEntryId, limit]);
}

/**
 * Calls condenser_api.get_content and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_content` in cURL.
 * @param {string} author - The author of the content.
 * @param {string} permlink - The permlink of the content.
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_content(author, permlink) {
    if (!author || !permlink) {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Author and permlink are required for condenser_api_get_content"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_content', [author, permlink]);
}

/**
 * Calls condenser_api.get_discussions_by_trending and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_discussions_by_trending` in cURL.
 * @param {object} query - An object containing query parameters (e.g., {tag: "hive", limit: 10}).
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_discussions_by_trending(query) {
    if (!query || typeof query !== 'object') {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Query object is required for condenser_api_get_discussions_by_trending"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_discussions_by_trending', [query]);
}

/**
 * Calls condenser_api.get_discussions_by_hot and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_discussions_by_hot` in cURL.
 * @param {object} query - An object containing query parameters (e.g., {tag: "hive", limit: 10}).
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_discussions_by_hot(query) {
    if (!query || typeof query !== 'object') {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Query object is required for condenser_api_get_discussions_by_hot"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_discussions_by_hot', [query]);
}

/**
 * Calls condenser_api.get_discussions_by_created and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_discussions_by_created` in cURL.
 * @param {object} query - An object containing query parameters (e.g., {tag: "hive", limit: 10}).
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_discussions_by_created(query) {
    if (!query || typeof query !== 'object') {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Query object is required for condenser_api_get_discussions_by_created"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_discussions_by_created', [query]);
}

/**
 * Calls condenser_api.get_state and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_state` in cURL.
 * @param {string} path - The path to query (e.g., "/trending", "@username/permlink").
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_state(path) {
    if (!path || typeof path !== 'string') {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Path (string) is required for condenser_api_get_state"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_state', [path]);
}

/**
 * Calls condenser_api.get_followers and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_followers` in cURL.
 * @param {string} account - The account name to query.
 * @param {string} startFollower - The follower name to start from (empty string for beginning).
 * @param {string} followType - The type of follow (e.g., "blog", "ignore").
 * @param {number} limit - The maximum number of followers to retrieve.
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_followers(account, startFollower, followType, limit) {
    if (!account || !followType) {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Account and followType are required for condenser_api_get_followers"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_followers', [account, startFollower, followType, limit]);
}

/**
 * Calls condenser_api.get_following and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_following` in cURL.
 * @param {string} account - The account name to query.
 * @param {string} startFollowing - The following name to start from (empty string for beginning).
 * @param {string} followType - The type of follow (e.g., "blog", "ignore").
 * @param {number} limit - The maximum number of accounts to retrieve.
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_following(account, startFollowing, followType, limit) {
    if (!account || !followType) {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Account and followType are required for condenser_api_get_following"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_following', [account, startFollowing, followType, limit]);
}

/**
 * Calls condenser_api.get_blog_authors and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_blog_authors` in cURL.
 * @param {string} blogAccount - The account name whose blog authors to query.
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_blog_authors(blogAccount) {
    if (!blogAccount) {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Blog account is required for condenser_api_get_blog_authors"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_blog_authors', [blogAccount]);
}

/**
 * Calls bridge.get_community and returns the complete (RAW) JSON response.
 * Corresponds to `bridge.get_community` in cURL.
 * @param {string} communityName - The name of the community to query.
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function bridge_get_community(communityName) {
    if (!communityName) {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Community name is required for bridge_get_community"
            },
            id: null
        };
    }
    return rawApiCall('bridge.get_community', { name: communityName });
}

/**
 * Calls condenser_api.get_content_replies and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_content_replies` in cURL.
 * @param {string} author - The author of the parent post/comment.
 * @param {string} permlink - The permlink of the parent post/comment.
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_content_replies(author, permlink) {
    if (!author || !permlink) {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Author and permlink are required for condenser_api.get_content_replies"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_content_replies', [author, permlink]);
}

/**
 * Calls condenser_api.get_discussions_by_comments and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_discussions_by_comments` in cURL.
 * @param {object} query - An object containing query parameters (e.g., {start_author: "username", limit: 10}).
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_discussions_by_comments(query) {
    if (!query || typeof query !== 'object') {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "Query object is required for condenser_api_get_discussions_by_comments"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_discussions_by_comments', [query]);
}

/**
 * Calls condenser_api.get_replies_by_last_update and returns the complete (RAW) JSON response.
 * Corresponds to `condenser_api.get_replies_by_last_update` in cURL.
 * @param {string} start_author - The author to start from.
 * @param {string} start_permlink - The permlink to start from.
 * @param {number} limit - The maximum number of replies to retrieve.
 * @returns {Promise<object>} The complete JSON response from the Hive node.
 */
export async function condenser_api_get_replies_by_last_update(start_author, start_permlink, limit) {
    if (!start_author) {
        return {
            jsonrpc: "2.0",
            error: {
                code: -32602,
                message: "Invalid params",
                data: "start_author is required for condenser_api_get_replies_by_last_update"
            },
            id: null
        };
    }
    return rawApiCall('condenser_api.get_replies_by_last_update', [start_author, start_permlink, limit]);
}