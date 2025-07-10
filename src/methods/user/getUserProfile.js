import { condenser_api_get_accounts } from '../../lib/hive-rpc/api.js';

async function getUserProfile(username) {
  if (typeof username !== 'string' || username.length === 0) {
    throw new Error('Invalid username provided.');
  }

  try {
    const result = await condenser_api_get_accounts([username]);
    if (result && result.result && result.result.length > 0) {
      return result.result[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { getUserProfile };
