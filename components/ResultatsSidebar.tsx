'use client';

import React from 'react';
import { 
  User, 
  BookOpen, 
  BarChart3, 
  FileText, 
  Download,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import { ResultatResponse } from '@/types/resultat';

interface ResultatsSidebarProps {
  resultats: ResultatResponse;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ResultatsSidebar: React.FC<ResultatsSidebarProps> = ({
  resultats,
  activeSection,
  onSectionChange
}) => {
  const menuItems = [
    {
      id: 'profil',
      label: 'Profil Étudiant',
      icon: User,
      description: 'Informations personnelles'
    },
    {
      id: 'semestres',
      label: 'Notes par Semestre',
      icon: BookOpen,
      description: `${resultats.data.semestres.length} semestres`,
      count: resultats.data.semestres.length
    },
    {
      id: 'statistiques',
      label: 'Statistiques',
      icon: BarChart3,
      description: 'Analyse des performances'
    },
    {
      id: 'evolution',
      label: 'Évolution',
      icon: TrendingUp,
      description: 'Progression académique'
    },
    {
      id: 'synthese',
      label: 'Synthèse',
      icon: Award,
      description: 'Bilan global'
    },
    {
      id: 'export',
      label: 'Télécharger PDF',
      icon: Download,
      description: 'Bulletin officiel'
    }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* En-tête */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Bulletin de Notes</h2>
            <p className="text-sm text-gray-600">Consultation des résultats</p>
          </div>
        </div>
        
        {/* Info étudiant */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">
            {resultats.data.etudiant.prenom} {resultats.data.etudiant.nom}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            Matricule: {resultats.data.etudiant.matricule}
          </p>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            Consulté le {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Menu de navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{item.label}</span>
                    {item.count && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Statistiques rapides */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Aperçu Rapide</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Moyenne générale</span>
            <span className="text-sm font-bold text-blue-600">
              {(resultats.data.statistiques.moyenneGenerale || 0).toFixed(2)}/20
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Taux de réussite</span>
            <span className="text-sm font-bold text-green-600">
              {(resultats.data.statistiques.pourcentageReussite || 0).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Crédits validés</span>
            <span className="text-sm font-bold text-purple-600">
              {resultats.data.statistiques.creditsValides || 0}/{resultats.data.statistiques.totalCredits || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultatsSidebar;
