// src/methods/posts/getUsersRebloggedPosts.js

import { performRpcCall } from '../../lib/hive-rpc/core.js';
import { getAccountReputation } from '../reputation/getAccountReputation.js'; // Importar nuestro método de reputación

/**
 * Obtiene todas las publicaciones reblogueadas por un usuario específico,
 * manejando la paginación, eliminando duplicados, y agregando la reputación real del autor original.
 * Excluye la reputación cruda de la API.
 *
 * @param {string} accountName - El nombre de la cuenta para la que se desean obtener los posts reblogueados.
 * @returns {Promise<Array<object>>} Una lista de objetos de publicaciones reblogueadas, sin duplicados, con la reputación del autor original calculada.
 */
export async function getUsersRebloggedPosts(accountName) {
    let rebloggedPosts = [];
    const processedPermlinks = new Set();
    let startIndex = 0;
    const limit = 20; // Límite máximo por llamada para get_blog

    while (true) {
        let result;
        try {
            result = await performRpcCall('condenser_api.get_blog', [accountName, startIndex, limit]);
        } catch (error) {
            console.error(`Error al obtener entradas de blog para '${accountName}' desde start_index ${startIndex}:`, error.message);
            break;
        }

        if (!result || result.length === 0) {
            break;
        }

        let newlyAddedPostsThisBatch = 0;

        for (const entry of result) {
            const postPermlink = entry.comment ? entry.comment.permlink : null;

            if (postPermlink && !processedPermlinks.has(postPermlink)) {
                processedPermlinks.add(postPermlink);
                newlyAddedPostsThisBatch++;

                const rebloggedOn = entry.reblogged_on === '1970-01-01T00:00:00' ? null : entry.reblogged_on;

                if (rebloggedOn !== null) {
                    const postObject = { ...entry.comment }; // Copia el objeto para no modificar el original directamente
                    const postAuthor = postObject.author; // Este es el autor original del post reblogueado

                    // Elimina el campo de reputación cruda
                    delete postObject.author_reputation;

                    // Obtener y añadir la reputación real del autor original del post
                    try {
                        const authorReputationValue = await getAccountReputation(postAuthor);
                        postObject.author_reputation_calculated = authorReputationValue;
                    } catch (repError) {
                        console.warn(`Advertencia: No se pudo obtener la reputación para el autor '${postAuthor}' del reblog '${postPermlink}': ${repError.message}`);
                        postObject.author_reputation_calculated = null;
                    }
                    rebloggedPosts.push(postObject);
                }
            }
        }

        if (newlyAddedPostsThisBatch === 0 && startIndex > 0) {
            break;
        }
        
        startIndex += limit;
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    return rebloggedPosts;
}

// --- Ejemplo de uso directo (para pruebas) ---
async function testMethod() {
    const accountToTest = 'quigua';
    console.log(`Buscando publicaciones REBLOGUEADAS por '${accountToTest}' y calculando su reputación de autor original...`);
    const posts = await getUsersRebloggedPosts(accountToTest);

    if (posts && posts.length > 0) {
        console.log(`\nSe encontraron ${posts.length} publicaciones reblogueadas para '${accountToTest}':`);
        posts.forEach((post, index) => {
            console.log(`--- Reblog ${index + 1} ---`);
            console.log(`  Autor Original: ${post.author}`);
            console.log(`  Título: ${post.title || '[Sin Título]'}`);
            console.log(`  Permalink: ${post.permlink}`);
            console.log(`  Creado: ${post.created}`);
            console.log(`  Votos: ${post.active_votes ? post.active_votes.length : 0}`);
            console.log(`  Reputación del Autor Original (Calculada): ${post.author_reputation_calculated}`);
            console.log('---');
            // Verificación extra: Asegurarse de que author_reputation no está presente
            if (post.hasOwnProperty('author_reputation')) {
                console.warn(`¡Advertencia! 'author_reputation' todavía presente en el post ${index + 1}.`);
            }
        });
    } else {
        console.log(`\nNo se encontraron publicaciones reblogueadas para '${accountToTest}'.`);
    }

    console.log("\n--- Fin de la prueba del método ---");
}

// Ejecuta la función de prueba si este script se ejecuta directamente
if (import.meta.url === (new URL(process.argv[1], import.meta.url)).href) {
    testMethod();
}