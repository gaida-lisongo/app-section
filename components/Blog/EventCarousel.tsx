import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  _id: string;
  titre: string;
  date_event: Date | string;
  description: string;
  photo?: string;
}

interface EventCarouselProps {
  events: Event[];
  selectedYear?: string;
}

const EventCarousel: React.FC<EventCarouselProps> = ({ events, selectedYear }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-défilement toutes les 10 secondes
  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === events.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [events.length]);

  // Reset index when events change
  useEffect(() => {
    setCurrentIndex(0);
  }, [events]);

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
          Aucun événement trouvé
        </h3>
        <p className="text-gray-400 dark:text-gray-500">
          {selectedYear ? `Aucun événement pour l'année ${selectedYear}` : "Sélectionnez une année pour voir les événements"}
        </p>
      </div>
    );
  }

  const currentEvent = events[currentIndex];

  return (
    <div className="relative w-full">
      {/* Header avec l'année */}
      {selectedYear && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
            Événements de{" "}
            <span className="relative inline-block">
              {selectedYear}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary"></span>
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {events.length} événement{events.length > 1 ? 's' : ''} trouvé{events.length > 1 ? 's' : ''}
          </p>
        </motion.div>
      )}

      {/* Carrousel */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-blacksection">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="relative"
          >
            {/* Image Section */}
            <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
              {currentEvent.photo ? (
                <Image
                  src={currentEvent.photo}
                  alt={currentEvent.titre}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <svg className="w-24 h-24 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 1.8 }}
                  className="text-xl md:text-2xl font-bold mb-2"
                >
                  {currentEvent.titre}
                </motion.h3>
                
                {/* <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-sm md:text-base text-gray-200"
                >
                  {new Date(currentEvent.date_event).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </motion.p> */}
              </div>
            </div>

            {/* Description Section */}
            <div className="p-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                {currentEvent.description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        {events.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125 shadow-lg'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation arrows */}
        {events.length > 1 && (
          <>
            <button
              onClick={() => {
                const newIndex = currentIndex === 0 ? events.length - 1 : currentIndex - 1;
                setCurrentIndex(newIndex);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => {
                const newIndex = currentIndex === events.length - 1 ? 0 : currentIndex + 1;
                setCurrentIndex(newIndex);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Progress indicator */}
        {events.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
            {currentIndex + 1} / {events.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCarousel;