// src/lib/utils/post-parser.js

/**
 * Parsea una cadena JSON y devuelve el objeto JavaScript correspondiente.
 * Si la cadena es nula, vacía o inválida, devuelve un objeto vacío y registra una advertencia.
 * @param {string|null|undefined} jsonString - La cadena JSON a parsear.
 * @returns {object} El objeto JavaScript parseado o un objeto vacío si falla.
 */
export function parseJsonMetadata(jsonString) {
    try {
        if (!jsonString) {
            return {}; // Devuelve un objeto vacío si la cadena es nula o vacía
        }
        return JSON.parse(jsonString);
    } catch (e) {
        console.warn("WARN: Metadata JSON inválida o corrupta. Devuelve objeto vacío. Error:", e);
        return {};
    }
}

// Puedes añadir más utilidades aquí más adelante si son necesarias,
// como getFirstImageUrl, getPostAbstract, etc.