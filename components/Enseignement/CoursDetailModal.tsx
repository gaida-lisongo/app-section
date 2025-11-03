"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SemestreService, { Cours, Charge } from '@/app/services/SemestreService';
import InscriptionConfirmationModal from './InscriptionConfirmationModal';
import { PDFGeneratorPdfMake } from '@/utils/PDFGeneratorPdfMake';

interface CoursDetailModalProps {
  cours: Cours | null;
  isOpen: boolean;
  onClose: () => void;
}

const CoursDetailModal: React.FC<CoursDetailModalProps> = ({ cours, isOpen, onClose }) => {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loadingCharges, setLoadingCharges] = useState(false);
  const [showInscriptionForm, setShowInscriptionForm] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<Charge | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [formData, setFormData] = useState({
    matricule: '',
    telephone: '',
    email: '',
    nom: ''
  });
  const [ficheId, setFicheId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('Vérifiez vos informations avant de confirmer');

  // Fonction utilitaire pour créer des clés uniques
  const createUniqueKey = (prefix: string, index: number) => {
    return `${prefix}-${index}-${Date.now()}`;
  };

  useEffect(() => {
    //Creating Fiche
    const createFiche = async () => {
      try {
        const response = await SemestreService.createFiche({
          chargeId: selectedCharge?._id || '',
        });
        console.log("Fiche created:", response);
        setFicheId(response._id);
      } catch (error) {
        console.error("Erreur lors de la création de la fiche:", error);
      }
    };

    selectedCharge && createFiche();
  }, [selectedCharge])

  useEffect(() => {
    const fetchCharges = async (id : string) => {
      try {
        setLoadingCharges(true);
        const chargesData = await SemestreService.getChargesByCours(id);
        console.log("Detail charges of cours : ", chargesData);
        setCharges(chargesData);
      } catch (error) {
        console.error("Erreur lors du chargement des charges:", error);
        setCharges([]);
      } finally {
        setLoadingCharges(false);
      }
    }
    
    if (isOpen && cours && cours._id) {
      fetchCharges(cours._id);
    }
  }, [cours?._id, isOpen]);

  if (!cours) return null;

  const handleInscriptionClick = (charge: Charge) => {
    setSelectedCharge(charge);
    setShowInscriptionForm(true);
  };

  const handleBackToCharges = () => {
    setShowInscriptionForm(false);
    setSelectedCharge(null);
    setFormData({ matricule: '', telephone: '', email: '', nom: '' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const makePayment = await SemestreService.createPaymentFiche({
        ficheId,
        matricule: formData.matricule,
        nom: formData.nom,
        phone: formData.telephone,
        email: formData.email
      });
      
      if (makePayment.reference) {
        setOrderNumber(makePayment.reference);
      }
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
    }
    // Ouvrir la modal de confirmation au lieu du console.log
    setShowConfirmationModal(true);
  };

  const handleConfirmInscription = async () => {
    try {
      console.log("Order number:", orderNumber);
      const checkPayment = await SemestreService.checkPayment(orderNumber);
      console.log("Payment checked:", checkPayment);
      
      if (checkPayment.status == '1') {
        setMessage(checkPayment?.message || 'Paiement en attente');
      } else if (checkPayment.status == '2') {
        // Paiement réussi - générer la facture
        await generateInvoice();
        setShowConfirmationModal(false);
        handleBackToCharges();
        setMessage(checkPayment?.message || 'Paiement effectué avec succès - Facture téléchargée');
      } else {
        setMessage(checkPayment?.message || 'Échec du paiement');
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du paiement:", error);
      setMessage('Erreur lors de la vérification du paiement');
    }
  };

  const generateInvoice = async () => {
    try {
      if (!selectedCharge || !cours) {
        console.error("Données manquantes pour générer la facture");
        return;
      }

      // Générer les données de la facture
      const { invoiceData, qrCodeUrl } = await SemestreService.generateInscriptionInvoice({
        charge: selectedCharge,
        cours: cours,
        inscriptionData: formData,
        orderNumber: orderNumber
      });

      // Créer une instance du générateur PDF et générer la facture
      const pdfGenerator = new PDFGeneratorPdfMake();
      await pdfGenerator.generateCourseInscriptionPDF({...invoiceData, annee: selectedCharge.anneeId}, qrCodeUrl);

      console.log("Facture générée avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération de la facture:", error);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmationModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-stroke bg-white shadow-xl dark:border-strokedark dark:bg-blacksection"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stroke p-6 dark:border-strokedark">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    {cours.titre}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {cours.credit} crédit{cours.credit > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
              {/* Description */}
              <div className="mb-6">
                <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
                  Description
                </h4>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <p className="text-gray-700 dark:text-gray-300">
                    {cours.description || 'Aucune description disponible pour ce cours.'}
                  </p>
                </div>
              </div>

              {/* Informations générales */}
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-blacksection">
                  <h5 className="mb-3 font-semibold text-black dark:text-white">Informations</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Crédits:</span>
                      <span className="font-medium text-black dark:text-white">{cours.credit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Séances:</span>
                      <span className="font-medium text-black dark:text-white">{cours.seances?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Travaux:</span>
                      <span className="font-medium text-black dark:text-white">{cours.travaux?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-blacksection">
                  <h5 className="mb-3 font-semibold text-black dark:text-white">Ressources</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ressources:</span>
                      <span className="font-medium text-black dark:text-white">{cours.ressources?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                      <span className="font-medium text-black dark:text-white">{cours.plan?.length || 0} éléments</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Contenu:</span>
                      <span className="font-medium text-black dark:text-white">{cours.contenu?.length || 0} éléments</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan du cours */}
              {cours.plan && cours.plan.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    Plan du cours
                  </h4>
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <ul className="space-y-2">
                      {cours.plan.map((item, index) => (
                        <li key={createUniqueKey('plan', index)} className="flex items-start gap-2">
                          <span className="mt-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Contenu du cours */}
              {cours.contenu && cours.contenu.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    Contenu détaillé
                  </h4>
                  <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                    <ul className="space-y-2">
                      {cours.contenu.map((item, index) => (
                        <li key={createUniqueKey('contenu', index)} className="flex items-start gap-2">
                          <div className="mt-1.5 h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Répartition */}
              {cours.repartition && cours.repartition.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    Répartition
                  </h4>
                  <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                    <ul className="space-y-2">
                      {cours.repartition.map((item, index) => (
                        <li key={createUniqueKey('repartition', index)} className="flex items-start gap-2">
                          <div className="mt-1.5 h-2 w-2 rounded-full bg-purple-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Pénalités */}
              {cours.penalites && cours.penalites.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    Pénalités
                  </h4>
                  <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                    <ul className="space-y-2">
                      {cours.penalites.map((item, index) => (
                        <li key={createUniqueKey('penalites', index)} className="flex items-start gap-2">
                          <div className="mt-1.5 h-2 w-2 rounded-full bg-red-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Plagiat */}
              {cours.plagiat && cours.plagiat.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    Politique anti-plagiat
                  </h4>
                  <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                    <ul className="space-y-2">
                      {cours.plagiat.map((item, index) => (
                        <li key={createUniqueKey('plagiat', index)} className="flex items-start gap-2">
                          <div className="mt-1.5 h-2 w-2 rounded-full bg-orange-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Charges horaires ou Formulaire d'inscription */}
              {showInscriptionForm ? (
                /* Formulaire d'inscription */
                <div className="mb-6">
                  <div className="mb-4 flex items-center gap-4">
                    <button
                      onClick={handleBackToCharges}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Retour aux charges horaires
                    </button>
                  </div>
                  
                  <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
                    Inscription à la charge horaire
                  </h4>
                  
                  {selectedCharge && (
                    <div className="mb-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <h5 className="font-medium text-blue-800 dark:text-blue-200">
                        Enseignant: {selectedCharge.agentId.nom} {selectedCharge.agentId.post_nom} {selectedCharge.agentId.prenom}
                      </h5>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        Grade: {selectedCharge.agentId.grade} | Titre: {selectedCharge.agentId.titre}
                      </p>
                    </div>
                  )}
                  
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom complet de l'étudiant *
                      </label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-stroke px-4 py-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-blacksection dark:text-white"
                        placeholder="Entrez votre nom"
                      />
                    </div>
                    <div>
                      <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Matricule étudiant *
                      </label>
                      <input
                        type="text"
                        id="matricule"
                        name="matricule"
                        value={formData.matricule}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-stroke px-4 py-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-blacksection dark:text-white"
                        placeholder="Entrez votre matricule"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Numéro de téléphone *
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-stroke px-4 py-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-blacksection dark:text-white"
                        placeholder="Ex: +243 123 456 789"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Adresse e-mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-stroke px-4 py-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-blacksection dark:text-white"
                        placeholder="exemple@email.com"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleBackToCharges}
                        className="flex-1 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-strokedark dark:bg-blacksection dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                      >
                        S'inscrire
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Liste des charges horaires */
                <div className="mb-6">
                  <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
                    Charges horaires disponibles ({charges.length})
                  </h4>
                  
                  {loadingCharges ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement des charges...</span>
                    </div>
                  ) : charges.length > 0 ? (
                    <div className="space-y-3">
                      {charges.map((charge, index) => (
                        <motion.div
                          key={charge._id || `charge-${index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.1 }}
                          className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-blacksection"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {charge.agentId.photo && (
                                  <img 
                                    src={charge.agentId.photo} 
                                    alt={`${charge.agentId.nom} ${charge.agentId.prenom}`}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                )}
                                <div>
                                  <h5 className="font-semibold text-black dark:text-white">
                                    {charge.agentId.nom} {charge.agentId.post_nom} {charge.agentId.prenom}
                                  </h5>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {charge.agentId.grade} - {charge.agentId.titre}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span>Matricule: {charge.agentId.matricule}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  charge.status === 'active' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}>
                                  {charge.anneeId.debut} - {charge.anneeId.fin}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleInscriptionClick(charge)}
                              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                            >
                              S'inscrire
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        Aucune charge horaire disponible
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Aucune charge horaire n'est actuellement disponible pour ce cours.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-stroke p-6 dark:border-strokedark">
              <div className="flex justify-between items-center">
                {/* Bouton de téléchargement de facture (visible seulement si orderNumber existe) */}
                {orderNumber && (
                  <button
                    onClick={generateInvoice}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Télécharger la facture
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-strokedark dark:bg-blacksection dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Fermer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de confirmation d'inscription */}
      <InscriptionConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmInscription}
        charge={selectedCharge}
        inscriptionData={formData}
        coursTitle={cours.titre}
        message={message}
      />
    </AnimatePresence>
  );
};

export default CoursDetailModal;
