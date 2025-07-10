// src/methods/user/getUserCommunitySubscriptions.js

import { performRpcCall } from '../../lib/hive-rpc/core.js';

/**
 * Obtiene las comunidades a las que un usuario de Hive está suscrito.
 *
 * @param {string} username - El nombre de usuario de Hive cuyas suscripciones se desean obtener.
 * @returns {Promise<Array<Array<string>>|null>} Una promesa que resuelve con un array de arrays, donde cada array interno representa una suscripción [community_id, community_name, user_role, additional_field], o null si hay un error.
 */
export async function getUserCommunitySubscriptions(username) {
    try {
        // La llamada RPC al método bridge.list_all_subscriptions
        const result = await performRpcCall('bridge.list_all_subscriptions', [username]);

        // El resultado esperado es un array de arrays, como se documentó en bridge_api_responses.md
        if (result && Array.isArray(result)) {
            return result;
        } else {
            console.warn(`No se encontraron suscripciones para el usuario '${username}' o la respuesta no tiene el formato esperado.`);
            return null;
        }
    } catch (error) {
        console.error(`Error al obtener las suscripciones de comunidad para '${username}':`, error.message);
        return null;
    }
}

// --- Ejemplo de uso directo (para pruebas) ---
async function testMethod() {
    const userToTest = 'quigua'; // Puedes cambiar este usuario para probar
    const subscriptions = await getUserCommunitySubscriptions(userToTest);

    if (subscriptions) {
        console.log(`Suscripciones de comunidad para ${userToTest}:`);
        subscriptions.forEach(sub => {
            console.log(`  - ID: ${sub[0]}, Nombre: ${sub[1]}, Rol: ${sub[2]}`);
        });
    } else {
        console.log(`No se pudieron obtener las suscripciones para ${userToTest}.`);
    }
}

// Ejecuta la función de prueba si este script se ejecuta directamente
if (import.meta.url === (new URL(process.argv[1], import.meta.url)).href) {
    testMethod();
}
