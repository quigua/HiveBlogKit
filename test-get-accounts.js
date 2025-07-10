// test-get-accounts.js
import { performRpcCall } from './src/lib/hive-rpc/core.js';

async function testGetAccounts() {
    const usernameToTest = 'quigua'; // Puedes cambiar a cualquier usuario de Hive para probar

    console.log(`\n--- Iniciando prueba de 'get_accounts' para el usuario '${usernameToTest}' ---`);
    try {
        // Llamamos al método RPC 'condenser_api.get_accounts'
        // El parámetro esperado es un array que contiene otro array con los nombres de usuario.
        const accountData = await performRpcCall('condenser_api.get_accounts', [[usernameToTest]]);

        console.log("\n--- Resultado de 'get_accounts' EXITOSO ---");
        if (accountData && accountData.length > 0) {
            console.log(`Datos de la cuenta '${usernameToTest}' obtenidos:`);
            // Imprimimos el objeto de la cuenta completa para que veas todos los campos.
            // Usamos JSON.stringify con indentación para una mejor lectura.
            console.log(JSON.stringify(accountData[0], null, 2)); 
        } else {
            console.log(`No se encontraron datos para la cuenta '${usernameToTest}'.`);
        }

        console.log("Prueba de 'get_accounts' finalizada correctamente.");

    } catch (error) {
        console.error("\n--- Resultado de 'get_accounts' FALLIDO ---");
        console.error(`Error al obtener los datos de la cuenta '${usernameToTest}':`, error.message);
        console.error("Asegúrate de que 'core.js' esté correctamente configurado y haya conexión a los nodos de Hive.");
    } finally {
        console.log("\n--- Prueba de 'get_accounts' completada ---");
    }
}

// Ejecuta la función de prueba
testGetAccounts();
