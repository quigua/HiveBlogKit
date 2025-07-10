// src/methods/reputation/getAccountReputation.js

import { performRpcCall } from '../../lib/hive-rpc/core.js';
import { convertRawReputation } from './utils/convertReputation.js';

/**
 * Obtiene la reputación de una cuenta de Hive y la devuelve como un número.
 *
 * @param {string} accountName - El nombre de la cuenta para la que se desea obtener la reputación.
 * @returns {Promise<number|null>} La reputación convertida (formato legible), o null si no se puede obtener.
 */
export async function getAccountReputation(accountName) {
    try {
        const result = await performRpcCall('condenser_api.get_account_reputations', [accountName, 1]);

        if (result && Array.isArray(result) && result.length > 0) {
            const reputationData = result[0];
            const rawReputation = reputationData.reputation;
            const convertedReputation = convertRawReputation(rawReputation);
            // ¡Este es el cambio clave! Devolvemos directamente el número
            return convertedReputation;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}