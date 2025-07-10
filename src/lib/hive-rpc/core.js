// src/lib/hive-rpc/core.js

import { HIVE_NODES } from '../../utils/hiveNodes.js';

let currentRpcNodeIndex = -1;
let requestIdCounter = 0;
// console.log("DEBUG: src/lib/hive-rpc/core.js cargado y variables inicializadas.");

function getNextHiveNode() {
    currentRpcNodeIndex = (currentRpcNodeIndex + 1) % HIVE_NODES.length;
    return HIVE_NODES[currentRpcNodeIndex];
}

export async function performRpcCall(method, params, maxRetries = HIVE_NODES.length) {
    let attempts = 0;
    let lastError = null;

    while (attempts < maxRetries) {
        const nodeUrl = getNextHiveNode();
        attempts++;
        //console.log(`[RPC] Intento '${attempts}'/'${maxRetries}' para '${method}' en ${nodeUrl}`);

        requestIdCounter++;

        const payload = {
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: requestIdCounter
        };

        // --- AÑADE ESTAS LÍNEAS PARA DEPURACIÓN ---
        //console.log("DEBUG: Payload enviado:");
        //console.log(JSON.stringify(payload, null, 2)); // Formato legible para el JSON
        // ------------------------------------------

        try {
            const response = await fetch(nodeUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(15000)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                lastError = `HTTP Error ${response.status} de ${nodeUrl}: ${response.statusText}. Body: ${errorBody.substring(0, 100)}`;
                console.warn(`[RPC] ${lastError}. Intentando con el siguiente nodo.`);
                continue;
            }

            const data = await response.json();

            if (data.error) {
                lastError = `Hive API error de ${nodeUrl}: ${data.error.message || JSON.stringify(data.error)}`;
                console.error(`[RPC] ${lastError}. Intentando con el siguiente nodo.`);
                continue;
            }

            //console.log(`[RPC] Éxito para '${method}' en ${nodeUrl}.`);
            return data.result;

        } catch (error) {
            if (error.name === 'AbortError') {
                lastError = `Timeout al conectar con <span class="math-inline">\{nodeUrl\} para '</span>{method}'.`;
            } else if (error.code === 'ENOTFOUND') {
                lastError = `Error de DNS (nodo no encontrado): ${nodeUrl}`;
            } else {
                lastError = `Error inesperado para '${method}' en ${nodeUrl}: ${error.message}`;
            }
            console.error(`[RPC] ${lastError}. Intentando con el siguiente nodo.`);
        }
    }

    console.error(`[RPC] Fallo definitivo para el método '${method}' después de ${maxRetries} intentos. Último error: ${lastError}`);
    throw new Error(`Failed to perform RPC call for ${method} after ${maxRetries} attempts. Last error: ${lastError}`);
}