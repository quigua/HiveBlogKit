// test-get-blog.js
import { performRpcCall } from './src/lib/hive-rpc/core.js';

async function testGetBlogFullResponse() {
    const usernameToTest = 'quigua'; // Cambia a cualquier usuario de Hive con un blog para probar
    const startEntryId = 0;           // 0 para empezar desde el post más reciente
    const limit = 3;                  // Número de posts a recuperar (reducido para no saturar demasiado la terminal)

    console.log(`\n--- Iniciando prueba de 'get_blog' para el usuario '${usernameToTest}' ---`);
    console.log(`Recuperando los ${limit} posts más recientes (desde el ID ${startEntryId}) con toda la información...`);

    try {
        const blogPosts = await performRpcCall('condenser_api.get_blog', [usernameToTest, startEntryId, limit]);

        console.log("\n--- Resultado de 'get_blog' EXITOSO ---");
        if (blogPosts && blogPosts.length > 0) {
            console.log(`Información completa de los posts del blog de '${usernameToTest}' obtenidos:`);
            blogPosts.forEach((post, index) => {
                console.log(`\n--- Post #${index + 1} (Objeto 'blog' completo) ---`);
                // Imprime el objeto 'blog' completo del post, que contiene todos los campos.
                // Usamos JSON.stringify con indentación para una mejor lectura.
                console.log(JSON.stringify(post.blog, null, 2)); 
            });
        } else {
            console.log(`No se encontraron posts para el blog de '${usernameToTest}', o la cuenta no tiene un blog público.`);
        }

        console.log("\nPrueba de 'get_blog' finalizada correctamente.");

    } catch (error) {
        console.error("\n--- Resultado de 'get_blog' FALLIDO ---");
        console.error(`Error al obtener los posts del blog de '${usernameToTest}':`, error.message);
        console.error("Asegúrate de que 'core.js' esté correctamente configurado y haya conexión a los nodos de Hive.");
        console.error(`  Detalles del Error: ${JSON.stringify(error, null, 2)}`);
    } finally {
        console.log("\n--- Prueba de 'get_blog' completada ---");
    }
}

// Ejecuta la función de prueba
testGetBlogFullResponse();
