/**
 * Parse le contenu HTML et le nettoie pour un affichage JSX
 * @param htmlContent - Le contenu HTML à parser
 * @returns Le texte nettoyé
 */
export const parseHTMLContent = (htmlContent: string): string => {
  // Supprimer toutes les balises HTML
  let cleanText = htmlContent
    .replace(/<[^>]*>/g, '') // Supprime toutes les balises HTML
    .replace(/&nbsp;/g, ' ') // Remplace les espaces insécables
    .replace(/\s+/g, ' ') // Normalise les espaces multiples
    .trim(); // Supprime les espaces en début/fin

  return cleanText;
};

/**
 * Parse le contenu HTML et retourne un tableau de paragraphes
 * @param htmlContent - Le contenu HTML à parser
 * @returns Tableau de paragraphes
 */
export const parseHTMLToParagraphs = (htmlContent: string): string[] => {
  // Diviser par les balises </p> pour séparer les paragraphes
  const paragraphs = htmlContent
    .split('</p>')
    .map(p => parseHTMLContent(p))
    .filter(p => p.length > 0); // Filtrer les paragraphes vides

  return paragraphs;
};