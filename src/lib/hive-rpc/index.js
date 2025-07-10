// src/lib/hive-rpc/index.js

// Exporta la función central de llamada RPC.
export * from './core.js';

// Exporta todas las funciones definidas en api.js
export * from './api.js';

// Si en el futuro tienes funciones de alto nivel más procesadas para usuarios,
// las exportarías desde aquí. Por ejemplo, si creas getParsedUserProfile:
export * from './user.js';

// Si en el futuro tienes funciones de alto nivel más procesadas para posts,
// las exportarías desde aquí. Por ejemplo, si creas getProcessedBlogPosts:
export * from './posts.js';