// src/methods/user/getAccountProfile.js

import { performRpcCall } from '../../lib/hive-rpc/core.js';
import { getAccountReputation } from '../reputation/getAccountReputation.js'; // Necesaria para el perfil completo

/**
 * Obtiene los datos del perfil público de un usuario de Hive, incluyendo la reputación.
 * La reputación se obtiene a través del método getAccountReputation para asegurar consistencia.
 *
 * @param {string} accountName - El nombre de la cuenta cuyo perfil se desea obtener.
 * @returns {Promise<object|null>} Un objeto con la información del perfil (incluyendo reputación), o null si no se encuentra o hay un error.
 */
export async function getAccountProfile(accountName) {
    try {
        const result = await performRpcCall('condenser_api.get_accounts', [[accountName]]);

        // Obtener la reputación usando tu función dedicada
        const reputationValue = await getAccountReputation(accountName);

        if (result && Array.isArray(result) && result.length > 0) {
            const account = result[0];

            let profileMetadata = {};
            try {
                if (typeof account.posting_json_metadata === 'string' && account.posting_json_metadata.trim() !== '') {
                    profileMetadata = JSON.parse(account.posting_json_metadata).profile || {};
                }
            } catch (parseError) {
                console.warn(`Error al parsear posting_json_metadata para '${accountName}':`, parseError.message);
                profileMetadata = {};
            }

            const profile = {
                name: account.name,
                reputation: reputationValue, // Reputación incluida aquí
                created: account.created,
                postCount: account.post_count,
                lastPost: account.last_post,
                about: profileMetadata.about || '',
                location: profileMetadata.location || '',
                website: profileMetadata.website || '',
                profileImage: profileMetadata.profile_image || '',
                coverImage: profileMetadata.cover_image || '',
                displayName: profileMetadata.name || account.name,
            };

            return profile;
        } else {
            console.warn(`No se encontró información de cuenta para '${accountName}'.`);
            return null;
        }
    } catch (error) {
        console.error(`Error al obtener el perfil para '${accountName}':`, error.message);
        return null;
    }
}

// --- Ejemplo de uso directo (para pruebas) ---
async function testMethod() {
    const accountToTest = 'quigua';
    const profile = await getAccountProfile(accountToTest);

    if (profile) {
        console.log(profile); // Solo muestra el objeto de perfil
    } else {
        // Los warnings/errores ya se gestionan dentro de getAccountProfile
        // Este else es solo un fallback si getAccountProfile devuelve null
        // sin un mensaje específico (aunque ya tiene algunos).
    }
}

// Ejecuta la función de prueba si este script se ejecuta directamente
if (import.meta.url === (new URL(process.argv[1], import.meta.url)).href) {
    testMethod();
}