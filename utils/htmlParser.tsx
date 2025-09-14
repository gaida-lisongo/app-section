import React from 'react';

/**
 * Parse le contenu HTML et le convertit en JSX pour affichage
 * @param htmlContent - Le contenu HTML à parser
 * @returns JSX elements
 */
export const parseHTMLToJSX = (htmlContent: string): React.ReactElement => {
  // Nettoyer le HTML et remplacer les balises par des équivalents JSX
  const cleanHTML = htmlContent
    .replace(/<p><\/p>/g, '') // Supprimer les paragraphes vides
    .replace(/<p>/g, '<div className="mb-4">') // Convertir p en div avec marge
    .replace(/<\/p>/g, '</div>')
    .replace(/<span>/g, '<span>') // Garder les spans
    .replace(/<\/span>/g, '</span>')
    .replace(/style="text-align: justify;"/g, 'className="text-justify"') // Convertir style en className
    .replace(/&nbsp;/g, ' '); // Remplacer les espaces insécables

  // Fonction pour créer les éléments JSX à partir du contenu nettoyé
  const createJSXFromHTML = (content: string) => {
    // Diviser le contenu en paragraphes
    const paragraphs = content.split('</div>').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Nettoyer chaque paragraphe
      const cleanParagraph = paragraph
        .replace('<div className="mb-4">', '')
        .replace('<div className="mb-4 text-justify">', '')
        .replace(/<span>/g, '')
        .replace(/<\/span>/g, '')
        .trim();

      if (!cleanParagraph) return null;

      // Déterminer si c'est justifié
      const isJustified = paragraph.includes('text-justify');
      
      return (
        <div 
          key={index} 
          className={`mb-4 ${isJustified ? 'text-justify' : ''}`}
        >
          {cleanParagraph}
        </div>
      );
    }).filter(Boolean);
  };

  return <>{createJSXFromHTML(cleanHTML)}</>;
};

/**
 * Composant Quote pour mettre en valeur le message du GG
 * @param htmlContent - Le contenu HTML à afficher
 * @param author - L'auteur de la citation (optionnel)
 * @param title - Le titre/fonction de l'auteur (optionnel)
 */
interface QuoteProps {
  htmlContent: string;
  author?: string;
  title?: string;
}

export const HTMLQuote: React.FC<QuoteProps> = ({ 
  htmlContent, 
  author = "Gouverneur Général", 
  title = "Message du Gouverneur Général" 
}) => {
  const parsedContent = parseHTMLToJSX(htmlContent);

  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg border-l-4 border-primary">
      {/* Icône de citation */}
      <div className="absolute top-4 left-4 text-primary opacity-20">
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
        </svg>
      </div>

      {/* Titre */}
      <h3 className="text-xl font-bold text-primary dark:text-white mb-6 pl-8">
        {title}
      </h3>

      {/* Contenu de la citation */}
      <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
        {parsedContent}
      </blockquote>

      {/* Signature */}
      {author && (
        <footer className="mt-6 text-right">
          <cite className="text-sm font-medium text-primary dark:text-white not-italic">
            — {author}
          </cite>
        </footer>
      )}
    </div>
  );
};