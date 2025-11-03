"use client";

import React from 'react';
import { X, FileText, ExternalLink, Award, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TravailResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  travailData: {
    url: string;
    note: number;
    status: 'PENDING' | 'OK' | 'NO';
  };
  travailTitle?: string;
}

const TravailResultModal: React.FC<TravailResultModalProps> = ({
  isOpen,
  onClose,
  travailData,
  travailTitle = "Travail"
}) => {
  if (!isOpen) return null;

  const getStatusBadge = (status: 'PENDING' | 'OK' | 'NO') => {
    switch (status) {
      case 'OK':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            Validé
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-4 h-4 mr-2" />
            En attente
          </span>
        );
      case 'NO':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-2" />
            Non validé
          </span>
        );
      default:
        return null;
    }
  };

  const getNoteColor = (note: number) => {
    if (note >= 16) return 'text-green-600';
    if (note >= 12) return 'text-blue-600';
    if (note >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNoteBackground = (note: number) => {
    if (note >= 16) return 'bg-green-50 border-green-200';
    if (note >= 12) return 'bg-blue-50 border-blue-200';
    if (note >= 10) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-blacksection rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-strokedark">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Résultat du travail
              </h3>
              <p className="text-sm text-gray-500 mt-1">{travailTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Note Section */}
            <div className={`border-2 rounded-lg p-6 text-center ${getNoteBackground(travailData.note)}`}>
              <div className="flex items-center justify-center mb-3">
                <Award className={`w-8 h-8 ${getNoteColor(travailData.note)}`} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Note obtenue
              </p>
              <div className={`text-5xl font-bold ${getNoteColor(travailData.note)}`}>
                {travailData.note}
                <span className="text-2xl">/20</span>
              </div>
              <div className="mt-4">
                {getStatusBadge(travailData.status)}
              </div>
            </div>

            {/* Appreciation */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {travailData.note >= 16 && "Excellent travail ! 🎉"}
                {travailData.note >= 12 && travailData.note < 16 && "Très bon travail ! 👍"}
                {travailData.note >= 10 && travailData.note < 12 && "Travail satisfaisant 👌"}
                {travailData.note < 10 && "Continuez vos efforts 💪"}
              </p>
            </div>

            {/* Resolution Link */}
            <div className="border border-gray-200 dark:border-strokedark rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Votre résolution
                    </p>
                    <p className="text-xs text-gray-500">
                      Cliquez pour consulter
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(travailData.url, '_blank')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Voir
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-strokedark">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravailResultModal;
