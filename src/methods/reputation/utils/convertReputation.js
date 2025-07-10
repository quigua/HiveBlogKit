// methods/reputation/utils/convertReputation.js
// Función de utilidad para convertir la reputación raw a un formato legible.

/**
 * Convierte la reputación Raw VESTS (un número entero largo) a un formato legible para humanos.
 * Basado en la lógica de conversión de reputación de Hive.
 * @param {string|number} rawReputation - La reputación en formato raw (entero largo, puede ser string o number).
 * @returns {number} La reputación en un formato de punto flotante más legible (ej. 75.1).
 */
export function convertRawReputation(rawReputation) {
    if (rawReputation === undefined || rawReputation === null || isNaN(Number(rawReputation))) {
        return 0;
    }

    let rep = Number(rawReputation);

    if (rep === 0) {
        return 0;
    }

    let neg = rep < 0;
    rep = Math.abs(rep);
    rep = Math.log10(rep);
    rep = Math.max(rep - 9, 0);
    rep = rep * 9 + 25;
    if (neg) {
        rep *= -1;
    }

    return parseFloat(rep.toFixed(2));
    
}
