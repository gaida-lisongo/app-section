import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Alumni {
  _id: string;
  nom: string;
  description: string;
  titre: string;
  photo: string;
}

interface AlumniSectionProps {
  alumni: Alumni[];
}

const AlumniSection: React.FC<AlumniSectionProps> = ({ alumni }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-défilement toutes les 5 secondes
  useEffect(() => {
    if (alumni.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === alumni.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [alumni.length]);

  if (!alumni || alumni.length === 0) {
    return null;
  }

  const currentAlumni = alumni[currentIndex];

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full h-full bg-white dark:bg-blacksection rounded-3xl shadow-2xl overflow-hidden p-8"
        >
          {/* Photo en miniature et contenu principal */}
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            
            {/* Photo miniature */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-xl border-4 border-primary/20"
            >
              <Image
                src={currentAlumni.photo}
                alt={currentAlumni.nom}
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Nom - Élément principal */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl md:text-4xl font-bold text-black dark:text-white text-center"
            >
              <span className="relative inline-block">
                {currentAlumni.nom}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></span>
              </span>
            </motion.h2>
            
            {/* Titre */}
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl md:text-2xl font-semibold text-primary dark:text-secondary text-center"
            >
              {currentAlumni.titre}
            </motion.h3>

            {/* Désignation */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 text-center max-w-md leading-relaxed"
            >
              {currentAlumni.description}
            </motion.p>

            {/* Séparateur décoratif */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="w-20 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>

          {/* Navigation dots */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {alumni.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary scale-125'
                    : 'bg-gray-400 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => {
              const newIndex = currentIndex === 0 ? alumni.length - 1 : currentIndex - 1;
              setCurrentIndex(newIndex);
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-primary/20 hover:bg-primary/40 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => {
              const newIndex = currentIndex === alumni.length - 1 ? 0 : currentIndex + 1;
              setCurrentIndex(newIndex);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-primary/20 hover:bg-primary/40 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AlumniSection;