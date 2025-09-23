"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Charge } from '@/app/services/SemestreService';

interface InscriptionData {
  matricule: string;
  telephone: string;
  email: string;
}

interface InscriptionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  charge: Charge | null;
  inscriptionData: InscriptionData;
  coursTitle: string;
  message: string;
}

const InscriptionConfirmationModal: React.FC<InscriptionConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  charge,
  inscriptionData,
  coursTitle,
  message
}) => {
  if (!charge) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-md rounded-xl border border-stroke bg-white shadow-xl dark:border-strokedark dark:bg-blacksection"
          >
            {/* Header */}
            <div className="border-b border-stroke p-6 dark:border-strokedark">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Confirmer l'inscription
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {message}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Cours et enseignant */}
              <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <h4 className="mb-2 font-medium text-blue-800 dark:text-blue-200">
                  Cours: {coursTitle}
                </h4>
                <div className="flex items-center gap-3">
                  {charge.agentId.photo && (
                    <img 
                      src={charge.agentId.photo} 
                      alt={`${charge.agentId.nom} ${charge.agentId.prenom}`}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Enseignant: {charge.agentId.nom} {charge.agentId.post_nom} {charge.agentId.prenom}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {charge.agentId.grade} - {charge.agentId.titre}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations de l'étudiant */}
              <div className="mb-6">
                <h4 className="mb-3 font-medium text-black dark:text-white">
                  Vos informations
                </h4>
                <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Matricule:</span>
                    <span className="text-sm font-medium text-black dark:text-white">{inscriptionData.matricule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Téléphone:</span>
                    <span className="text-sm font-medium text-black dark:text-white">{inscriptionData.telephone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="text-sm font-medium text-black dark:text-white">{inscriptionData.email}</span>
                  </div>
                </div>
              </div>

              {/* Message de confirmation */}
              <div className="mb-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Attention
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      En confirmant, vous vous inscrivez définitivement à cette charge horaire. 
                      Assurez-vous que toutes les informations sont correctes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-stroke p-6 dark:border-strokedark">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-strokedark dark:bg-blacksection dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  Confirmer l'inscription
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InscriptionConfirmationModal;
