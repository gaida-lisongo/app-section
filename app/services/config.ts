/**
 * Configuration de l'application utilisant les variables d'environnement
 */

interface Config {
  _id: string;
  base_url: string;
}

// Configuration par défaut
const defaultConfig: Config = {
  _id: "68c52ec8957f9a89ad8bfc3c",
  base_url: "https://server-he.he-section.site/api/v1",
};

// Charger la configuration depuis les variables d'environnement
const config: Config = {
  _id: process.env.NEXT_PUBLIC_APP_ID || defaultConfig._id,
  base_url: process.env.NEXT_PUBLIC_API_BASE_URL || defaultConfig.base_url
};

// Validation et warnings
if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.warn('⚠️ NEXT_PUBLIC_API_BASE_URL non définie dans .env.local, utilisation de la valeur par défaut');
}

if (!process.env.NEXT_PUBLIC_APP_ID) {
  console.warn('⚠️ NEXT_PUBLIC_APP_ID non définie dans .env.local, utilisation de la valeur par défaut');
}

export default config;
