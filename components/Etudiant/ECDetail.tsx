"use client";

import React, { useEffect, useState } from 'react';
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
  User,
  Loader2,
  Menu,
  X
} from 'lucide-react';
import EtudiantService from '@/app/services/EtudiantService';
import CommandeVerificationService from '@/app/services/CommandeVerificationService';
import PresenceConfirmationModal from './PresenceConfirmationModal';
import BlobManager from '@/app/services/BlobManager';
import TravailResultModal from './TravailResultModal';
import TravailService from '@/app/services/TravailService';
import ResolutionPayment from './ResolutionPayment';
import TransactionService from '@/app/services/TransactionService';
import ResolutionChecking from './ResolutionChecking';
import ResolutonSubmit from './ResolutionSubmit';

interface ECDetailProps {
  cours: Cours;
  semestre: string;
  unite: string;
  onBack: () => void;
}

const ECDetail: React.FC<ECDetailProps> = ({ cours, semestre, unite, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'seances' | 'travaux' | 'ressources'>('overview');
  const [checkingTravail, setCheckingTravail] = useState<string | null>(null);
  const [showPresenceModal, setShowPresenceModal] = useState(false);
  const [selectedSeance, setSelectedSeance] = useState<any>(null);
  const [presenceData, setPresenceData] = useState<any>(null);
  const [showTravailResultModal, setShowTravailResultModal] = useState(false);
  const [travailResultData, setTravailResultData] = useState<any>(null);
  // États pour la progression d'upload (utilisé dans la modal en 3 étapes)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [checkingResolution, setCheckingResolution] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // États pour la modal de commande en 3 étapes
  const [showCommandeModal, setShowCommandeModal] = useState(false);
  const [commandeStep, setCommandeStep] = useState(1);
  const [selectedTravail, setSelectedTravail] = useState<any>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isSubmittingResolution, setIsSubmittingResolution] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [commande, setCommande] = useState<{
        _id: string,
        productIds: string[],
        status: 'PENDING' | 'NO' | 'OK',
        reference: string,
        matricule: string,
        currency: string
    } | null>(null);
  const [error, setError] = useState<string | null>("Pour accéder à ce travail, vous devez d'abord effectuer le paiement.");
  const [checkingResolutionPayment, setCheckingPayment] = useState<any | null>(null);
  
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

  // Fonction pour formater le texte en liste basée sur \n
  const formatTextWithLineBreaks = (text: string) => {
    console.log("Current text : ", text);
    const lines = text.split('\n').filter(line => line.trim() !== '');
    console.log("Detail lignes :", lines);

    if (lines.length <= 1) {
      return <span>{text}</span>;
    }
    
    return (
      <>
        {lines.map((line, index) => (
          <p key={index} className="text-sm">
            {line.trim()}
          </p>
        ))}
      </>
    );
  };

  const checkTravail = async (travail: any) => {
    const produitId = typeof travail.produitId === 'object' ? travail.produitId._id : travail.produitId;
    
    if (!produitId) {
      console.error("Aucun produitId trouvé pour ce travail");
      return;
    }

    setCheckingTravail(produitId);

    try {
      await CommandeVerificationService.checkCommandeWithStoredMatricule(produitId, {
        onSuccess: (hasCommande, data) => {
          if (hasCommande) {
            // Si l'étudiant a commandé le produit, rediriger vers le questionnaire
            window.open(`${travail?.questionnaire}`, '_blank');
          } else {
            // Si l'étudiant n'a pas commandé le produit, rediriger vers la page produit
            window.open(`/produits/${produitId}`, '_blank');
          }
        },
        onError: (error) => {
          console.error("Erreur lors de la vérification du travail:", error);
          // En cas d'erreur, rediriger vers la page produit par défaut
          window.open(`/produits/${produitId}`, '_blank');
        },
        redirections: {
          error: `/produits/${produitId}`
        }
      });
    } catch (error) {
      console.error("Erreur lors de la vérification du travail:", error);
      // En cas d'erreur, rediriger vers la page produit par défaut
      window.open(`/produits/${produitId}`, '_blank');
    } finally {
      setCheckingTravail(null);
    }
  }

  const makingCommande = (data: {
        _id: string,
        productIds: string[],
        status: 'PENDING' | 'NO' | 'OK',
        reference: string,
        matricule: string,
        currency: string
    }) => {
    setCommande(data);
  }

  const checkTransaction = async (back_step = 2) => {
    try {
      const response = await TransactionService.checkPayment(commande?.reference as string);
      console.log(response?.data);
      const data = response?.data;
      if (data) {
        const {
          status,
          amount,
          amountCustomer,
          currency,
          createdAt
        } = data?.data as any;

        setCheckingPayment({
          status,
          amount,
          amountCustomer,
          currency,
          createdAt
        });

        console.log("Current status : ", status);
        if (status == "0") {
          setCommandeStep(3);
        } else {
          setCommandeStep(back_step);
        }
      } else {
        setError("Erreur lors de la vérification du paiement");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion. Veuillez réessayer.");
    }
  }

  const checkSeance = async (seance: {
    _id: string,
    status: 'PENDING' | 'NO' | 'OK',
    produitId: string,
    anneeId: string
  }) => {
    console.log("Current :", seance)
    try {
      await CommandeVerificationService.checkCommandeWithStoredMatricule(seance.produitId, {
        onSuccess: (hasCommande, data)=>{
          if (hasCommande) {
            // Afficher la modal de confirmation de présence
            setSelectedSeance(seance);
            setPresenceData(data);
            setShowPresenceModal(true);
          } else {
            // Si l'étudiant n'a pas commandé le produit, rediriger vers la page produit
            window.open(`/produits/${seance?.produitId}`, '_blank');
          }
        },
        onError: (error) => {
          console.error("Info error :", error);
        }
      });
    } catch (error) {
      console.error("Error occured : ", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-blacksection">
      {/* Header - Mobile First */}
      <div className="bg-white dark:bg-blacksection border-b border-gray-200 dark:border-strokedark sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-6">
            {/* Mobile: Bouton retour + Titre */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <button
                onClick={onBack}
                className="inline-flex items-center p-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-blacksection dark:border-strokedark dark:text-white dark:hover:bg-gray-800 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Retour à la liste</span>
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{cours.titre}</h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {semestre} • {unite} • {cours.credit} crédits
                </p>
              </div>
            </div>
            
            {/* Desktop: Badge + Mobile: Menu hamburger */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                <GraduationCap className="w-4 h-4 mr-1" />
                ECUE
              </span>
              {/* Bouton hamburger mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg border border-gray-300 dark:border-strokedark text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Desktop horizontal, Mobile vertical */}
      <div className="bg-white dark:bg-blacksection border-b border-gray-200 dark:border-strokedark">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <nav className="hidden sm:flex space-x-8">
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
          
          {/* Mobile Navigation - Menu déroulant */}
          {mobileMenuOpen && (
            <nav className="sm:hidden py-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          )}
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
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {formatTextWithLineBreaks(cours.description)}
                </div>
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
                        <div className="space-y-3">
                          {module.contenu.map((item, itemIndex) => (
                            <div key={itemIndex} className="text-gray-600 dark:text-gray-300">
                              <div className="leading-relaxed">
                                {formatTextWithLineBreaks(item)}
                              </div>
                            </div>
                          ))}
                        </div>
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
                            <button 
                              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-blacksection dark:border-strokedark dark:text-white"
                              onClick={() => checkSeance(seance as {
                                _id: string,
                                status: 'PENDING' | 'NO' | 'OK',
                                produitId: string,
                                anneeId: string
                              })}
                            >
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
                  <div className="space-y-4 sm:space-y-5">
                    {cours.travaux.map((travail: any, index) => (
                      <div key={index} className="border-2 border-gray-200 dark:border-strokedark rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50 dark:from-blacksection dark:to-gray-900">
                        {/* Mobile: Layout vertical, Desktop: Layout horizontal */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                          {/* En-tête du travail */}
                          <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                            <div className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-gradient-to-br from-green-400 to-green-600">
                              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
                                Travail {index + 1}
                              </h4>
                              <div className="flex items-center space-x-2 mb-3">
                                {getStatusBadge(travail.status)}
                              </div>
                              
                              {/* Bouton de résolution - Mobile: Pleine largeur, Desktop: Inline */}
                              <button 
                                className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={checkingResolution === travail._id}
                                onClick={async () => {
                                  setCheckingResolution(travail._id);
                                  try {
                                    const etudiantData = localStorage.getItem('studentFullData');
                                    const studentFullData = JSON.parse(etudiantData || '{}');
                                    const { etudiant } = studentFullData;

                                    // Vérifier si l'étudiant a déjà soumis une résolution
                                    const request = await EtudiantService.checkResoution(etudiant._id, travail._id);
                                    
                                    if (request.success) {
                                      // Afficher le résultat existant
                                      const { data } = request;
                                      const travailResult = {
                                        url: data.url,
                                        note: data?.note ?? 0,
                                        status: data.status,
                                        resolutionId: data._id
                                      };
                                      setTravailResultData(travailResult);
                                      setShowTravailResultModal(true);
                                    } else {
                                      // Ouvrir la modal de commande en 3 étapes
                                      setSelectedTravail(travail);
                                      setShowCommandeModal(true);
                                      setCommandeStep(1);
                                    }
                                  } catch (error) {
                                    console.error('Erreur:', error);
                                    // En cas d'erreur, ouvrir la modal de commande
                                    setSelectedTravail(travail);
                                    setShowCommandeModal(true);
                                    setCommandeStep(1);
                                  } finally {
                                    setCheckingResolution(null);
                                  }
                                }}
                              >
                                {checkingResolution === travail._id ? (
                                  <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Vérification en cours...
                                  </>
                                ) : (
                                  <>
                                    <FileText className="w-5 h-5 mr-2" />
                                    Soumettre ma résolution
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          
                          {/* Bouton Commencer - Desktop uniquement à droite, Mobile en bas */}
                          <div className="flex sm:flex-col items-center space-x-3 sm:space-x-0 sm:space-y-3 sm:ml-4">
                            <button 
                              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 border-2 border-primary rounded-lg text-sm sm:text-base font-semibold text-primary bg-white dark:bg-blacksection hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => checkTravail(travail)}
                              disabled={checkingTravail === (typeof travail.produitId === 'object' ? travail.produitId._id : travail.produitId)}
                            >
                              {checkingTravail === (typeof travail.produitId === 'object' ? travail.produitId._id : travail.produitId) ? (
                                <>
                                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                                  <span className="hidden sm:inline">Chargement...</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                  Commencer
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucun travail disponible</p>
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

      {/* Modal de confirmation de présence */}
      <PresenceConfirmationModal
        isOpen={showPresenceModal}
        onClose={() => {
          setShowPresenceModal(false);
          setSelectedSeance(null);
          setPresenceData(null);
        }}
        seance={selectedSeance}
        coursTitle={cours.titre}
        data={presenceData}
      />

      {/* Modal de résultat du travail */}
      {travailResultData && (
        <TravailResultModal
          isOpen={showTravailResultModal}
          onClose={() => {
            setShowTravailResultModal(false);
            setTravailResultData(null);
          }}
          travailData={travailResultData}
          travailTitle={cours.titre}
        />
      )}

      {/* Modal de commande en 3 étapes */}
      {showCommandeModal && selectedTravail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-blacksection rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête avec indicateur d'étapes */}
            <div className="border-b border-gray-200 dark:border-strokedark p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Commander le travail
              </h2>
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      commandeStep >= step
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {commandeStep > step ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-semibold">{step}</span>
                      )}
                    </div>
                    {step < 3 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        commandeStep > step
                          ? 'bg-primary'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                <span>Paiement</span>
                <span>Vérification</span>
                <span>Résolution</span>
              </div>
            </div>

            {/* Contenu des étapes */}
            <div className="p-6">
              {/* Étape 1: Paiement */}
              {commandeStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                      Étape 1: Effectuer le paiement
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {error}
                    </p>
                  </div>
                  <ResolutionPayment 
                    produit={selectedTravail.produitId} 
                    onSuccess={makingCommande}
                  />
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => {
                        setShowCommandeModal(false);
                        setCommandeStep(1);
                        setSelectedTravail(null);
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-strokedark rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => checkTransaction()}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center"
                    >
                      Vérifier le paiement
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Étape 2: Vérification du paiement */}
              {commandeStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
                      Étape 2: Vérifier votre paiement
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Cliquez sur le bouton ci-dessous pour vérifier que votre paiement a été confirmé.
                    </p>
                  </div>
                  {checkingResolutionPayment && <ResolutionChecking 
                    status={checkingResolutionPayment.status}
                    amount={checkingResolutionPayment.amount}
                    amountCustomer={checkingResolutionPayment.amountCustomer}
                    currency={checkingResolutionPayment.currency}
                    createdAt={checkingResolutionPayment.createdAt}
                    onClick={() => checkTransaction(1)}
                  />}
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setCommandeStep(1)}
                      className="px-4 py-2 border border-gray-300 dark:border-strokedark rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      disabled={isCheckingPayment}
                    >
                      Retour
                    </button>
                    <button
                      onClick={async () => {
                        setIsCheckingPayment(true);
                        try {
                          if(commande) {
                            await checkTransaction(2);
                          } else {
                            setError("Paiement non confirmé. Veuillez réessayer ou contacter le support.");
                          }
                        } catch (error) {
                          console.error('Erreur:', error);
                          setError("Erreur lors de la vérification. Veuillez réessayer.");
                        } finally {
                          setIsCheckingPayment(false);
                        }
                      }}
                      disabled={isCheckingPayment}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCheckingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Vérification...
                        </>
                      ) : (
                        <>
                          Continuer
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Étape 3: Soumission de la résolution */}
              {commandeStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-2">
                      Étape 3: Soumettre votre résolution
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Téléchargez votre fichier de résolution pour compléter le travail.
                    </p>
                  </div>

                  <ResolutonSubmit
                    uploadedFile={uploadedFile}
                    setUploadedFile={setUploadedFile}
                    uploadedFileUrl={uploadedFileUrl}
                    setUploadedFileUrl={setUploadedFileUrl}
                    isSubmittingResolution={isSubmittingResolution}
                    uploadSuccess={uploadSuccess}
                  />

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setCommandeStep(2)}
                      className="px-4 py-2 border border-gray-300 dark:border-strokedark rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      disabled={isSubmittingResolution}
                    >
                      Retour
                    </button>
                    <button
                      onClick={async () => {
                        if (!uploadedFile) {
                          alert('Veuillez sélectionner un fichier');
                          return;
                        }

                        setIsSubmittingResolution(true);
                        setUploadProgress(0);
                        setUploadSuccess(false);

                        try {
                          const etudiantData = localStorage.getItem('studentFullData');
                          const studentFullData = JSON.parse(etudiantData || '{}');
                          const { etudiant } = studentFullData;

                          // Upload du fichier
                          const uploadResult = await BlobManager.createBlob(
                            uploadedFile,
                            {
                              etudiantId: etudiant._id,
                              travailId: selectedTravail._id,
                              type: 'resolution'
                            },
                            (progress) => {
                              setUploadProgress(progress.percentage);
                            }
                          );

                          // Soumission de la résolution
                          const submitResult = await EtudiantService.submitResolution({
                            etudiantId: etudiant._id,
                            travailId: selectedTravail._id,
                            url: uploadResult.url
                          });

                          setIsSubmittingResolution(false);

                          if (submitResult.success) {
                            setUploadSuccess(true);
                            // Fermer la modal après 3 secondes
                            setTimeout(() => {
                              setShowCommandeModal(false);
                              setUploadSuccess(false);
                              // Réinitialiser les états
                              setUploadedFile(null);
                              setUploadedFileUrl('');
                              setCommandeStep(1);
                            }, 3000);
                          } else {
                            throw new Error(submitResult.message || 'Erreur lors de la soumission');
                          }
                        } catch (error) {
                          console.error('Erreur:', error);
                          alert('Erreur lors de la soumission. Veuillez réessayer.');
                        } finally {
                          setIsSubmittingResolution(false);
                        }
                      }}
                      disabled={!uploadedFile || isSubmittingResolution}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingResolution ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Soumettre la résolution
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ECDetail;
