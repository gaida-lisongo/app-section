"use client";

import React from 'react';
import { CheckCircle, X, Calendar, Clock, User } from 'lucide-react';

interface PresenceConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  seance: {
    _id: string;
    status: 'PENDING' | 'NO' | 'OK';
    produitId: string;
    anneeId: string;
  };
  coursTitle?: string;
  data?: any;
}

const PresenceConfirmationModal: React.FC<PresenceConfirmationModalProps> = ({
  isOpen,
  onClose,
  seance,
  coursTitle,
  data
}) => {
  if (!isOpen) return null;

  const formatAnneeId = (anneeId: string | any) => {
    if (typeof anneeId === 'object' && anneeId.debut && anneeId.fin) {
      return `${anneeId.debut} - ${anneeId.fin}`;
    }
    return anneeId;
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white dark:bg-blacksection rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-strokedark">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Présence confirmée
                </h3>
                <p className="text-sm text-gray-500">
                  Votre participation a été enregistrée
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Success Message */}
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Félicitations !
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Votre présence à cette séance a été prise en compte avec succès.
              </p>
            </div>

            {/* Seance Details */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                Détails de la séance
              </h5>
              
              {coursTitle && (
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Cours:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      {coursTitle}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Année académique:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    {formatAnneeId(seance.anneeId)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Heure d'enregistrement:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    {new Date().toLocaleString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {data && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Information:</strong> Vos données de présence ont été synchronisées 
                  avec le système académique.
                </p>
              </div>
            )}

            {/* Benefits */}
            <div className="mt-6 space-y-2">
              <h6 className="text-sm font-medium text-gray-900 dark:text-white">
                Avantages de votre présence:
              </h6>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Participation comptabilisée</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Accès aux ressources de la séance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Points de présence attribués</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-strokedark">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Parfait !
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PresenceConfirmationModal;
