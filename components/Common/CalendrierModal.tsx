import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSectionStore, useAnneeStore } from '@/store';
import { parseHTMLContent } from '@/utils/parseHTML';

interface CalendrierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendrierModal: React.FC<CalendrierModalProps> = ({ isOpen, onClose }) => {
  const { section } = useSectionStore();
  const { currentAnnee } = useAnneeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Filtrer les articles de l'année académique liés à la section
  const evenements = currentAnnee?.articles.filter(article => 
    article.sectionId === section?._id
  ) || [];

  // Obtenir tous les tags uniques
  const allTags = [...new Set(evenements.flatMap(event => event.tags))];

  // Filtrer les événements selon la recherche et le tag sélectionné
  const filteredEvents = evenements.filter(event => {
    const cleanContent = parseHTMLContent(event.content);
    const matchSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cleanContent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTag = !selectedTag || event.tags.includes(selectedTag);
    return matchSearch && matchTag;
  });

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-99999 flex items-center justify-center">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] mx-4 bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Calendrier Académique
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {section?.description.designation} • {currentAnnee?.debut}-{currentAnnee?.fin}
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="mt-4 space-y-3">
              {/* Recherche */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher dans les événements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag('')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    !selectedTag 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Tous ({evenements.length})
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTag === tag 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag} ({evenements.filter(e => e.tags.includes(tag)).length})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucun événement trouvé
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || selectedTag 
                    ? "Essayez de modifier vos critères de recherche"
                    : "Aucun événement n'est disponible pour cette section"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex">
                      {/* Image - 1/5 de la largeur */}
                      {event.image && (
                        <div className="w-1/5 relative">
                          <div className="absolute inset-0">
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {/* Overlay gradient pour un effet chic */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5"></div>
                        </div>
                      )}

                      {/* Contenu - 4/5 de la largeur */}
                      <div className={`${event.image ? 'w-4/5' : 'w-full'} p-6`}>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {event.title}
                          </h3>
                          <div className="flex flex-col sm:items-end text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Par {event.author}</span>
                            <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          {parseHTMLContent(event.content)}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary/10 to-primary/20 text-primary border border-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CalendrierModal;