/**
 * Utilitaire pour formater les prix en Franc Congolais (FC)
 */

export const formatPriceFC = (price: number): string => {
  // Formatage personnalisé pour le Franc Congolais
  return new Intl.NumberFormat('fr-CD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + ' FC';
};

export const formatPriceFCWithDecimals = (price: number): string => {
  // Formatage avec décimales si nécessaire
  return new Intl.NumberFormat('fr-CD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price) + ' FC';
};

// Alternative avec séparateurs personnalisés
export const formatPriceFCCustom = (price: number): string => {
  return price.toLocaleString('fr-CD') + ' FC';
};
