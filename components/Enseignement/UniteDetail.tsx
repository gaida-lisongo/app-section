"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UniteDetails, Cours } from '@/app/services/SemestreService';
import CoursDetailModal from './CoursDetailModal';

interface UniteDetailProps {
  unite: UniteDetails;
  onBack: () => void;
}

const UniteDetail: React.FC<UniteDetailProps> = ({ unite, onBack }) => {
  const [selectedCours, setSelectedCours] = useState<Cours | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalCreditsCours = unite.cours?.reduce((total, cours) => total + (cours.credit || 0), 0) || 0;

  const handleCoursClick = (cours: Cours) => {
    setSelectedCours(cours);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCours(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-blacksection"
    >
      {/* Header avec bouton retour */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
        <div className="mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center rounded-lg bg-white/20 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au semestre
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
              UE
            </div>
            <div>
              <h3 className="text-2xl font-bold">{unite.descripteur?.designation || 'Unité d\'enseignement'}</h3>
              <p className="text-white/80">
                {unite.descripteur?.code} • {unite.descripteur?.credit || 0} crédits
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-white/80">Type</div>
            <div className="text-xl font-bold">
              {unite.descripteur?.type === 'Obigatoire' ? 'Obligatoire' : 'Optionnelle'}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        {/* Informations générales */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
              Informations générales
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Code:</span>
                <span className="font-medium text-black dark:text-white">{unite.descripteur?.code || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Crédits:</span>
                <span className="font-medium text-black dark:text-white">{unite.descripteur?.credit || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <span className={`font-medium ${
                  unite.descripteur?.type === 'Obigatoire' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {unite.descripteur?.type === 'Obigatoire' ? 'Obligatoire' : 'Optionnelle'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Mention:</span>
                <span className="font-medium text-black dark:text-white">{unite.descripteur?.mention || 'Non spécifiée'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
              Statistiques
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Nombre de cours:</span>
                <span className="font-medium text-black dark:text-white">{unite.cours?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total crédits cours:</span>
                <span className="font-medium text-black dark:text-white">{totalCreditsCours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Responsables:</span>
                <span className="font-medium text-black dark:text-white">{unite.responsable?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Objectifs */}
        {unite.descripteur?.objectif && unite.descripteur.objectif.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
              Objectifs
            </h4>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <ul className="space-y-2">
                {unite.descripteur.objectif.map((objectif, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">{objectif}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Compétences */}
        {unite.descripteur?.competences && unite.descripteur.competences.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
              Compétences
            </h4>
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <ul className="space-y-2">
                {unite.descripteur.competences.map((competence, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">{competence}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Liste des cours */}
        <div className="mb-6">
          <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Cours associés ({unite.cours?.length || 0})
          </h4>
          
          {unite.cours && unite.cours.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {unite.cours.map((cours, index) => (
                <CoursCard key={cours._id} cours={cours} index={index} onCoursClick={handleCoursClick} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                Aucun cours disponible
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Aucun cours n'est actuellement associé à cette unité d'enseignement.
              </p>
            </div>
          )}
        </div>

        {/* Approches pédagogiques */}
        {unite.descripteur?.approches && unite.descripteur.approches.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
              Approches pédagogiques
            </h4>
            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
              <ul className="space-y-2">
                {unite.descripteur.approches.map((approche, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">{approche}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Évaluation */}
        {unite.descripteur?.evaluation && unite.descripteur.evaluation.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
              Modalités d'évaluation
            </h4>
            <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
              <ul className="space-y-2">
                {unite.descripteur.evaluation.map((evaluation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-orange-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">{evaluation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Modal pour les détails du cours */}
      <CoursDetailModal 
        cours={selectedCours}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </motion.div>
  );
};

// Composant pour afficher une carte de cours
interface CoursCardProps {
  cours: Cours;
  index: number;
  onCoursClick: (cours: Cours) => void;
}

const CoursCard: React.FC<CoursCardProps> = ({ cours, index, onCoursClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-blacksection overflow-hidden"
    >
      {/* Image header */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src="/images/features/cours.jpg" 
          alt="Cours"
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-primary shadow-sm">
            {cours.credit} crédit{cours.credit > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h5 className="font-semibold text-black dark:text-white line-clamp-2">
            {cours.titre}
          </h5>
        </div>
        
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {cours.description || 'Aucune description disponible'}
        </p>
        
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{cours.seances?.length || 0} séances</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{cours.travaux?.length || 0} travaux</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{cours.ressources?.length || 0} ressources</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{cours.plan?.length || 0} éléments</span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onCoursClick(cours)}
          className="w-full rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white dark:bg-blacksection dark:hover:bg-primary"
        >
          Voir les détails
        </button>
      </div>
    </motion.div>
  );
};

export default UniteDetail;
