import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Alumni {
  _id: string;
  nom: string;
  description: string;
  titre: string;
  photo: string;
}

interface AlumniModalProps {
  isOpen: boolean;
  onClose: () => void;
  alumni: Alumni[];
}

const AlumniModal: React.FC<AlumniModalProps> = ({ isOpen, onClose, alumni }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-blacksection rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Nos Alumni</h2>
                <p className="text-white/90 mt-1">La fierté de notre section</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((alumnus, index) => (
                <motion.div
                  key={alumnus._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Photo */}
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden border-3 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                      <Image
                        src={alumnus.photo}
                        alt={alumnus.nom}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Nom */}
                  <h3 className="text-lg font-bold text-black dark:text-white text-center mb-2">
                    {alumnus.nom}
                  </h3>

                  {/* Titre */}
                  <p className="text-primary dark:text-secondary font-medium text-center mb-3">
                    {alumnus.titre}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                    {alumnus.description}
                  </p>

                  {/* Ligne décorative */}
                  <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full"></div>
                </motion.div>
              ))}
            </div>

            {/* Empty state */}
            {alumni.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Aucun alumni disponible
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Les informations sur nos anciens étudiants seront bientôt disponibles.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlumniModal;