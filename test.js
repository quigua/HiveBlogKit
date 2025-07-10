import { getAccountProfile } from './src/methods/user/getAccountProfile.js';

async function obtenerSoloReputacion() {
    const reputacionDeUsuario = await getAccountProfile('quigua');
    console.log(reputacionDeUsuario); // Esto imprimirá 53.52 (o el valor actual)
}

obtenerSoloReputacion();