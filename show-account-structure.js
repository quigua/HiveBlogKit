// show-account-structure.js
import { performRpcCall } from './src/lib/hive-rpc/core.js';

async function showAccountStructure() {
    const usernameToTest = 'quigua'; // Mantén el mismo usuario para consistencia

    console.log(`\n--- Obteniendo la estructura de campos para la cuenta '${usernameToTest}' ---`);
    try {
        const accountData = await performRpcCall('condenser_api.get_accounts', [[usernameToTest]]);

        if (accountData && accountData.length > 0) {
            const accountObject = accountData[0]; // Tomamos el primer objeto de la cuenta
            console.log(`\nEstructura de campos de primer nivel para '${usernameToTest}':`);

            for (const key in accountObject) {
                if (Object.prototype.hasOwnProperty.call(accountObject, key)) {
                    const value = accountObject[key];
                    // Determina el tipo y si es un objeto o array anidado
                    let type = typeof value;
                    if (type === 'object' && value !== null) {
                        if (Array.isArray(value)) {
                            type = `array (longitud: ${value.length})`;
                        } else {
                            type = `object (claves: ${Object.keys(value).length})`;
                        }
                    }
                    console.log(`- ${key}: ${type}`);
                }
            }

            // **Nota Especial sobre 'json_metadata':**
            // Esta es una cadena JSON que necesita ser parseada para ver su contenido interno.
            // Es un campo clave para extraer información de perfil (imagen, descripción, etc.).
            if (accountObject.json_metadata) {
                try {
                    const metadata = JSON.parse(accountObject.json_metadata);
                    console.log("\nContenido PARSEADO de 'json_metadata':");
                    for (const key in metadata) {
                        if (Object.prototype.hasOwnProperty.call(metadata, key)) {
                            const value = metadata[key];
                            let type = typeof value;
                            if (type === 'object' && value !== null) {
                                if (Array.isArray(value)) {
                                    type = `array (longitud: ${value.length})`;
                                } else {
                                    type = `object (claves: ${Object.keys(value).length})`;
                                }
                            }
                            console.log(`  - ${key}: ${type}`);
                        }
                    }
                } catch (e) {
                    console.warn(`\nWARNING: 'json_metadata' no es un JSON válido o está vacío.`);
                }
            }

        } else {
            console.log(`No se encontraron datos para la cuenta '${usernameToTest}'.`);
        }

    } catch (error) {
        console.error("\n--- Error al obtener la estructura de campos ---");
        console.error(`Error:`, error.message);
    } finally {
        console.log("\n--- Análisis de estructura completado ---");
    }
}

showAccountStructure();
