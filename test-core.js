// test-core.js
import { performRpcCall } from './src/lib/hive-rpc/core.js';

async function testCoreFunctionality() {
    console.log("Iniciando prueba de core.js...");
    try {
        // Intenta obtener los detalles de una cuenta conocida (ej. 'quigua' o 'hiveio')
        // Método: condenser_api.get_accounts
        // Parámetros: Un array que contiene un array con los nombres de usuario a buscar
        const accountData = await performRpcCall('condenser_api.get_accounts', [['quigua']]);

        console.log("\n--- Resultado de la Prueba EXITOSA ---");
        console.log("Datos de la cuenta 'quigua' obtenidos:");
        console.log(JSON.stringify(accountData, null, 2));
        console.log("core.js parece funcionar correctamente.");

    } catch (error) {
        console.error("\n--- Resultado de la Prueba FALLIDA ---");
        console.error("Error al probar core.js:", error.message);
        console.error("Verifica tu conexión a internet, los nodos RPC en core.js, o la implementación de performRpcCall.");
    } finally {
        console.log("\nPrueba de core.js finalizada.");
    }
}

// Ejecuta la función de prueba
testCoreFunctionality();
