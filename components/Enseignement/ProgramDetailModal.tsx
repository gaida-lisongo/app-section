"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Classe } from "@/app/services/CycleService";
import SemestreService, { SemestreWithUnites } from "@/app/services/SemestreService";

interface ProgramDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classe: Classe | null;
  sectionLogo?: string;
}

const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  isOpen,
  onClose,
  classe,
  sectionLogo = "/images/brand/brand-light-01.svg"
}) => {
  const [semestres, setSemestres] = useState<SemestreWithUnites[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && classe) {
      fetchSemestres();
    }
  }, [isOpen, classe]);

  const fetchSemestres = async () => {
    if (!classe) return;
    
    setLoading(true);
    try {
      const semestrePromises = classe.semestres.map(semestreId => 
        SemestreService.getSemestre(semestreId)
      );
      const semestreData = await Promise.all(semestrePromises);
      setSemestres(semestreData.filter(Boolean));
    } catch (error) {
      console.error("Erreur lors du chargement des semestres:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!classe) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-blacksection">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-primary to-secondary p-6 text-white">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 p-3">
                    <Image
                      src={sectionLogo}
                      alt="Section Logo"
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{classe.designation}</h2>
                    <p className="text-white/80">
                      {classe.semestres.length} semestre{classe.semestres.length > 1 ? 's' : ''} • Programme complet
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto p-6">
                {/* Description */}
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    Description du programme
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {classe.description || "Ce programme d'études offre une formation complète et structurée pour préparer les étudiants aux défis professionnels de leur domaine."}
                  </p>
                </div>

                {/* Semestres */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                    Semestres et matières
                  </h3>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {semestres.map((semestre, index) => (
                        <motion.div
                          key={semestre._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                              S{index + 1}
                            </div>
                            <h4 className="font-semibold text-black dark:text-white">
                              {semestre.designation}
                            </h4>
                          </div>
                          
                          <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                            {semestre.description}
                          </p>

                          {semestre.unites && semestre.unites.length > 0 && (
                            <div>
                              <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                Unités d'enseignement ({semestre.unites.length})
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {semestre.unites.slice(0, 3).map((unite, uniteIndex) => (
                                  <span
                                    key={uniteIndex}
                                    className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                                  >
                                    {unite?.descripteur?.designation}
                                  </span>
                                ))}
                                {semestre.unites.length > 3 && (
                                  <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                    +{semestre.unites.length - 3} autres
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Programme détaillé • {classe.semestres.length} semestres
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProgramDetailModal;
