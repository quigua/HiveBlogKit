// test_community_subscriptions.js

import { getUserCommunitySubscriptions } from './index.js';

async function runTest() {
    const username = 'quigua'; // Puedes cambiar este usuario para probar
    console.log(`Probando getUserCommunitySubscriptions para el usuario: ${username}`);

    try {
        const subscriptions = await getUserCommunitySubscriptions(username);

        if (subscriptions) {
            console.log(`Suscripciones de comunidad para ${username}:`);
            subscriptions.forEach(sub => {
                console.log(`  - ID: ${sub[0]}, Nombre: ${sub[1]}, Rol: ${sub[2]}`);
            });
        } else {
            console.log(`No se pudieron obtener las suscripciones para ${username}.`);
        }
    } catch (error) {
        console.error(`Error durante la prueba: ${error.message}`);
    }
}

runTest();
