import React, { useState } from "react";
import { Feature } from "@/types/feature";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, titre, description } = feature;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour tronquer le texte
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
          },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ 
          duration: 0.6, 
          delay: 0.1,
          ease: "easeOut"
        }}
        whileHover={{
          y: -8,
          transition: { duration: 0.3 }
        }}
        viewport={{ once: true }}
        onClick={openModal}
        className="group relative animate_top z-40 rounded-xl overflow-hidden shadow-solid-3 transition-all duration-300 hover:shadow-solid-4 h-80 cursor-pointer"
      >
        {/* Image de fond */}
        <div className="absolute inset-0">
          {icon ? (
            <Image 
              src={icon} 
              fill
              alt={titre}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
          )}
        </div>

        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 transition-opacity duration-500 group-hover:from-black/60 group-hover:via-black/20 group-hover:to-black/5" />
        
        {/* Overlay coloré au hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Contenu texte */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          {/* Titre avec animation */}
          <motion.h3 
            className="mb-3 text-2xl font-bold leading-tight"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            {titre}
            {/* Ligne décorative */}
            <motion.div 
              className="mt-2 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "60px" }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </motion.h3>
          
          {/* Description avec animation - TRONQUÉE */}
          <motion.p 
            className="text-gray-100 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {truncateText(description, 80)}
          </motion.p>

          {/* Indicateur "Voir plus" */}
          {description.length > 80 && (
            <motion.span 
              className="inline-block mt-2 text-blue-300 text-sm font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Cliquez pour voir plus...
            </motion.span>
          )}

          {/* Badge informatif en haut à droite */}
          <motion.div
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 transition-all duration-300 group-hover:opacity-100"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.div>
        </div>

        {/* Effet de brillance au hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full transition-transform duration-1000 group-hover:translate-x-full"
          initial={false}
        />
      </motion.div>

      {/* MODAL POUR LES DÉTAILS */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              {/* Modal Content */}
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header avec image */}
                <div className="relative h-48 overflow-hidden">
                  {icon ? (
                    <Image 
                      src={icon} 
                      fill
                      alt={titre}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Bouton de fermeture */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Titre sur l'image */}
                  <div className="absolute bottom-4 left-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{titre}</h2>
                    <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                  </div>
                </div>

                {/* Contenu détaillé */}
                <div className="p-6 overflow-y-auto max-h-96">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Description complète
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3 justify-end">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SingleFeature;
