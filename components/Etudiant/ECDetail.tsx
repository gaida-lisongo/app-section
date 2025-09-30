"use client";

import React, { useState } from 'react';
import { Cours } from '@/types/etudiant';
import { 
  ArrowLeft,
  BookOpen, 
  Calendar,
  Clock,
  FileText,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Download,
  ExternalLink,
  GraduationCap,
  User
} from 'lucide-react';

interface ECDetailProps {
  cours: Cours;
  semestre: string;
  unite: string;
  onBack: () => void;
}

const ECDetail: React.FC<ECDetailProps> = ({ cours, semestre, unite, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'seances' | 'travaux' | 'ressources'>('overview');

  const getStatusBadge = (status: 'PENDING' | 'OK' | 'NO') => {
    switch (status) {
      case 'OK':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Disponible</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />En attente</span>;
      case 'NO':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Non disponible</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inconnu</span>;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BookOpen },
    { id: 'plan', label: 'Plan du cours', icon: FileText },
    { id: 'seances', label: 'Séances', icon: Calendar },
    { id: 'travaux', label: 'Travaux', icon: Target },
    { id: 'ressources', label: 'Ressources', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-blacksection">
      {/* Header */}
      <div className="bg-white dark:bg-blacksection border-b border-gray-200 dark:border-strokedark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-blacksection dark:border-strokedark dark:text-white dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la liste
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{cours.titre}</h1>
                <p className="text-sm text-gray-500">
                  {semestre} • {unite} • {cours.credit} crédits
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <GraduationCap className="w-4 h-4 mr-1" />
                ECUE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-blacksection border-b border-gray-200 dark:border-strokedark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-blacksection rounded-lg shadow-sm border border-gray-200 dark:border-strokedark">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description du cours</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{cours.description}</p>
              </div>
            </div>

            {/* Informations générales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-blacksection rounded-lg shadow-sm border border-gray-200 dark:border-strokedark">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations générales</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Crédits</dt>
                      <dd className="text-sm text-gray-900 dark:text-white">{cours.credit} ECTS</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Semestre</dt>
                      <dd className="text-sm text-gray-900 dark:text-white">{semestre}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Unité d'enseignement</dt>
                      <dd className="text-sm text-gray-900 dark:text-white">{unite}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-white dark:bg-blacksection rounded-lg shadow-sm border border-gray-200 dark:border-strokedark">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistiques</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{cours.seances?.length || 0}</div>
                      <div className="text-sm text-gray-500">Séances</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{cours.travaux?.length || 0}</div>
                      <div className="text-sm text-gray-500">Travaux</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{cours.ressources?.length || 0}</div>
                      <div className="text-sm text-gray-500">Ressources</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{cours.plan?.length || 0}</div>
                      <div className="text-sm text-gray-500">Modules</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enseignement */}
            {cours.enseignement && cours.enseignement.length > 0 && (
              <div className="bg-white dark:bg-blacksection rounded-lg shadow-sm border border-gray-200 dark:border-strokedark">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Méthodes d'enseignement</h3>
                  <div className="flex flex-wrap gap-2">
                    {cours.enseignement.map((methode, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {methode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-blacksection rounded-lg shadow-sm border border-gray-200 dark:border-strokedark">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Plan du cours</h3>
                {cours.plan && cours.plan.length > 0 ? (
                  <div className="space-y-4">
                    {cours.plan.map((module, index) => (
                      <div key={index} className="border border-gray-200 dark:border-strokedark rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Module {index + 1} - {typeof module.anneeId === 'object' ? module.anneeId.debut + ' - ' + module.anneeId.fin : module.anneeId}
                        </h4>
                        <ul className="space-y-1">
                          {module.contenu.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                              <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucun plan de cours disponible</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seances' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-blacksection rounded-lg shadow-sm border border-gray-200 dark:border-strokedark">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Séances de cours</h3>
                {cours.seances && cours.seances.length > 0 ? (
                  <div className="space-y-4">
                    {cours.seances.map((seance, index) => (
                      <div key={index} className="border border-gray-200 dark:border-strokedark rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <Calendar className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">Séance {index + 1}</h4>
                              <p className="text-sm text-gray-500">
                                Année: {typeof seance.anneeId === 'object' ? seance.anneeId.debut + ' - ' + seance.anneeId.fin : seance.anneeId}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(seance.status)}
                            <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-blacksection dark:border-strokedark dark:text-white">
                              <Play className="w-4 h-4 mr-1" />
                              Rejoindre
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune séance programmée</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'travaux' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-blacksection rounded-lg shadow-sm border border-gray-200 dark:border-strokedark">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Travaux et évaluations</h3>
                {cours.travaux && cours.travaux.length > 0 ? (
                  <div className="space-y-4">
                    {cours.travaux.map((travail, index) => (
                      <div key={index} className="border border-gray-200 dark:border-strokedark rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <Target className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">Travail {index + 1}</h4>
                              <p className="text-sm text-gray-500">
                                Année: {typeof travail.anneeId === 'object' ? travail.anneeId.debut + ' - ' + travail.anneeId.fin : travail.anneeId}
                              </p>
                              {/* {travail.questionnaire && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{travail.questionnaire}</p>
                              )} */}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(travail.status)}
                            <a 
                              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-blacksection dark:border-strokedark dark:text-white"
                              href={`/produits/${typeof travail.produitId == "object" ? travail.produitId?._id : typeof travail?.questionnaire}`}

                              target='_blank'
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Voir détails
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucun travail assigné</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ressources' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-blacksection rounded-lg shadow-sm border border-gray-200 dark:border-strokedark">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Ressources pédagogiques</h3>
                {cours.ressources && cours.ressources.length > 0 ? (
                  <div className="space-y-3">
                    {cours.ressources.map((ressource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-strokedark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-center space-x-3">
                          <Download className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{ressource}</span>
                        </div>
                        <button className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Télécharger
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune ressource disponible</p>
                )}

                {/* Pénalités et Plagiat */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {cours.penalites && cours.penalites.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <h4 className="font-medium text-red-900 dark:text-red-200 mb-2">Pénalités</h4>
                      <ul className="space-y-1">
                        {cours.penalites.map((penalite, index) => (
                          <li key={index} className="text-sm text-red-700 dark:text-red-300">• {penalite}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cours.plagiat && cours.plagiat.length > 0 && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                      <h4 className="font-medium text-orange-900 dark:text-orange-200 mb-2">Politique anti-plagiat</h4>
                      <ul className="space-y-1">
                        {cours.plagiat.map((regle, index) => (
                          <li key={index} className="text-sm text-orange-700 dark:text-orange-300">• {regle}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ECDetail;
